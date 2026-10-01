"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { KeyRound } from "lucide-react";
import { api, errorMessage } from "@/lib/api/client";
import { FormError, PasswordField } from "./fields";
import { SubmitButton } from "./forms";
import { useSession } from "./session";

/** Shown instead of the dashboard until someone given the default password picks their own. */
export function ChooseNewPassword() {
  const { user } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (form.newPassword !== form.confirm) {
      setError("The new passwords don't match.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      await api("/auth/change-password", {
        method: "POST",
        body: { currentPassword: form.currentPassword, newPassword: form.newPassword },
      });
      router.refresh();
    } catch (err) {
      setError(errorMessage(err));
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-md py-6">
      <span className="flex size-12 items-center justify-center bg-brand/15 text-brand">
        <KeyRound size={22} aria-hidden />
      </span>
      <h1 className="mt-6 font-display text-3xl font-black uppercase tracking-[-0.02em] text-white">
        Choose your password
      </h1>
      <p className="mt-3 text-zinc-400">
        Welcome, {user.firstName}! Your account was set up by the ActiveZone front desk with a default password.
        Please choose your own to continue.
      </p>
      <form onSubmit={submit} className="mt-8 space-y-5">
        <FormError message={error} />
        <PasswordField
          label="Default password"
          autoComplete="current-password"
          required
          value={form.currentPassword}
          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          hint="The password you just logged in with."
        />
        <PasswordField
          label="New password"
          autoComplete="new-password"
          required
          minLength={8}
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          hint="At least 8 characters."
        />
        <PasswordField
          label="Confirm new password"
          autoComplete="new-password"
          required
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        />
        <SubmitButton pending={pending}>Save and continue</SubmitButton>
      </form>
    </div>
  );
}
