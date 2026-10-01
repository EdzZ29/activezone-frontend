"use client";

import { useId, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { Eye, EyeOff, TriangleAlert } from "lucide-react";

const control =
  "mt-2 block w-full border border-white/10 bg-ink-950 px-4 py-3 text-[0.95rem] text-white placeholder:text-zinc-600 transition-colors focus:border-brand focus:outline-none disabled:opacity-60";

type FieldShell = { label: string; hint?: ReactNode; error?: string; optional?: boolean; className?: string };

function Shell({ id, label, hint, error, optional, className = "", children }: FieldShell & { id: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-zinc-400">
        {label}
        {optional && <span className="ml-2 normal-case tracking-normal text-zinc-600">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-sm text-red-300">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-zinc-500">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextField({
  label,
  hint,
  error,
  optional,
  className,
  ...input
}: FieldShell & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <input id={id} aria-invalid={!!error} className={`${control} ${error ? "border-red-400/60" : ""}`} {...input} />
    </Shell>
  );
}

export function PasswordField({
  label,
  hint,
  error,
  className,
  ...input
}: FieldShell & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <Shell id={id} label={label} hint={hint} error={error} className={className}>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={!!error}
          className={`${control} pr-12 ${error ? "border-red-400/60" : ""}`}
          {...input}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-1 top-1/2 mt-1 flex size-10 -translate-y-1/2 items-center justify-center text-zinc-500 hover:text-white"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </Shell>
  );
}

export function SelectField({
  label,
  hint,
  error,
  optional,
  className,
  children,
  ...select
}: FieldShell & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <div className="relative">
        <select id={id} className={`${control} appearance-none pr-10`} {...select}>
          {children}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 mt-0.5 size-2 -translate-y-1/2 rotate-45 border-b-2 border-r-2 border-zinc-400"
        />
      </div>
    </Shell>
  );
}

export function TextAreaField({
  label,
  hint,
  error,
  optional,
  className,
  ...textarea
}: FieldShell & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <textarea id={id} rows={4} className={`${control} resize-y`} {...textarea} />
    </Shell>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="flex items-start gap-2.5 border border-red-400/30 bg-red-400/[0.07] px-4 py-3 text-sm text-red-200">
      <TriangleAlert size={17} className="mt-0.5 shrink-0" aria-hidden />
      {message}
    </p>
  );
}
