"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Inbox, LoaderCircle, RotateCw, X } from "lucide-react";
import { buttonClasses } from "@/app/components/ui/Button";

/* ------------------------------------------------------------------ */
/* Layout                                                             */
/* ------------------------------------------------------------------ */

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-display text-3xl font-black uppercase tracking-[-0.02em] text-white md:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-zinc-400">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className = "",
  padded = true,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section className={`min-w-0 border border-white/[0.07] bg-ink-900 ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-5 py-4">
          <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.12em] text-white">{title}</h2>
          {action}
        </div>
      )}
      <div className={padded ? "p-5" : ""}>{children}</div>
    </section>
  );
}

export function StatTile({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  accent?: boolean;
}) {
  return (
    <div className={`border bg-ink-900 p-5 ${accent ? "border-brand/40" : "border-white/[0.07]"}`}>
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className="mt-3 font-display text-3xl font-black tracking-[-0.02em] text-white tabular-nums">{value}</p>
      {hint && <p className="mt-1.5 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Status                                                             */
/* ------------------------------------------------------------------ */

const badgeTones = {
  green: "border-brand/30 bg-brand/10 text-brand",
  amber: "border-amber-300/30 bg-amber-300/10 text-amber-200",
  red: "border-red-400/30 bg-red-400/10 text-red-200",
  blue: "border-sky-300/30 bg-sky-300/10 text-sky-200",
  gray: "border-white/10 bg-white/[0.04] text-zinc-400",
} as const;

export type BadgeTone = keyof typeof badgeTones;

export function Badge({ tone = "gray", children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap border px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] ${badgeTones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-sm text-zinc-500">
      <LoaderCircle size={18} className="animate-spin" aria-hidden /> {label}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <p className="text-sm text-red-200">{error.message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className={buttonClasses("outline", "md")}>
          <RotateCw size={16} aria-hidden /> Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-4 py-12 text-center">
      <span className="flex size-12 items-center justify-center border border-white/10 text-zinc-500">
        <Inbox size={22} aria-hidden />
      </span>
      <p className="mt-4 font-semibold text-white">{title}</p>
      {children && <div className="mt-1.5 max-w-sm text-sm text-zinc-500">{children}</div>}
    </div>
  );
}

/** Renders loading / error / content for a useApi() result. */
export function Async<T>({
  state,
  children,
}: {
  state: { data: T | undefined; error: Error | null; loading: boolean; reload: () => void };
  children: (data: T) => ReactNode;
}) {
  if (state.loading) return <Loading />;
  if (state.error && state.data === undefined) return <ErrorState error={state.error} onRetry={state.reload} />;
  if (state.data === undefined) return null;
  return <>{children(state.data)}</>;
}

/* ------------------------------------------------------------------ */
/* Modal                                                              */
/* ------------------------------------------------------------------ */

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={`m-auto w-[calc(100%-2rem)] border border-white/10 bg-ink-900 p-0 text-zinc-100 shadow-2xl shadow-black/60 backdrop:bg-black/75 backdrop:backdrop-blur-sm ${
        wide ? "max-w-2xl" : "max-w-lg"
      }`}
    >
      {open && (
        <div className="max-h-[85svh] overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/[0.07] bg-ink-900 px-6 py-5">
            <div>
              <h2 className="font-display text-lg font-extrabold uppercase tracking-tight text-white">{title}</h2>
              {description && <p className="mt-1 text-sm text-zinc-400">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 -mt-1 flex size-10 shrink-0 items-center justify-center text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          <div className="px-6 py-6">{children}</div>
        </div>
      )}
    </dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Tables                                                             */
/* ------------------------------------------------------------------ */

export function Table({ head, children }: { head: ReactNode[]; children: ReactNode }) {
  return (
    <div className="-mx-px overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/[0.07] text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {head.map((h, i) => (
              <th key={i} scope="col" className="px-5 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.05]">{children}</tbody>
      </table>
    </div>
  );
}

export function Tabs<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; count?: number }[];
}) {
  return (
    <div role="tablist" className="no-scrollbar flex gap-1 overflow-x-auto border-b border-white/[0.07]">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`relative shrink-0 px-4 py-3 text-sm font-medium transition-colors ${
            value === o.value ? "text-white" : "text-zinc-500 hover:text-zinc-200"
          }`}
        >
          {o.label}
          {o.count !== undefined && <span className="ml-2 text-xs text-zinc-500">{o.count}</span>}
          {value === o.value && <span aria-hidden className="absolute inset-x-3 bottom-0 h-[2px] bg-brand" />}
        </button>
      ))}
    </div>
  );
}
