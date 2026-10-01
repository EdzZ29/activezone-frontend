"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Check, LoaderCircle, Send } from "lucide-react";
import { MembershipCard } from "@/app/components/dashboard/MembershipCard";
import { useSession } from "@/app/components/dashboard/session";
import { useToast } from "@/app/components/dashboard/toast";
import { FormError, SelectField, TextAreaField } from "@/app/components/dashboard/fields";
import { CANCELLATION_REASONS } from "@/app/components/dashboard/forms";
import { Async, Badge, EmptyState, Modal, PageHeader, Panel, Table } from "@/app/components/dashboard/ui";
import { buttonClasses } from "@/app/components/ui/Button";
import { site } from "@/lib/site";
import { api, errorMessage } from "@/lib/api/client";
import type { MembershipRecord, MyInquiry, Payment, Plan } from "@/lib/api/types";
import { useApi } from "@/lib/api/use-api";
import { formatDate, formatDateTime, paymentMethodLabels, peso } from "@/lib/format";

export function MyMembership() {
  const router = useRouter();
  const toast = useToast();
  const { user, access } = useSession();
  const plans = useApi<Plan[]>("/plans");
  const history = useApi<MembershipRecord[]>("/memberships/me");
  const payments = useApi<Payment[]>("/payments/me");
  const requests = useApi<MyInquiry[]>("/inquiries/me");
  const [sending, setSending] = useState<string | null>(null);

  const pendingRequest = requests.data?.find((r) => r.status === "NEW" && r.type === "membership");
  const pendingCancellation = requests.data?.find((r) => r.status !== "CLOSED" && r.type === "cancellation");
  const [requestingCancel, setRequestingCancel] = useState(false);

  async function request(plan: Plan) {
    const renewing = access.membership?.planId === plan.id;
    setSending(plan.id);
    try {
      await api("/inquiries/me", {
        method: "POST",
        body: {
          type: plan.kind === "PASS" ? "daily-pass" : "membership",
          message: `${renewing ? "I'd like to renew my" : "I'd like to get the"} ${plan.name} ${plan.kind === "PASS" ? "pass" : "plan"}.`,
        },
      });
      toast("Request sent. The front desk will contact you. Payment is made at the gym.");
      requests.reload();
      router.refresh();
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setSending(null);
    }
  }

  return (
    <>
      <PageHeader
        title={user.role === "MEMBER" ? "My membership" : "Memberships"}
        description="Send a request for any plan and the front desk will get in touch to confirm. Payment is made at the gym."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <MembershipCard membership={access.membership} pass={access.pass} />
          {access.membership && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
              <span className="text-zinc-500">
                {pendingCancellation
                  ? "Your cancellation request is with the front desk."
                  : "Need to stop your membership?"}
              </span>
              {!pendingCancellation && (
                <button
                  type="button"
                  onClick={() => setRequestingCancel(true)}
                  className="font-semibold text-zinc-300 underline-offset-4 hover:text-red-300 hover:underline"
                >
                  Request cancellation
                </button>
              )}
            </div>
          )}
        </div>
        <Panel title="Your requests" padded={false}>
          <Async state={requests}>
            {(rows) =>
              rows.length === 0 ? (
                <EmptyState title="No requests yet" />
              ) : (
                <ul className="max-h-64 divide-y divide-white/[0.05] overflow-y-auto">
                  {rows.map((r) => (
                    <li key={r.id} className="flex items-start justify-between gap-3 px-5 py-3 text-sm">
                      <span>
                        <span className="block text-zinc-200">{r.message}</span>
                        <span className="text-xs text-zinc-500">{formatDate(r.createdAt)}</span>
                      </span>
                      <Badge tone={r.status === "NEW" ? "amber" : r.status === "CONTACTED" ? "blue" : "gray"}>
                        {r.status === "NEW" ? "Sent" : r.status === "CONTACTED" ? "Contacted" : "Closed"}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )
            }
          </Async>
        </Panel>
      </div>

      <h2 className="mb-4 mt-10 font-display text-sm font-extrabold uppercase tracking-[0.14em] text-white">Plans</h2>
      <Async state={plans}>
        {(rows) => (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {rows.map((p) => {
              const current = access.membership?.planId === p.id || access.pass?.planId === p.id;
              return (
                <article key={p.id} className={`flex flex-col border bg-ink-900 p-6 ${current ? "border-brand/50" : "border-white/[0.07]"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-extrabold uppercase tracking-tight text-white">{p.name}</h3>
                    {current && <Badge tone="green">Current</Badge>}
                  </div>
                  <p className="mt-3 flex items-baseline gap-2">
                    <span className="font-display text-3xl font-black text-white">{peso(p.priceCents, "Ask us")}</span>
                    <span className="text-sm text-zinc-500">/ {p.kind === "PASS" ? "visit" : `${p.durationDays} days`}</span>
                  </p>
                  {p.description && <p className="mt-2 text-sm text-zinc-400">{p.description}</p>}
                  <ul className="mt-4 flex-1 space-y-1.5 text-sm text-zinc-300">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden /> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    disabled={sending !== null}
                    onClick={() => request(p)}
                    className={buttonClasses(current ? "outline" : "primary", "md", "mt-6 w-full disabled:opacity-60")}
                  >
                    {sending === p.id ? <LoaderCircle size={16} className="animate-spin" aria-hidden /> : <Send size={15} aria-hidden />}
                    {access.membership?.planId === p.id ? "Request renewal" : "Request this plan"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </Async>
      {pendingRequest && (
        <p className="mt-3 text-sm text-zinc-500">
          You have a request waiting for the front desk. Questions? Call{" "}
          <a href={site.phone.href} className="text-zinc-300 hover:text-white">
            {site.phone.display}
          </a>
          .
        </p>
      )}

      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="History" padded={false}>
          <Async state={history}>
            {(rows) =>
              rows.length === 0 ? (
                <EmptyState title="No memberships yet" />
              ) : (
                <Table head={["Plan", "From", "Until", ""]}>
                  {rows.map((m) => (
                    <tr key={m.id}>
                      <td className="px-5 py-3 font-medium text-white">{m.planName}</td>
                      <td className="px-5 py-3 text-zinc-400">{formatDate(m.startsAt)}</td>
                      <td className="px-5 py-3 text-zinc-400">{formatDate(m.endsAt)}</td>
                      <td className="px-5 py-3">
                        {m.status === "CANCELLED" && (
                          <span className="block">
                            <Badge tone="red">Cancelled</Badge>
                            {m.cancellationReason && <span className="mt-1 block text-xs text-zinc-500">{m.cancellationReason}</span>}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </Table>
              )
            }
          </Async>
        </Panel>
        <Panel title="Payments" padded={false}>
          <Async state={payments}>
            {(rows) =>
              rows.length === 0 ? (
                <EmptyState title="No payments yet" />
              ) : (
                <Table head={["Date", "Amount", "Method", "For"]}>
                  {rows.map((p) => (
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
              )
            }
          </Async>
        </Panel>
      </div>

      {access.membership && (
        <RequestCancellationModal
          open={requestingCancel}
          planName={access.membership.planName}
          onClose={() => setRequestingCancel(false)}
          onSent={() => {
            setRequestingCancel(false);
            toast("Cancellation request sent. The front desk will contact you to confirm.");
            requests.reload();
          }}
        />
      )}
    </>
  );
}

/** Members ask; staff confirm and handle any refund in person. */
function RequestCancellationModal({
  open,
  planName,
  onClose,
  onSent,
}: {
  open: boolean;
  planName: string;
  onClose: () => void;
  onSent: () => void;
}) {
  const [reason, setReason] = useState(CANCELLATION_REASONS[1]);
  const [details, setDetails] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await api("/inquiries/me", {
        method: "POST",
        body: {
          type: "cancellation",
          message: `Please cancel my ${planName} membership. Reason: ${reason}${details.trim() ? `. ${details.trim()}` : ""}`,
        },
      });
      setDetails("");
      onSent();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Request cancellation"
      description="The front desk will contact you to confirm. Your membership stays active until they process it, and any refund is handled in person."
    >
      <form onSubmit={submit} className="space-y-5">
        <FormError message={error} />
        <SelectField label="Reason" value={reason} onChange={(e) => setReason(e.target.value)}>
          {CANCELLATION_REASONS.filter((r) => r !== "Entered by mistake").map((r) => (
            <option key={r} value={r === "Member's request" ? "Personal reasons" : r}>
              {r === "Member's request" ? "Personal reasons" : r}
            </option>
          ))}
        </SelectField>
        <TextAreaField
          label="Anything else?"
          optional
          rows={3}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="e.g. Last day I can come in, or if you'd like to pause instead"
        />
        <button type="submit" disabled={pending} className={buttonClasses("danger", "md", "disabled:opacity-60")}>
          {pending && <LoaderCircle size={16} className="animate-spin" aria-hidden />}
          Send request
        </button>
      </form>
    </Modal>
  );
}
