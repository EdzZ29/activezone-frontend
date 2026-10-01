"use client";

import { useState, type FormEvent } from "react";
import { Check, Copy, LoaderCircle } from "lucide-react";
import { buttonClasses } from "@/app/components/ui/Button";
import { api, errorMessage } from "@/lib/api/client";
import type { MembershipRecord, PaymentMethod, Plan, Role, User } from "@/lib/api/types";
import { formatDate, manilaDateKey, paymentMethodLabels, peso } from "@/lib/format";
import { FormError, SelectField, TextAreaField, TextField } from "./fields";
import { Modal } from "./ui";

export function SubmitButton({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={pending} className={buttonClasses("primary", "md", "disabled:opacity-60")}>
      {pending && <LoaderCircle size={16} className="animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

/** Shown after an account is created or a password is reset by staff. */
export function TempPassword({ password, who }: { password: string; who: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="border border-brand/30 bg-brand/[0.06] p-4">
      <p className="text-sm text-zinc-300">
        <span className="font-semibold text-white">{who}</span> can log in with the default password below.
        They&apos;ll be asked to choose their own password the first time they log in.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <code className="flex-1 bg-ink-950 px-3 py-2.5 font-mono text-lg tracking-wider text-white">{password}</code>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard?.writeText(password).catch(() => {});
            setCopied(true);
          }}
          className={buttonClasses("outline", "md")}
          aria-label="Copy password"
        >
          {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

type Created = { user: User; initialPassword: string };

/**
 * Creates an account with the default password. For clients, staff can also start a
 * membership plan straight away ("member" account); pass `plans` to offer that.
 */
export function NewUserModal({
  open,
  onClose,
  onCreated,
  roles,
  title,
  plans,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (user: User) => void;
  /** Roles this person may create. The first is the default. */
  roles: Role[];
  title: string;
  /** Membership plans to offer when creating a client. */
  plans?: Plan[];
}) {
  const membershipPlans = (plans ?? []).filter((p) => p.kind === "MEMBERSHIP" && p.isActive);
  const firstPlan = membershipPlans[0];
  const empty = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: roles[0],
    accountType: (membershipPlans.length ? "member" : "customer") as "member" | "customer",
    planId: firstPlan?.id ?? "",
    startsAt: manilaDateKey(),
    amount: firstPlan?.priceCents != null ? String(firstPlan.priceCents / 100) : "",
    method: "CASH" as PaymentMethod,
  };
  const [form, setForm] = useState(empty);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState<Created | null>(null);
  const asMember = membershipPlans.length > 0 && form.accountType === "member";

  const close = () => {
    setForm(empty);
    setError(null);
    setCreated(null);
    onClose();
  };

  function choosePlan(id: string) {
    const p = membershipPlans.find((x) => x.id === id);
    setForm((f) => ({ ...f, planId: id, amount: p?.priceCents != null ? String(p.priceCents / 100) : "" }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const account = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone || undefined,
    };
    try {
      const res = asMember
        ? await api<Created>("/memberships/new-member", {
            method: "POST",
            body: {
              ...account,
              planId: form.planId,
              startsAt: `${form.startsAt}T00:00:00+08:00`,
              amountCents: form.amount ? Math.round(Number(form.amount) * 100) : undefined,
              method: form.method,
            },
          })
        : await api<Created>("/users", { method: "POST", body: { ...account, role: form.role } });
      setCreated(res);
      onCreated(res.user);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  const choice = (value: "member" | "customer", label: string, hint: string) => (
    <label
      className={`flex cursor-pointer gap-3 border p-4 transition-colors ${
        form.accountType === value ? "border-brand/60 bg-brand/[0.05]" : "border-white/10 hover:border-white/25"
      }`}
    >
      <input
        type="radio"
        name="accountType"
        value={value}
        checked={form.accountType === value}
        onChange={() => setForm({ ...form, accountType: value })}
        className="mt-1 size-4 accent-[#89f53d]"
      />
      <span>
        <span className="block font-semibold text-white">{label}</span>
        <span className="text-xs text-zinc-500">{hint}</span>
      </span>
    </label>
  );

  return (
    <Modal open={open} onClose={close} title={created ? "Account created" : title} wide={membershipPlans.length > 0}>
      {created ? (
        <div className="space-y-5">
          <TempPassword password={created.initialPassword} who={`${created.user.firstName} ${created.user.lastName}`} />
          <p className="text-sm text-zinc-400">
            Login email: <span className="text-white">{created.user.email}</span>
            {created.user.role === "MEMBER" && " · Membership started"}
          </p>
          <button type="button" onClick={close} className={buttonClasses("primary", "md")}>
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          <FormError message={error} />
          {membershipPlans.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {choice("member", "Member", "Start a membership plan now")}
              {choice("customer", "Customer", "Account only, add a plan later")}
            </div>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="First name" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <TextField label="Last name" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} hint="Used to log in." />
            <TextField label="Mobile number" type="tel" optional value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>

          {asMember && (
            <div className="space-y-5 border border-white/[0.07] bg-ink-950 p-4">
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField label="Membership plan" value={form.planId} onChange={(e) => choosePlan(e.target.value)}>
                  {membershipPlans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} · {p.durationDays} days · {peso(p.priceCents)}
                    </option>
                  ))}
                </SelectField>
                <TextField label="Start date" type="date" required value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  label="Amount paid (₱)"
                  type="number"
                  min={0}
                  step="0.01"
                  inputMode="decimal"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  hint="Leave empty if not paid yet."
                />
                <MethodSelect label="Payment method" value={form.method} onChange={(method) => setForm({ ...form, method })} />
              </div>
            </div>
          )}

          {roles.length > 1 && (
            <SelectField label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r === "ADMIN" ? "Admin (full access)" : r === "STAFF" ? "Staff (front desk)" : "Customer"}
                </option>
              ))}
            </SelectField>
          )}
          <p className="text-xs text-zinc-500">
            The account gets the default password. They&apos;ll choose their own the first time they log in.
          </p>
          <SubmitButton pending={pending}>{asMember ? "Create member" : "Create account"}</SubmitButton>
        </form>
      )}
    </Modal>
  );
}

/* ------------------------------------------------------------------ */

export function AssignMembershipModal({
  open,
  onClose,
  onDone,
  userId,
  name,
  plans,
}: {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
  userId: string;
  name: string;
  plans: Plan[];
}) {
  const active = plans.filter((p) => p.isActive);
  const [planId, setPlanId] = useState(active.find((p) => p.kind === "MEMBERSHIP")?.id ?? active[0]?.id ?? "");
  const plan = active.find((p) => p.id === planId);
  const [startsAt, setStartsAt] = useState(manilaDateKey());
  const [amount, setAmount] = useState(plan?.priceCents != null ? String(plan.priceCents / 100) : "");
  const [method, setMethod] = useState<PaymentMethod>("CASH");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function choosePlan(id: string) {
    setPlanId(id);
    const p = active.find((x) => x.id === id);
    setAmount(p?.priceCents != null ? String(p.priceCents / 100) : "");
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await api("/memberships", {
        method: "POST",
        body: {
          userId,
          planId,
          startsAt: `${startsAt}T00:00:00+08:00`,
          amountCents: amount ? Math.round(Number(amount) * 100) : undefined,
          method,
          note: note || undefined,
        },
      });
      onDone();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Assign membership" description={`For ${name}. Records the payment at the same time.`}>
      <form onSubmit={submit} className="space-y-5">
        <FormError message={error} />
        <SelectField label="Plan" value={planId} onChange={(e) => choosePlan(e.target.value)}>
          {active.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} · {p.durationDays} day{p.durationDays === 1 ? "" : "s"} · {peso(p.priceCents)}
            </option>
          ))}
        </SelectField>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Start date" type="date" required value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
          <TextField
            label="Amount paid (₱)"
            type="number"
            min={0}
            step="0.01"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            hint="Leave empty if not paid yet."
          />
        </div>
        <SelectField label="Payment method" value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
          {Object.entries(paymentMethodLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </SelectField>
        <TextAreaField label="Note" optional rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. GCash ref no." />
        <SubmitButton pending={pending}>Assign {plan?.name ?? "plan"}</SubmitButton>
      </form>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */

function MethodSelect({ label, value, onChange }: { label: string; value: PaymentMethod; onChange: (m: PaymentMethod) => void }) {
  return (
    <SelectField label={label} value={value} onChange={(e) => onChange(e.target.value as PaymentMethod)}>
      {Object.entries(paymentMethodLabels).map(([v, l]) => (
        <option key={v} value={v}>
          {l}
        </option>
      ))}
    </SelectField>
  );
}

/** Guest who pays at the desk without creating an account. Records payment + check-in. */
export function WalkInModal({
  open,
  onClose,
  onDone,
  passPlans,
}: {
  open: boolean;
  onClose: () => void;
  onDone: (name: string) => void;
  passPlans: Plan[];
}) {
  const first = passPlans[0];
  const empty = {
    name: "",
    phone: "",
    planId: first?.id ?? "",
    amount: first?.priceCents != null ? String(first.priceCents / 100) : "",
    method: "CASH" as PaymentMethod,
    note: "",
  };
  const [form, setForm] = useState(empty);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const close = () => {
    setForm(empty);
    setError(null);
    onClose();
  };

  function choosePlan(id: string) {
    const p = passPlans.find((x) => x.id === id);
    setForm((f) => ({ ...f, planId: id, amount: p?.priceCents != null ? String(p.priceCents / 100) : f.amount }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await api("/walk-ins", {
        method: "POST",
        body: {
          name: form.name,
          phone: form.phone || undefined,
          planId: form.planId,
          amountCents: Math.round(Number(form.amount || 0) * 100),
          method: form.method,
          note: form.note || undefined,
        },
      });
      const name = form.name.trim();
      setForm(empty);
      onDone(name);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Walk-in guest"
      description="For guests paying for a single visit without an account. Records the payment and checks them in."
    >
      {passPlans.length === 0 ? (
        <p className="text-sm text-zinc-400">No day pass is set up yet. An admin can add one under Plans &amp; Prices.</p>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          <FormError message={error} />
          <TextField label="Guest name" required autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField
            label="Mobile number"
            type="tel"
            optional
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            hint="Handy for following up if they'd like a membership."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField label="Pass" value={form.planId} onChange={(e) => choosePlan(e.target.value)}>
              {passPlans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({peso(p.priceCents)})
                </option>
              ))}
            </SelectField>
            <TextField
              label="Amount paid (₱)"
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <MethodSelect label="Paid by" value={form.method} onChange={(method) => setForm({ ...form, method })} />
          <TextField
            label="Note"
            optional
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="e.g. Tourist, friend of a member"
          />
          <SubmitButton pending={pending}>Record walk-in &amp; check in</SubmitButton>
        </form>
      )}
    </Modal>
  );
}

/* ------------------------------------------------------------------ */

export const CANCELLATION_REASONS = [
  "Member's request",
  "Moving away",
  "Health or medical reasons",
  "Schedule no longer fits",
  "Switching to another plan",
  "Entered by mistake",
  "Other",
];

/** Ends a membership/pass immediately, with a reason and an optional refund. */
export function CancelMembershipModal({
  membership,
  paidCents,
  onClose,
  onDone,
}: {
  membership: MembershipRecord | null;
  /** Net amount recorded for this membership, to cap the refund. */
  paidCents: number;
  onClose: () => void;
  onDone: () => void;
}) {
  const [reason, setReason] = useState(CANCELLATION_REASONS[0]);
  const [details, setDetails] = useState("");
  const [refund, setRefund] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("CASH");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!membership) return;
    const text = [reason === "Other" ? "" : reason, details.trim()].filter(Boolean).join(": ");
    if (text.length < 3) {
      setError("Please describe the reason for the cancellation.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const refundCents = refund ? Math.round(Number(refund) * 100) : 0;
      await api(`/memberships/${membership.id}/cancel`, {
        method: "POST",
        body: {
          reason: text,
          refundCents: refundCents || undefined,
          refundMethod: refundCents ? method : undefined,
        },
      });
      onDone();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal
      open={membership !== null}
      onClose={onClose}
      title="Cancel membership"
      description={
        membership
          ? `${membership.planName} · ${formatDate(membership.startsAt, { month: "short", day: "numeric" })} – ${formatDate(membership.endsAt)}. Access ends immediately.`
          : undefined
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <FormError message={error} />
        <SelectField label="Reason" value={reason} onChange={(e) => setReason(e.target.value)}>
          {CANCELLATION_REASONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </SelectField>
        <TextAreaField
          label="Details"
          optional={reason !== "Other"}
          required={reason === "Other"}
          rows={2}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Anything the team should know"
        />
        <div className="border border-white/[0.07] bg-ink-950 p-4">
          <p className="text-sm text-zinc-300">
            Paid for this plan: <span className="font-semibold text-white">{peso(paidCents)}</span>
          </p>
          {paidCents > 0 ? (
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <TextField
                label="Refund (₱)"
                type="number"
                min={0}
                max={paidCents / 100}
                step="0.01"
                inputMode="decimal"
                optional
                value={refund}
                onChange={(e) => setRefund(e.target.value)}
                hint="Leave empty for no refund."
              />
              {refund && <MethodSelect label="Refunded by" value={method} onChange={setMethod} />}
            </div>
          ) : (
            <p className="mt-1 text-xs text-zinc-500">No payment recorded, so there&apos;s nothing to refund.</p>
          )}
        </div>
        <button
          type="submit"
          disabled={pending}
          className={buttonClasses("danger", "md", "disabled:opacity-60")}
        >
          {pending && <LoaderCircle size={16} className="animate-spin" aria-hidden />}
          Cancel membership
        </button>
      </form>
    </Modal>
  );
}
