"use client";

import { useState, type FormEvent } from "react";
import { Check, Pencil, Plus } from "lucide-react";
import { FormError, SelectField, TextAreaField, TextField } from "@/app/components/dashboard/fields";
import { SubmitButton } from "@/app/components/dashboard/forms";
import { useToast } from "@/app/components/dashboard/toast";
import { Async, Badge, Modal, PageHeader } from "@/app/components/dashboard/ui";
import { buttonClasses } from "@/app/components/ui/Button";
import { api, errorMessage } from "@/lib/api/client";
import type { Plan } from "@/lib/api/types";
import { useApi } from "@/lib/api/use-api";
import { peso } from "@/lib/format";

export function PlansManager() {
  const plans = useApi<Plan[]>("/plans/all");
  const [editing, setEditing] = useState<Plan | "new" | null>(null);

  return (
    <>
      <PageHeader
        title="Plans & prices"
        description="Prices set here are used at the front desk and shown on the website's membership section (updates within a few minutes). Leave a price empty to show “Contact us for rates”."
        actions={
          <button type="button" onClick={() => setEditing("new")} className={buttonClasses("primary", "md")}>
            <Plus size={16} aria-hidden /> New plan
          </button>
        }
      />

      <Async state={plans}>
        {(rows) => (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {rows.map((p) => (
              <article key={p.id} className={`flex flex-col border bg-ink-900 p-6 ${p.isActive ? "border-white/[0.07]" : "border-dashed border-white/10 opacity-60"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge tone={p.kind === "PASS" ? "blue" : "green"}>{p.kind === "PASS" ? "Day pass" : "Membership"}</Badge>
                      {p.includesClasses && <Badge tone="gray">Classes</Badge>}
                      {!p.isActive && <Badge tone="red">Hidden</Badge>}
                    </div>
                    <h2 className="mt-3 font-display text-xl font-extrabold uppercase tracking-tight text-white">{p.name}</h2>
                  </div>
                  <button type="button" onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`} className="flex size-9 items-center justify-center border border-white/10 text-zinc-400 hover:border-brand hover:text-brand">
                    <Pencil size={15} />
                  </button>
                </div>
                <p className="mt-4 flex items-baseline gap-2">
                  <span className={`font-display text-3xl font-black ${p.priceCents === null ? "text-amber-200" : "text-white"}`}>
                    {peso(p.priceCents, "Not set")}
                  </span>
                  <span className="text-sm text-zinc-500">
                    / {p.durationDays} day{p.durationDays === 1 ? "" : "s"}
                  </span>
                </p>
                {p.description && <p className="mt-2 text-sm text-zinc-400">{p.description}</p>}
                <ul className="mt-4 space-y-1.5 text-sm text-zinc-300">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden /> {f}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </Async>

      {editing && (
        <PlanForm
          plan={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            plans.reload();
          }}
        />
      )}
    </>
  );
}

function PlanForm({ plan, onClose, onSaved }: { plan: Plan | null; onClose: () => void; onSaved: () => void }) {
  const toast = useToast();
  const [form, setForm] = useState({
    name: plan?.name ?? "",
    kind: plan?.kind ?? "MEMBERSHIP",
    price: plan?.priceCents != null ? String(plan.priceCents / 100) : "",
    durationDays: String(plan?.durationDays ?? 30),
    description: plan?.description ?? "",
    features: plan?.features.join("\n") ?? "",
    includesClasses: plan?.includesClasses ?? false,
    isActive: plan?.isActive ?? true,
    sortOrder: String(plan?.sortOrder ?? 0),
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const body = {
      name: form.name,
      kind: form.kind,
      priceCents: form.price === "" ? null : Math.round(Number(form.price) * 100),
      durationDays: Number(form.durationDays),
      description: form.description,
      features: form.features.split("\n").map((f) => f.trim()).filter(Boolean),
      includesClasses: form.includesClasses,
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder) || 0,
    };
    try {
      await api(plan ? `/plans/${plan.id}` : "/plans", { method: plan ? "PATCH" : "POST", body });
      toast(plan ? "Plan saved." : "Plan created.");
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  const check = "size-4 accent-[#89f53d]";

  return (
    <Modal open onClose={onClose} title={plan ? `Edit ${plan.name}` : "New plan"} wide>
      <form onSubmit={submit} className="space-y-5">
        <FormError message={error} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <SelectField label="Type" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as Plan["kind"] })}>
            <option value="MEMBERSHIP">Membership (makes the person a member)</option>
            <option value="PASS">Day pass (gym access only)</option>
          </SelectField>
          <TextField
            label="Price (₱)"
            type="number"
            min={0}
            step="0.01"
            inputMode="decimal"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            hint="Leave empty until the rate is confirmed."
          />
          <TextField label="Length (days)" type="number" min={1} required value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: e.target.value })} />
        </div>
        <TextField label="Short description" optional value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <TextAreaField label="Inclusions" hint="One per line." rows={4} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-zinc-300">
          <label className="flex items-center gap-2.5">
            <input type="checkbox" className={check} checked={form.includesClasses} onChange={(e) => setForm({ ...form, includesClasses: e.target.checked })} />
            Members can book group classes
          </label>
          <label className="flex items-center gap-2.5">
            <input type="checkbox" className={check} checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Offered (shown on website &amp; at the desk)
          </label>
        </div>
        <TextField label="Display order" type="number" className="sm:w-40" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
        <SubmitButton pending={pending}>{plan ? "Save plan" : "Create plan"}</SubmitButton>
      </form>
    </Modal>
  );
}
