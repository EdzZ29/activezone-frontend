"use client";

import Link from "next/link";
import { ArrowRight, MessageSquareText, Phone, ScanLine, Tags, UserPlus } from "lucide-react";
import { buttonClasses } from "@/app/components/ui/Button";
import { useApi } from "@/lib/api/use-api";
import type { ExpiringMembership, Inquiry, Overview, TodayCheckIn } from "@/lib/api/types";
import { daysUntil, formatDate, formatTime, fullName, inquiryTypeLabels, peso, relativeTime } from "@/lib/format";
import { CheckInsChart } from "./CheckInsChart";
import { useSession } from "./session";
import { Async, Badge, EmptyState, PageHeader, Panel, StatTile } from "./ui";

/** Overview for ADMIN and STAFF. Admins also see monthly revenue and price shortcuts. */
export function StaffOverview() {
  const { user } = useSession();
  const isAdmin = user.role === "ADMIN";
  const stats = useApi<Overview>("/stats/overview");
  const expiring = useApi<ExpiringMembership[]>("/memberships/expiring?days=7");
  const inquiries = useApi<Inquiry[]>("/inquiries?status=NEW");
  const today = useApi<TodayCheckIn[]>("/check-ins");

  return (
    <>
      <PageHeader
        title={`Hi, ${user.firstName}`}
        description={formatDate(new Date().toISOString(), { weekday: "long", month: "long", day: "numeric" })}
        actions={
          <>
            <Link href="/dashboard/check-in" className={buttonClasses("primary", "md")}>
              <ScanLine size={16} aria-hidden /> Check in
            </Link>
            <Link href="/dashboard/clients?new=1" className={buttonClasses("outline", "md")}>
              <UserPlus size={16} aria-hidden /> Add client
            </Link>
            {isAdmin && (
              <Link href="/dashboard/plans" className={buttonClasses("outline", "md")}>
                <Tags size={16} aria-hidden /> Prices
              </Link>
            )}
          </>
        }
      />

      <Async state={stats}>
        {(s) => (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile
              label="Check-ins today"
              value={s.checkInsToday}
              accent
              hint={s.walkInsToday ? `incl. ${s.walkInsToday} walk-in${s.walkInsToday === 1 ? "" : "s"}` : undefined}
            />
            <StatTile label="Active members" value={s.activeMembers} hint={`${s.customers} customer${s.customers === 1 ? "" : "s"} without a plan`} />
            <StatTile label="Revenue today" value={peso(s.revenueTodayCents)} />
            {isAdmin ? (
              <StatTile label="Revenue this month" value={peso(s.revenueMonthCents ?? 0)} />
            ) : (
              <StatTile label="New inquiries" value={s.newInquiries} />
            )}
          </div>
        )}
      </Async>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="Check-ins · last 14 days">
          <Async state={stats}>{(s) => <CheckInsChart data={s.checkInsByDay} />}</Async>
        </Panel>

        <Panel
          title="Today at the desk"
          padded={false}
          action={
            <Link href="/dashboard/check-in" className="text-xs font-semibold text-brand hover:underline">
              Open check-in
            </Link>
          }
        >
          <Async state={today}>
            {(rows) =>
              rows.length === 0 ? (
                <EmptyState title="No check-ins yet today" />
              ) : (
                <ul className="max-h-72 divide-y divide-white/[0.05] overflow-y-auto">
                  {rows.slice(0, 12).map((c) => (
                    <li key={c.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                      {c.userId ? (
                        <Link href={`/dashboard/clients/${c.userId}`} className="font-medium text-white hover:text-brand">
                          {fullName(c)}
                        </Link>
                      ) : (
                        <span className="font-medium text-white">{fullName(c)}</span>
                      )}
                      <span className="flex items-center gap-2 text-xs text-zinc-500">
                        {c.isWalkIn ? (
                          <Badge tone="blue">Walk-in</Badge>
                        ) : (
                          c.planName && <Badge tone={c.planKind === "PASS" ? "blue" : "green"}>{c.planName}</Badge>
                        )}
                        {formatTime(c.checkedInAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              )
            }
          </Async>
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Expiring in 7 days" padded={false}>
          <Async state={expiring}>
            {(rows) =>
              rows.length === 0 ? (
                <EmptyState title="No memberships ending this week" />
              ) : (
                <ul className="divide-y divide-white/[0.05]">
                  {rows.map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-3 px-5 py-3">
                      <div className="min-w-0">
                        <Link href={`/dashboard/clients/${m.userId}`} className="font-medium text-white hover:text-brand">
                          {fullName(m)}
                        </Link>
                        <p className="text-xs text-zinc-500">
                          {m.planName} · ends {formatDate(m.endsAt, { month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <Badge tone={daysUntil(m.endsAt) <= 2 ? "red" : "amber"}>
                          {daysUntil(m.endsAt) === 0 ? "Today" : `${daysUntil(m.endsAt)}d`}
                        </Badge>
                        {m.phone && (
                          <a
                            href={`sms:${m.phone.replace(/\s/g, "")}`}
                            aria-label={`Text ${fullName(m)}`}
                            className="flex size-9 items-center justify-center text-zinc-400 hover:text-brand"
                          >
                            <MessageSquareText size={16} />
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )
            }
          </Async>
        </Panel>

        <Panel
          title="New inquiries"
          padded={false}
          action={
            <Link href="/dashboard/inquiries" className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
              All <ArrowRight size={12} aria-hidden />
            </Link>
          }
        >
          <Async state={inquiries}>
            {(rows) =>
              rows.length === 0 ? (
                <EmptyState title="You're all caught up" />
              ) : (
                <ul className="divide-y divide-white/[0.05]">
                  {rows.slice(0, 5).map((q) => (
                    <li key={q.id} className="px-5 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-white">{q.name}</p>
                        <span className="text-xs text-zinc-500">{relativeTime(q.createdAt)}</span>
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-sm text-zinc-400">
                        <span className="text-zinc-300">{inquiryTypeLabels[q.type]}:</span> {q.message}
                      </p>
                      <a href={`tel:${q.phone.replace(/\s/g, "")}`} className="mt-1 inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-brand">
                        <Phone size={12} aria-hidden /> {q.phone}
                      </a>
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
