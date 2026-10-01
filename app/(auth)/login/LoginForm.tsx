"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { FormError, PasswordField, TextField } from "@/app/components/dashboard/fields";
import { buttonClasses } from "@/app/components/ui/Button";
import { api, errorMessage } from "@/lib/api/client";
import { site } from "@/lib/site";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await api("/auth/login", { method: "POST", body: { email, password } });
      router.replace(next);
      router.refresh();
    } catch (err) {
      setError(errorMessage(err));
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-5">
      <FormError message={error} />
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
      />
      <PasswordField
        label="Password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        hint={
          <>
            Forgot your password? Ask the front desk to reset it, or call{" "}
            <a href={site.phone.href} className="text-zinc-300 hover:text-white">
              {site.phone.display}
            </a>
            .
          </>
        }
      />
      <button type="submit" disabled={pending} className={buttonClasses("primary", "lg", "w-full disabled:opacity-70")}>
        {pending ? <LoaderCircle size={18} className="animate-spin" aria-hidden /> : null}
        {pending ? "Logging in…" : "Log in"}
        {!pending && <ArrowRight size={18} aria-hidden />}
      </button>
    </form>
  );
}
