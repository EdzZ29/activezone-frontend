"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Dumbbell, MapPin, Phone, QrCode } from "lucide-react";
import { buttonClasses } from "@/app/components/ui/Button";
import { site } from "@/lib/site";
import { useApi } from "@/lib/api/use-api";
import type { CheckIn, MyInquiry } from "@/lib/api/types";
import { formatDate, formatDateTime, formatTime, formatWeekday, manilaDateKey } from "@/lib/format";
import { MembershipCard } from "./MembershipCard";
import { useSession } from "./session";
import { Async, Badge, EmptyState, PageHeader, Panel, StatTile } from "./ui";

type Upcoming = { sessionId: string; className: string; startsAt: string; endsAt: string; coachName: string | null };

/** Overview for MEMBER and CUSTOMER accounts. */
export function ClientOverview() {
  const { user, access } = useSession();
  const isMember = user.role === "MEMBER";
  const visits = useApi<CheckIn[]>("/check-ins/me");
  const upcoming = useApi<Upcoming[]>(isMember ? "/sessions/mine" : null);
  const requests = useApi<MyInquiry[]>(isMember ? null : "/inquiries/me");

  const thisMonth = manilaDateKey().slice(0, 7);

  return (
    <>
      <PageHeader
        title={`Hi, ${user.firstName}`}
        description={isMember ? "Here's your training at a glance." : "Welcome to ActiveZone. Here's where to start."}
        actions={
          <Link href="/dashboard/pass" className={buttonClasses("primary", "md")}>
            <QrCode size={16} aria-hidden /> Show my QR pass
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr]">
        <MembershipCard membership={access.membership} pass={access.pass} />

        <div className="grid grid-cols-2 gap-3">
          <Async state={visits}>
            {(rows) => (
              <>
                <StatTile label="Visits this month" value={rows.filter((v) => manilaDateKey(v.checkedInAt).startsWith(thisMonth)).length} />
                <StatTile
                  label="Last visit"
                  value={rows[0] ? formatDate(rows[0].checkedInAt, { month: "short", day: "numeric" }) : "None"}
                  hint={rows[0] ? formatTime(rows[0].checkedInAt) : "Check in at the front desk"}
                />
              </>
            )}
          </Async>
          {isMember ? (
            <Async state={upcoming}>
              {(rows) => <StatTile label="Classes booked" value={rows.length} hint="Upcoming" />}
            </Async>
          ) : (
            <StatTile label="Membership" value="None" hint="Ask us about plans" />
          )}
          <StatTile label="Open until" value={site.hours.closesShort} hint="Closing time" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {isMember ? (
          <Panel
            title="Your upcoming classes"
            padded={false}
            action={
              <Link href="/dashboard/classes" className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
                Book <ArrowRight size={12} aria-hidden />
              </Link>
            }
          >
            <Async state={upcoming}>
              {(rows) =>
                rows.length === 0 ? (
                  <EmptyState title="No classes booked">
                    {access.membership?.includesClasses
                      ? "Browse the schedule and save your spot."
                      : "Your plan doesn't include group classes. Ask the front desk about Premium."}
                  </EmptyState>
                ) : (
                  <ul className="divide-y divide-white/[0.05]">
                    {rows.map((s) => (
                      <li key={s.sessionId} className="flex items-center gap-4 px-5 py-3.5">
                        <CalendarDays size={18} className="shrink-0 text-brand" aria-hidden />
                        <div>
                          <p className="font-medium text-white">{s.className}</p>
                          <p className="text-xs text-zinc-500">
                            {formatWeekday(s.startsAt)} · {formatTime(s.startsAt)}
                            {s.coachName ? ` · ${s.coachName}` : ""}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              }
            </Async>
          </Panel>
        ) : (
          <Panel title="Get started">
            <ol className="space-y-4 text-sm">
              {[
                ["Pick a plan", "Compare the day pass and memberships, then send a request."],
                ["Visit the front desk", `${site.address.floor}, ${site.address.street}. Pay in person and we'll activate it.`],
                ["Start training", "Your membership, visits and classes show up here."],
              ].map(([title, text], i) => (
                <li key={title} className="flex gap-4">
                  <span className="flex size-7 shrink-0 items-center justify-center bg-brand/15 font-display text-xs font-extrabold text-brand">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block font-semibold text-white">{title}</span>
                    <span className="text-zinc-400">{text}</span>
                  </span>
                </li>
              ))}
            </ol>
            <Link href="/dashboard/membership" className={buttonClasses("primary", "md", "mt-6")}>
              <Dumbbell size={16} aria-hidden /> View plans
            </Link>
          </Panel>
        )}

        <Panel title="Recent visits" padded={false}>
          <Async state={visits}>
            {(rows) =>
              rows.length === 0 ? (
                <EmptyState title="No visits yet">Your check-ins at the front desk will show up here.</EmptyState>
              ) : (
                <ul className="max-h-80 divide-y divide-white/[0.05] overflow-y-auto">
                  {rows.slice(0, 10).map((v) => (
                    <li key={v.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                      <span className="text-white">{formatDateTime(v.checkedInAt)}</span>
                      {v.planName && <Badge tone="gray">{v.planName}</Badge>}
                    </li>
                  ))}
                </ul>
              )
            }
          </Async>
        </Panel>
      </div>

      {!isMember && (
        <div className="mt-4">
          <Panel title="Your requests" padded={false}>
            <Async state={requests}>
              {(rows) =>
                rows.length === 0 ? (
                  <EmptyState title="No requests yet">Requests you send from the Memberships page appear here.</EmptyState>
                ) : (
                  <ul className="divide-y divide-white/[0.05]">
                    {rows.map((r) => (
                      <li key={r.id} className="flex items-start justify-between gap-4 px-5 py-3 text-sm">
                        <span className="text-zinc-300">{r.message}</span>
                        <Badge tone={r.status === "NEW" ? "amber" : r.status === "CONTACTED" ? "blue" : "gray"}>
                          {r.status === "NEW" ? "Sent" : r.status === "CONTACTED" ? "Contacted" : "Closed"}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )
              }
            </Async>
          </Panel>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3 border border-white/[0.07] bg-ink-900 p-5 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-2">
          <MapPin size={16} className="text-brand" aria-hidden /> {site.address.full}
        </span>
        <span className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <Clock size={16} className="text-brand" aria-hidden /> {site.hours.label}
          </span>
          <a href={site.phone.href} className="flex items-center gap-2 hover:text-white">
            <Phone size={16} className="text-brand" aria-hidden /> {site.phone.display}
          </a>
        </span>
      </div>
    </>
  );
}
