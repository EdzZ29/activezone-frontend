"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { FormError, PasswordField, TextField } from "@/app/components/dashboard/fields";
import { buttonClasses } from "@/app/components/ui/Button";
import { api, errorMessage } from "@/lib/api/client";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const { confirm, ...body } = form;
      void confirm;
      await api("/auth/register", { method: "POST", body: { ...body, phone: body.phone || undefined } });
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(errorMessage(err));
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-5">
      <FormError message={error} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="First name" autoComplete="given-name" required value={form.firstName} onChange={set("firstName")} />
        <TextField label="Last name" autoComplete="family-name" required value={form.lastName} onChange={set("lastName")} />
      </div>
      <TextField label="Email" type="email" inputMode="email" autoComplete="email" required value={form.email} onChange={set("email")} />
      <TextField
        label="Mobile number"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        optional
        value={form.phone}
        onChange={set("phone")}
        placeholder="09XX XXX XXXX"
      />
      <PasswordField
        label="Password"
        autoComplete="new-password"
        required
        minLength={8}
        value={form.password}
        onChange={set("password")}
        hint="At least 8 characters."
      />
      <PasswordField label="Confirm password" autoComplete="new-password" required value={form.confirm} onChange={set("confirm")} />
      <button type="submit" disabled={pending} className={buttonClasses("primary", "lg", "w-full disabled:opacity-70")}>
        {pending ? <LoaderCircle size={18} className="animate-spin" aria-hidden /> : null}
        {pending ? "Creating account…" : "Create account"}
        {!pending && <ArrowRight size={18} aria-hidden />}
      </button>
    </form>
  );
}
