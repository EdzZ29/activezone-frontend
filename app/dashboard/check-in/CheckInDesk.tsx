"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CircleCheck, Footprints, LoaderCircle, QrCode, Search, Ticket, UserPlus } from "lucide-react";
import { ClientStatus } from "@/app/components/dashboard/ClientStatus";
import { SelectField, TextField } from "@/app/components/dashboard/fields";
import { WalkInModal } from "@/app/components/dashboard/forms";
import { useToast } from "@/app/components/dashboard/toast";
import { Async, Badge, EmptyState, Modal, PageHeader, Panel } from "@/app/components/dashboard/ui";
import { buttonClasses } from "@/app/components/ui/Button";
import { api, ApiError, errorMessage } from "@/lib/api/client";
import type { CheckInResult, ClientRow, PaymentMethod, Plan, TodayCheckIn } from "@/lib/api/types";
import { useApi } from "@/lib/api/use-api";
import { formatTime, fullName, paymentMethodLabels, peso } from "@/lib/format";
import { QrScanner, type ScanFeedback } from "./QrScanner";

type Person = { id: string; firstName: string; lastName: string };

/** Text from a QR pass (typed by a USB scanner or read by the camera). */
const isPassCode = (value: string) => value.trim().startsWith("AZ1.");

export function CheckInDesk() {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [needsPass, setNeedsPass] = useState<Person | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanBusy, setScanBusy] = useState(false);
  const [feedback, setFeedback] = useState<ScanFeedback>(null);
  const [walkInOpen, setWalkInOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query]);

  const results = useApi<ClientRow[]>(debounced.length >= 2 && !isPassCode(debounced) ? `/users?q=${encodeURIComponent(debounced)}&limit=12` : null);
  const today = useApi<TodayCheckIn[]>("/check-ins");
  const plans = useApi<Plan[]>("/plans");
  const passPlans = plans.data?.filter((p) => p.kind === "PASS") ?? [];

  async function checkIn(client: Person, dayPass?: { planId: string; amountCents: number; method: PaymentMethod }) {
    setBusyId(client.id);
    try {
      const res = await api<CheckInResult>("/check-ins", { method: "POST", body: { userId: client.id, dayPass } });
      toast(
        res.alreadyCheckedIn
          ? `${fullName(client)} already timed in today at ${formatTime(res.checkIn.checkedInAt)}.`
          : `${fullName(client)} checked in${dayPass ? " with a day pass" : ""}.`,
      );
      setNeedsPass(null);
      setQuery("");
      today.reload();
      results.reload();
      inputRef.current?.focus();
    } catch (err) {
      if (err instanceof ApiError && err.code === "NO_ACTIVE_ACCESS") setNeedsPass(client);
      else toast(errorMessage(err), "error");
    } finally {
      setBusyId(null);
    }
  }

  /** A member's QR pass, from the camera or a USB scanner typing into the search box. */
  async function scanCode(code: string) {
    setScanBusy(true);
    try {
      const res = await api<CheckInResult>("/check-ins/scan", { method: "POST", body: { code } });
      const name = fullName(res.user);
      const plan = res.access?.planName;
      setFeedback(
        res.alreadyCheckedIn
          ? { tone: "info", title: `${name} already timed in today`, detail: `First scan at ${formatTime(res.checkIn.checkedInAt)}.` }
          : { tone: "success", title: `${name} timed in`, detail: `${formatTime(res.checkIn.checkedInAt)}${plan ? ` · ${plan}` : ""}` },
      );
      if (!scannerOpen) {
        toast(res.alreadyCheckedIn ? `${name} already timed in today.` : `${name} timed in.`);
      }
      today.reload();
    } catch (err) {
      if (err instanceof ApiError && err.code === "NO_ACTIVE_ACCESS" && err.data?.user) {
        // No plan: close the scanner and offer a day pass for this person.
        setScannerOpen(false);
        setFeedback(null);
        setNeedsPass(err.data.user as Person);
      } else {
        setFeedback({ tone: "error", title: errorMessage(err) });
        if (!scannerOpen) toast(errorMessage(err), "error");
      }
    } finally {
      setScanBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Front desk check-in"
        description="Scan a member's QR pass or search by name to record their time-in. Guests without an account can be checked in as walk-ins."
        actions={
          <>
            <button
              type="button"
              onClick={() => {
                setFeedback(null);
                setScannerOpen(true);
              }}
              className={buttonClasses("primary", "md")}
            >
              <QrCode size={16} aria-hidden /> Scan QR
            </button>
            <button type="button" onClick={() => setWalkInOpen(true)} className={buttonClasses("outline", "md")}>
              <Footprints size={16} aria-hidden /> Walk-in guest
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.25fr_1fr]">
        <div className="space-y-4">
          <Panel>
            <label htmlFor="checkin-search" className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Find a member or customer
            </label>
            <div className="relative mt-2">
              <Search size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden />
              <input
                ref={inputRef}
                id="checkin-search"
                autoFocus
                autoComplete="off"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setNeedsPass(null);
                }}
                onKeyDown={(e) => {
                  // USB / handheld QR scanners type the pass code and press Enter.
                  if (e.key === "Enter" && isPassCode(query)) {
                    e.preventDefault();
                    const code = query.trim();
                    setQuery("");
                    scanCode(code);
                  }
                }}
                placeholder="Name, phone or email"
                className="block w-full border border-white/10 bg-ink-950 py-4 pl-12 pr-4 text-lg text-white placeholder:text-zinc-600 focus:border-brand focus:outline-none"
              />
            </div>
  
            <div className="mt-4">
              {isPassCode(debounced) ? (
                <p className="py-6 text-center text-sm text-zinc-400">QR pass detected. Press Enter to time them in.</p>
              ) : debounced.length < 2 ? (
                <p className="py-6 text-center text-sm text-zinc-500">Type at least 2 letters to search, or scan a member&apos;s QR pass.</p>
              ) : (
                <Async state={results}>
                  {(rows) =>
                    rows.length === 0 ? (
                      <EmptyState title="No one found">
                        <span className="flex flex-wrap justify-center gap-x-5 gap-y-2">
                          <button type="button" onClick={() => setWalkInOpen(true)} className="inline-flex items-center gap-1.5 text-brand hover:underline">
                            <Footprints size={14} aria-hidden /> Record as walk-in
                          </button>
                          <Link href="/dashboard/clients?new=1" className="inline-flex items-center gap-1.5 text-brand hover:underline">
                            <UserPlus size={14} aria-hidden /> Register a new customer
                          </Link>
                        </span>
                      </EmptyState>
                    ) : (
                      <ul className="divide-y divide-white/[0.05] border border-white/[0.07]">
                        {rows.map((c) => (
                          <li key={c.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <Link href={`/dashboard/clients/${c.id}`} className="font-semibold text-white hover:text-brand">
                                {fullName(c)}
                              </Link>
                              <p className="truncate text-xs text-zinc-500">{[c.phone, c.email].filter(Boolean).join(" · ")}</p>
                              <div className="mt-2">
                                <ClientStatus client={c} />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => checkIn(c)}
                              disabled={busyId === c.id || c.status === "DISABLED"}
                              className={buttonClasses("primary", "md", "shrink-0 disabled:opacity-50")}
                            >
                              {busyId === c.id ? <LoaderCircle size={16} className="animate-spin" aria-hidden /> : <CircleCheck size={16} aria-hidden />}
                              Check in
                            </button>
                          </li>
                        ))}
                      </ul>
                    )
                  }
                </Async>
              )}
            </div>
          </Panel>
  
          {needsPass && (
            <DayPassPanel
              client={needsPass}
              passPlans={passPlans}
              busy={busyId === needsPass.id}
              onCancel={() => setNeedsPass(null)}
              onSell={(dayPass) => checkIn(needsPass, dayPass)}
            />
          )}
  
          <Modal
            open={scannerOpen}
            onClose={() => setScannerOpen(false)}
            title="Scan QR pass"
            description="Point the camera at the member's QR pass. Each scan records their time-in for today."
          >
            <QrScanner onCode={scanCode} busy={scanBusy} feedback={feedback} />
          </Modal>
  
          {plans.data && (
            <WalkInModal
              open={walkInOpen}
              passPlans={passPlans}
              onClose={() => setWalkInOpen(false)}
              onDone={(name) => {
                setWalkInOpen(false);
                toast(`${name} checked in as a walk-in.`);
                today.reload();
              }}
            />
          )}
        </div>
  
        <Panel title="Checked in today" padded={false} action={today.data && <Badge tone="green">{today.data.length}</Badge>}>
          <Async state={today}>
            {(rows) =>
              rows.length === 0 ? (
                <EmptyState title="No check-ins yet today" />
              ) : (
                <ul className="max-h-[32rem] divide-y divide-white/[0.05] overflow-y-auto">
                  {rows.map((c) => (
                    <li key={c.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                      <span>
                        <span className="flex items-center gap-2 font-medium text-white">
                          {fullName(c)}
                          {c.isWalkIn && <Badge tone="blue">Walk-in</Badge>}
                        </span>
                        <span className="text-xs text-zinc-500">{c.planName ?? "No plan"}</span>
                      </span>
                      <span className="text-xs tabular-nums text-zinc-400">{formatTime(c.checkedInAt)}</span>
                    </li>
                  ))}
                </ul>
              )
            }
          </Async>
        </Panel>
      </div>
    </>
  );
}

function DayPassPanel({
  client,
  passPlans,
  busy,
  onCancel,
  onSell,
}: {
  client: Person;
  passPlans: Plan[];
  busy: boolean;
  onCancel: () => void;
  onSell: (dayPass: { planId: string; amountCents: number; method: PaymentMethod }) => void;
}) {
  const [planId, setPlanId] = useState(passPlans[0]?.id ?? "");
  const plan = passPlans.find((p) => p.id === planId);
  const [amount, setAmount] = useState(plan?.priceCents != null ? String(plan.priceCents / 100) : "");
  const [method, setMethod] = useState<PaymentMethod>("CASH");

  return (
    <Panel className="border-amber-300/30">
      <div className="flex items-start gap-3">
        <Ticket size={20} className="mt-0.5 shrink-0 text-amber-200" aria-hidden />
        <div className="flex-1">
          <p className="font-semibold text-white">{fullName(client)} has no active membership or pass</p>
          <p className="mt-1 text-sm text-zinc-400">
            Sell a day pass to check them in now, or{" "}
            <Link href={`/dashboard/clients/${client.id}?assign=1`} className="text-brand hover:underline">
              assign a membership
            </Link>
            .
          </p>
        </div>
      </div>

      {passPlans.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-400">No day pass plan is set up. An admin can add one under Plans &amp; Prices.</p>
      ) : (
        <form
          className="mt-5 grid gap-4 sm:grid-cols-3"
          onSubmit={(e) => {
            e.preventDefault();
            onSell({ planId, amountCents: Math.round(Number(amount || 0) * 100), method });
          }}
        >
          <SelectField label="Pass" value={planId} onChange={(e) => setPlanId(e.target.value)}>
            {passPlans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({peso(p.priceCents)})
              </option>
            ))}
          </SelectField>
          <TextField
            label="Amount (₱)"
            type="number"
            min={0}
            step="0.01"
            inputMode="decimal"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <SelectField label="Paid by" value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
            {Object.entries(paymentMethodLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectField>
          <div className="flex gap-2 sm:col-span-3">
            <button type="submit" disabled={busy} className={buttonClasses("primary", "md", "disabled:opacity-60")}>
              {busy && <LoaderCircle size={16} className="animate-spin" aria-hidden />} Sell pass &amp; check in
            </button>
            <button type="button" onClick={onCancel} className={buttonClasses("outline", "md")}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </Panel>
  );
}
