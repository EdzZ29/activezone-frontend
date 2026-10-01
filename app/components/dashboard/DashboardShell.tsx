"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ExternalLink, LogOut, Menu, X } from "lucide-react";
import { Logo } from "@/app/components/Logo";
import { api } from "@/lib/api/client";
import type { Session } from "@/lib/api/types";
import { fullName, initials, roleLabels } from "@/lib/format";
import { ChooseNewPassword } from "./ChooseNewPassword";
import { dashboardNav } from "./nav";
import { SessionContext } from "./session";
import { ToastProvider } from "./toast";

export function DashboardShell({ session, children }: { session: Session; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { user } = session;
  const nav = dashboardNav[user.role];

  const isActive = (href: string) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  async function logout() {
    setLoggingOut(true);
    await api("/auth/logout", { method: "POST" }).catch(() => {});
    router.replace("/login");
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center justify-between px-6">
        <Logo compact tight />
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="flex size-10 items-center justify-center text-zinc-400 hover:text-white lg:hidden"
        >
          <X size={22} />
        </button>
      </div>

      <p className="px-6 pb-3 pt-2 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-zinc-600">
        {roleLabels[user.role]} dashboard
      </p>
      <nav aria-label="Dashboard" className="flex-1 overflow-y-auto px-3">
        <ul className="space-y-0.5">
          {nav.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                    active ? "bg-white/[0.06] text-white" : "text-zinc-400 hover:bg-white/[0.03] hover:text-white"
                  }`}
                >
                  {active && <span aria-hidden className="absolute inset-y-1.5 left-0 w-[3px] bg-brand" />}
                  <Icon size={18} className={active ? "text-brand" : ""} aria-hidden />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/[0.06] p-4">
        <Link
          href="/"
          className="mb-3 flex items-center gap-2 px-2 text-xs font-medium text-zinc-500 transition-colors hover:text-white"
        >
          <ExternalLink size={14} aria-hidden /> View website
        </Link>
        <div className="flex items-center gap-3 px-2">
          <span className="flex size-9 shrink-0 items-center justify-center bg-brand font-display text-xs font-extrabold text-ink-950">
            {initials(user)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-white">{fullName(user)}</span>
            <span className="block truncate text-xs text-zinc-500">{user.email}</span>
          </span>
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            aria-label="Log out"
            title="Log out"
            className="flex size-9 items-center justify-center text-zinc-400 transition-colors hover:text-white disabled:opacity-50"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <SessionContext.Provider value={session}>
      <ToastProvider>
        <div className="min-h-svh bg-ink-950">
          {/* Desktop sidebar */}
          <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/[0.06] bg-ink-900 lg:block">
            {sidebar}
          </aside>

          {/* Mobile top bar + drawer */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-ink-950/90 px-4 backdrop-blur-xl lg:hidden">
            <Logo compact tight />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="flex size-11 items-center justify-center text-white"
            >
              <Menu size={24} />
            </button>
          </header>
          <div
            className={`fixed inset-0 z-40 bg-black/70 transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r border-white/[0.06] bg-ink-900 transition-transform duration-300 ease-out-expo lg:hidden ${
              open ? "translate-x-0" : "-translate-x-full"
            }`}
            inert={!open}
          >
            {sidebar}
          </aside>

          <main className="lg:pl-64">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 md:py-10 lg:px-10">
              {user.mustChangePassword ? <ChooseNewPassword /> : children}
            </div>
          </main>
        </div>
      </ToastProvider>
    </SessionContext.Provider>
  );
}
