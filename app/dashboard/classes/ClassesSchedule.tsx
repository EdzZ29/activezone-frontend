"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { CalendarPlus, Clock, Info, Plus, UserRound, Users } from "lucide-react";
import { FormError, SelectField, TextAreaField, TextField } from "@/app/components/dashboard/fields";
import { SubmitButton } from "@/app/components/dashboard/forms";
import { useSession } from "@/app/components/dashboard/session";
import { useToast } from "@/app/components/dashboard/toast";
import { Async, Badge, EmptyState, Modal, PageHeader, Panel } from "@/app/components/dashboard/ui";
import { buttonClasses } from "@/app/components/ui/Button";
import { api, errorMessage } from "@/lib/api/client";
import type { ClassSession, GymClass, RosterEntry } from "@/lib/api/types";
import { useApi } from "@/lib/api/use-api";
import { formatTime, formatWeekday, fullName, manilaDateKey, manilaDateTime } from "@/lib/format";

export function ClassesSchedule() {
  const { user, access } = useSession();
  const toast = useToast();
  const isStaff = user.role === "ADMIN" || user.role === "STAFF";
  const canBook = user.role === "MEMBER" && Boolean(access.membership?.includesClasses);
  const sessions = useApi<ClassSession[]>("/sessions");
  const classes = useApi<GymClass[]>(isStaff ? "/classes" : null);
  const [creating, setCreating] = useState(false);
  const [addingClass, setAddingClass] = useState(false);
  const [roster, setRoster] = useState<ClassSession | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function act(session: ClassSession, action: () => Promise<unknown>, message: string) {
    setBusy(session.id);
    try {
      await action();
      toast(message);
      sessions.reload();
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setBusy(null);
    }
  }

  const description = isStaff
    ? "Schedule sessions for the next two weeks. Members on plans that include classes can book online."
    : canBook
      ? "Book your spot in upcoming sessions. Please cancel if you can't make it so someone else can join."
      : "Upcoming group sessions at ActiveZone.";

  return (
    <>
      <PageHeader
        title="Classes"
        description={description}
        actions={
          isStaff && (
            <>
              <button type="button" onClick={() => setCreating(true)} className={buttonClasses("primary", "md")}>
                <CalendarPlus size={16} aria-hidden /> Schedule session
              </button>
              <button type="button" onClick={() => setAddingClass(true)} className={buttonClasses("outline", "md")}>
                <Plus size={16} aria-hidden /> Class type
              </button>
            </>
          )
        }
      />

      {!isStaff && !canBook && (
        <div className="mb-5 flex items-start gap-3 border border-sky-300/20 bg-sky-300/[0.05] p-4 text-sm text-zinc-300">
          <Info size={18} className="mt-0.5 shrink-0 text-sky-200" aria-hidden />
          <p>
            {user.role === "MEMBER"
              ? `Your ${access.membership?.planName ?? ""} plan covers gym access. Group classes are included with Premium. `
              : "Online booking is for members on a plan that includes group classes. "}
            <Link href="/dashboard/membership" className="font-semibold text-white underline-offset-4 hover:underline">
              See plans
            </Link>
            .
          </p>
        </div>
      )}

      <Async state={sessions}>
        {(rows) => {
          if (rows.length === 0) {
            return (
              <Panel>
                <EmptyState title="No sessions scheduled">
                  {isStaff ? "Use “Schedule session” to add the next classes." : "Check back soon or ask the front desk."}
                </EmptyState>
              </Panel>
            );
          }
          const days = new Map<string, ClassSession[]>();
          for (const s of rows) {
            const key = manilaDateKey(s.startsAt);
            days.set(key, [...(days.get(key) ?? []), s]);
          }
          return (
            <div className="space-y-6">
              {[...days.entries()].map(([day, list]) => (
                <section key={day}>
                  <h2 className="mb-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                    {day === manilaDateKey() ? "Today" : formatWeekday(list[0].startsAt)}
                  </h2>
                  <ul className="divide-y divide-white/[0.05] border border-white/[0.07] bg-ink-900">
                    {list.map((s) => {
                      const spots = s.capacity - s.bookedCount;
                      const started = new Date(s.startsAt) < new Date();
                      return (
                        <li key={s.id} className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center ${s.isCancelled ? "opacity-60" : ""}`}>
                          <div className="w-28 shrink-0">
                            <p className="font-display text-lg font-black text-white">{formatTime(s.startsAt)}</p>
                            <p className="flex items-center gap-1 text-xs text-zinc-500">
                              <Clock size={12} aria-hidden /> until {formatTime(s.endsAt)}
                            </p>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-white">{s.className}</p>
                              {s.isCancelled && <Badge tone="red">Cancelled</Badge>}
                              {s.myBooking && !s.isCancelled && <Badge tone="green">Booked</Badge>}
                            </div>
                            <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                              {s.coachName && (
                                <span className="inline-flex items-center gap-1">
                                  <UserRound size={12} aria-hidden /> {s.coachName}
                                </span>
                              )}
                              <span className={`inline-flex items-center gap-1 ${spots <= 0 ? "text-amber-200" : ""}`}>
                                <Users size={12} aria-hidden /> {s.bookedCount}/{s.capacity} booked
                              </span>
                            </p>
                          </div>

                          <div className="flex shrink-0 gap-2">
                            {isStaff ? (
                              <>
                                <button type="button" onClick={() => setRoster(s)} className={buttonClasses("outline", "md", "min-h-10 px-4")}>
                                  Roster
                                </button>
                                <button
                                  type="button"
                                  disabled={busy === s.id}
                                  onClick={() => {
                                    if (!s.isCancelled && !confirm(`Cancel ${s.className} on ${formatWeekday(s.startsAt)}?`)) return;
                                    act(
                                      s,
                                      () => api(`/sessions/${s.id}`, { method: "PATCH", body: { isCancelled: !s.isCancelled } }),
                                      s.isCancelled ? "Session restored." : "Session cancelled.",
                                    );
                                  }}
                                  className={buttonClasses("ghost", "md", "min-h-10 px-3 text-zinc-400")}
                                >
                                  {s.isCancelled ? "Restore" : "Cancel"}
                                </button>
                              </>
                            ) : canBook && !started ? (
                              s.myBooking ? (
                                <button
                                  type="button"
                                  disabled={busy === s.id}
                                  onClick={() => act(s, () => api(`/sessions/${s.id}/book`, { method: "DELETE" }), "Booking cancelled.")}
                                  className={buttonClasses("outline", "md", "min-h-10 px-4 disabled:opacity-60")}
                                >
                                  Cancel booking
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled={busy === s.id || spots <= 0}
                                  onClick={() => act(s, () => api(`/sessions/${s.id}/book`, { method: "POST" }), `Booked ${s.className}.`)}
                                  className={buttonClasses("primary", "md", "min-h-10 px-5 disabled:opacity-50")}
                                >
                                  {spots <= 0 ? "Full" : "Book"}
                                </button>
                              )
                            ) : null}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          );
        }}
      </Async>

      {isStaff && classes.data && (
        <>
          <SessionForm
            open={creating}
            classes={classes.data.filter((c) => c.isActive)}
            onClose={() => setCreating(false)}
            onSaved={() => {
              setCreating(false);
              toast("Session scheduled.");
              sessions.reload();
            }}
          />
          <ClassTypeForm
            open={addingClass}
            onClose={() => setAddingClass(false)}
            onSaved={() => {
              setAddingClass(false);
              toast("Class type added.");
              classes.reload();
            }}
          />
        </>
      )}

      <Modal open={roster !== null} onClose={() => setRoster(null)} title={roster ? `${roster.className} roster` : "Roster"} description={roster ? `${formatWeekday(roster.startsAt)} · ${formatTime(roster.startsAt)}` : undefined}>
        {roster && <Roster sessionId={roster.id} />}
      </Modal>
    </>
  );
}

function Roster({ sessionId }: { sessionId: string }) {
  const roster = useApi<RosterEntry[]>(`/sessions/${sessionId}/bookings`);
  return (
    <Async state={roster}>
      {(rows) =>
        rows.length === 0 ? (
          <EmptyState title="No bookings yet" />
        ) : (
          <ol className="divide-y divide-white/[0.05] border border-white/[0.07]">
            {rows.map((r, i) => (
              <li key={r.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <span className="flex items-center gap-3">
                  <span className="w-5 text-right text-xs tabular-nums text-zinc-500">{i + 1}</span>
                  <Link href={`/dashboard/clients/${r.userId}`} className="font-medium text-white hover:text-brand">
                    {fullName(r)}
                  </Link>
                </span>
                <span className="text-xs text-zinc-500">{r.phone ?? ""}</span>
              </li>
            ))}
          </ol>
        )
      }
    </Async>
  );
}

function SessionForm({ open, classes, onClose, onSaved }: { open: boolean; classes: GymClass[]; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ classId: classes[0]?.id ?? "", date: manilaDateKey(), time: "18:00", minutes: "60", coachName: "", capacity: "20" });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const startsAt = manilaDateTime(form.date, form.time);
      const endsAt = new Date(new Date(startsAt).getTime() + Number(form.minutes) * 60_000).toISOString();
      await api("/sessions", {
        method: "POST",
        body: { classId: form.classId, startsAt, endsAt, coachName: form.coachName || undefined, capacity: Number(form.capacity) },
      });
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Schedule session" description="Times are in Philippine time.">
      <form onSubmit={submit} className="space-y-5">
        <FormError message={error} />
        <SelectField label="Class" value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })}>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </SelectField>
        <div className="grid gap-5 sm:grid-cols-3">
          <TextField label="Date" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <TextField label="Start" type="time" required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          <SelectField label="Length" value={form.minutes} onChange={(e) => setForm({ ...form, minutes: e.target.value })}>
            {["30", "45", "60", "75", "90"].map((m) => (
              <option key={m} value={m}>
                {m} min
              </option>
            ))}
          </SelectField>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Coach" optional value={form.coachName} onChange={(e) => setForm({ ...form, coachName: e.target.value })} />
          <TextField label="Capacity" type="number" min={1} max={200} required value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
        </div>
        <SubmitButton pending={pending}>Schedule</SubmitButton>
      </form>
    </Modal>
  );
}

function ClassTypeForm({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await api("/classes", { method: "POST", body: { name, description: description || undefined } });
      setName("");
      setDescription("");
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="New class type">
      <form onSubmit={submit} className="space-y-5">
        <FormError message={error} />
        <TextField label="Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Circuit Training" />
        <TextAreaField label="Description" optional rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        <SubmitButton pending={pending}>Add class type</SubmitButton>
      </form>
    </Modal>
  );
}
