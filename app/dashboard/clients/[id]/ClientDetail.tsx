"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowLeft, BadgePlus, CircleCheck, KeyRound, Mail, Pencil, Phone, ShieldOff, ShieldCheck } from "lucide-react";
import { AssignMembershipModal, CancelMembershipModal, SubmitButton, TempPassword } from "@/app/components/dashboard/forms";
import { FormError, TextField } from "@/app/components/dashboard/fields";
import { useSession } from "@/app/components/dashboard/session";
import { useToast } from "@/app/components/dashboard/toast";
import { Async, Badge, EmptyState, Modal, Panel, Table } from "@/app/components/dashboard/ui";
import { buttonClasses } from "@/app/components/ui/Button";
import { api, ApiError, errorMessage } from "@/lib/api/client";
import type { ClientDetail as Detail, MembershipRecord, Plan } from "@/lib/api/types";
import { useApi } from "@/lib/api/use-api";
import { formatDate, formatDateTime, fullName, paymentMethodLabels, peso, roleLabels } from "@/lib/format";

export function ClientDetail({ id }: { id: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const { user: me } = useSession();
  const detail = useApi<Detail>(`/users/${id}`);
  const plans = useApi<Plan[]>("/plans/all");
  const [assigning, setAssigning] = useState(params.get("assign") === "1");
  const [editing, setEditing] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<MembershipRecord | null>(null);
  const [busy, setBusy] = useState(false);
  // Fixed "now" for this view so statuses don't shift between re-renders.
  const [now] = useState(() => Date.now());

  async function run(action: () => Promise<unknown>, success: string) {
    setBusy(true);
    try {
      await action();
      toast(success);
      detail.reload();
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  async function checkIn() {
    setBusy(true);
    try {
      await api("/check-ins", { method: "POST", body: { userId: id } });
      toast("Checked in.");
      detail.reload();
    } catch (err) {
      toast(errorMessage(err), "error");
      // No active plan: go straight to assigning one.
      if (err instanceof ApiError && err.code === "NO_ACTIVE_ACCESS") setAssigning(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Link href="/dashboard/clients" className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft size={16} aria-hidden /> Clients
      </Link>

      <Async state={detail}>
        {({ user, memberships, payments, checkIns }) => {
          const current = memberships.find(
            (m) => m.status === "ACTIVE" && +new Date(m.startsAt) <= now && +new Date(m.endsAt) >= now,
          );
          const name = fullName(user);
          const isClient = user.role === "MEMBER" || user.role === "CUSTOMER";

          return (
            <>
              <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={user.role === "MEMBER" ? "green" : "gray"}>{roleLabels[user.role]}</Badge>
                    {user.status === "DISABLED" && <Badge tone="red">Disabled</Badge>}
                  </div>
                  <h1 className="mt-3 font-display text-3xl font-black uppercase tracking-[-0.02em] text-white md:text-4xl">{name}</h1>
                  <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-zinc-400">
                    <a href={`mailto:${user.email}`} className="inline-flex items-center gap-1.5 hover:text-white">
                      <Mail size={14} aria-hidden /> {user.email}
                    </a>
                    {user.phone && (
                      <a href={`tel:${user.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 hover:text-white">
                        <Phone size={14} aria-hidden /> {user.phone}
                      </a>
                    )}
                    <span>Joined {formatDate(user.createdAt)}</span>
                  </p>
                </div>
                {isClient && (
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={checkIn} disabled={busy || user.status === "DISABLED"} className={buttonClasses("primary", "md", "disabled:opacity-50")}>
                      <CircleCheck size={16} aria-hidden /> Check in
                    </button>
                    <button type="button" onClick={() => setAssigning(true)} className={buttonClasses("outline", "md")}>
                      <BadgePlus size={16} aria-hidden /> {current ? "Renew / add plan" : "Assign membership"}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_20rem]">
                <div className="space-y-4">
                  <Panel title="Memberships & passes" padded={false}>
                    {memberships.length === 0 ? (
                      <EmptyState title="No memberships yet" />
                    ) : (
                      <Table head={["Plan", "Dates", "Status", ""]}>
                        {memberships.map((m) => {
                          const live = m.status === "ACTIVE" && +new Date(m.endsAt) >= now;
                          const upcoming = live && +new Date(m.startsAt) > now;
                          return (
                            <tr key={m.id}>
                              <td className="px-5 py-3 font-medium text-white">{m.planName}</td>
                              <td className="px-5 py-3 text-zinc-400">
                                {formatDate(m.startsAt, { month: "short", day: "numeric" })} – {formatDate(m.endsAt)}
                              </td>
                              <td className="px-5 py-3">
                                {m.status === "CANCELLED" ? (
                                  <span className="block">
                                    <Badge tone="red">Cancelled</Badge>
                                    <span className="mt-1 block max-w-xs text-xs text-zinc-500">
                                      {m.cancelledAt && `${formatDate(m.cancelledAt, { month: "short", day: "numeric" })} · `}
                                      {m.cancellationReason ?? "No reason recorded"}
                                    </span>
                                  </span>
                                ) : upcoming ? (
                                  <Badge tone="blue">Starts soon</Badge>
                                ) : live ? (
                                  <Badge tone="green">Active</Badge>
                                ) : (
                                  <Badge tone="gray">Ended</Badge>
                                )}
                              </td>
                              <td className="px-5 py-3 text-right">
                                {live && (
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => setCancelling(m)}
                                    className="text-xs font-semibold text-zinc-500 hover:text-red-300"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </Table>
                    )}
                  </Panel>

                  <Panel title="Payments" padded={false}>
                    {payments.length === 0 ? (
                      <EmptyState title="No payments recorded" />
                    ) : (
                      <Table head={["Date", "Amount", "Method", "Note"]}>
                        {payments.map((p) => (
                          <tr key={p.id}>
                            <td className="px-5 py-3 text-zinc-400">{formatDateTime(p.createdAt)}</td>
                            <td className="whitespace-nowrap px-5 py-3 font-semibold tabular-nums text-white">
                              {peso(p.amountCents)}
                              {p.amountCents < 0 && (
                                <span className="ml-2 align-middle">
                                  <Badge tone="red">Refund</Badge>
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3 text-zinc-400">{paymentMethodLabels[p.method]}</td>
                            <td className="px-5 py-3 text-zinc-500">{p.note ?? ""}</td>
                          </tr>
                        ))}
                      </Table>
                    )}
                  </Panel>
                </div>

                <div className="space-y-4">
                  <Panel title="Account">
                    <div className="space-y-2">
                      <button type="button" onClick={() => setEditing(true)} className={buttonClasses("outline", "md", "w-full")}>
                        <Pencil size={16} aria-hidden /> Edit details
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={async () => {
                          if (!confirm(`Reset ${name}'s password to the default?`)) return;
                          try {
                            const res = await api<{ initialPassword: string }>(`/users/${id}/reset-password`, { method: "POST" });
                            setTempPassword(res.initialPassword);
                          } catch (err) {
                            toast(errorMessage(err), "error");
                          }
                        }}
                        className={buttonClasses("outline", "md", "w-full")}
                      >
                        <KeyRound size={16} aria-hidden /> Reset password
                      </button>
                      {me.role === "ADMIN" && user.id !== me.id && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => {
                            const disabling = user.status === "ACTIVE";
                            if (disabling && !confirm(`Disable ${name}? They won't be able to log in.`)) return;
                            run(
                              () => api(`/users/${id}`, { method: "PATCH", body: { status: disabling ? "DISABLED" : "ACTIVE" } }),
                              disabling ? "Account disabled." : "Account re-enabled.",
                            );
                          }}
                          className={buttonClasses("outline", "md", "w-full")}
                        >
                          {user.status === "ACTIVE" ? <ShieldOff size={16} aria-hidden /> : <ShieldCheck size={16} aria-hidden />}
                          {user.status === "ACTIVE" ? "Disable account" : "Enable account"}
                        </button>
                      )}
                    </div>
                    {tempPassword && (
                      <div className="mt-4">
                        <TempPassword password={tempPassword} who={name} />
                      </div>
                    )}
                  </Panel>

                  <Panel title="Recent check-ins" padded={false}>
                    {checkIns.length === 0 ? (
                      <EmptyState title="No visits yet" />
                    ) : (
                      <ul className="max-h-80 divide-y divide-white/[0.05] overflow-y-auto">
                        {checkIns.map((c) => (
                          <li key={c.id} className="px-5 py-2.5 text-sm text-zinc-300">
                            {formatDateTime(c.checkedInAt)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Panel>
                </div>
              </div>

              {plans.data && (
                <AssignMembershipModal
                  open={assigning}
                  onClose={() => {
                    setAssigning(false);
                    if (params.get("assign")) router.replace(`/dashboard/clients/${id}`);
                  }}
                  onDone={() => {
                    setAssigning(false);
                    toast("Membership assigned.");
                    detail.reload();
                    router.refresh();
                  }}
                  userId={id}
                  name={name}
                  plans={plans.data}
                />
              )}

              <CancelMembershipModal
                key={cancelling?.id ?? "none"}
                membership={cancelling}
                paidCents={payments
                  .filter((p) => cancelling && p.membershipId === cancelling.id)
                  .reduce((sum, p) => sum + p.amountCents, 0)}
                onClose={() => setCancelling(null)}
                onDone={() => {
                  setCancelling(null);
                  toast("Membership cancelled.");
                  detail.reload();
                  router.refresh();
                }}
              />

              <EditClientModal
                open={editing}
                onClose={() => setEditing(false)}
                user={user}
                onSaved={() => {
                  setEditing(false);
                  toast("Details saved.");
                  detail.reload();
                }}
              />
            </>
          );
        }}
      </Async>
    </>
  );
}

function EditClientModal({
  open,
  onClose,
  onSaved,
  user,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  user: Detail["user"];
}) {
  const [form, setForm] = useState({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone ?? "" });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await api(`/users/${user.id}`, { method: "PATCH", body: form });
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit details">
      <form onSubmit={submit} className="space-y-5">
        <FormError message={error} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="First name" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          <TextField label="Last name" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        </div>
        <TextField label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <TextField label="Mobile number" type="tel" optional value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <SubmitButton pending={pending}>Save</SubmitButton>
      </form>
    </Modal>
  );
}
