"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, MessageSquareText, Phone, UserRound } from "lucide-react";
import { useToast } from "@/app/components/dashboard/toast";
import { Async, Badge, EmptyState, PageHeader, Tabs } from "@/app/components/dashboard/ui";
import { buttonClasses } from "@/app/components/ui/Button";
import { api, errorMessage } from "@/lib/api/client";
import type { Inquiry, InquiryStatus } from "@/lib/api/types";
import { useApi } from "@/lib/api/use-api";
import { formatDateTime, inquiryTypeLabels, relativeTime } from "@/lib/format";

type Filter = InquiryStatus | "ALL";

const statusLabels: Record<InquiryStatus, string> = { NEW: "New", CONTACTED: "Contacted", CLOSED: "Closed" };
const statusTone = { NEW: "amber", CONTACTED: "blue", CLOSED: "gray" } as const;

export function InquiriesBoard() {
  const [filter, setFilter] = useState<Filter>("NEW");
  const inquiries = useApi<Inquiry[]>(filter === "ALL" ? "/inquiries" : `/inquiries?status=${filter}`);

  return (
    <>
      <PageHeader title="Inquiries" description="Messages from the website contact form and requests sent by customers from their dashboard." />
      <Tabs<Filter>
        value={filter}
        onChange={setFilter}
        options={[
          { value: "NEW", label: "New" },
          { value: "CONTACTED", label: "Contacted" },
          { value: "CLOSED", label: "Closed" },
          { value: "ALL", label: "All" },
        ]}
      />
      <div className="mt-5">
        <Async state={inquiries}>
          {(rows) =>
            rows.length === 0 ? (
              <EmptyState title={filter === "NEW" ? "No new inquiries" : "Nothing here"}>
                {filter === "NEW" ? "New messages from the website will appear here." : undefined}
              </EmptyState>
            ) : (
              <ul className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                {rows.map((q) => (
                  <InquiryCard key={q.id} inquiry={q} onChanged={inquiries.reload} />
                ))}
              </ul>
            )
          }
        </Async>
      </div>
    </>
  );
}

function InquiryCard({ inquiry: q, onChanged }: { inquiry: Inquiry; onChanged: () => void }) {
  const toast = useToast();
  const [notes, setNotes] = useState(q.notes ?? "");
  const [saving, setSaving] = useState(false);
  const phone = q.phone.replace(/\s/g, "");
  const hasPhone = /\d{7,}/.test(phone);

  async function save(changes: { status?: InquiryStatus; notes?: string }, message: string) {
    setSaving(true);
    try {
      await api(`/inquiries/${q.id}`, { method: "PATCH", body: changes });
      toast(message);
      onChanged();
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <li className="flex flex-col border border-white/[0.07] bg-ink-900 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-white">{q.name}</p>
          <p className="mt-0.5 text-xs text-zinc-500" title={formatDateTime(q.createdAt)}>
            {inquiryTypeLabels[q.type]} · {relativeTime(q.createdAt)}
          </p>
        </div>
        <Badge tone={statusTone[q.status]}>{statusLabels[q.status]}</Badge>
      </div>

      <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-zinc-300">{q.message}</p>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-zinc-400">
        <span className="inline-flex items-center gap-1.5">
          <Phone size={14} aria-hidden /> {q.phone}
        </span>
        {q.email && (
          <a href={`mailto:${q.email}`} className="inline-flex items-center gap-1.5 hover:text-white">
            <Mail size={14} aria-hidden /> {q.email}
          </a>
        )}
        {q.userId && (
          <Link href={`/dashboard/clients/${q.userId}`} className="inline-flex items-center gap-1.5 text-brand hover:underline">
            <UserRound size={14} aria-hidden /> View account
          </Link>
        )}
      </div>

      <label className="mt-4 block text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Notes
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => notes !== (q.notes ?? "") && save({ notes }, "Notes saved.")}
          placeholder="e.g. Called back, interested in Monthly"
          className="mt-1.5 block w-full resize-y border border-white/10 bg-ink-950 px-3 py-2 text-sm font-normal normal-case tracking-normal text-white placeholder:text-zinc-600 focus:border-brand focus:outline-none"
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        {hasPhone && (
          <>
            <a href={`tel:${phone}`} className={buttonClasses("outline", "md", "min-h-10 px-4")}>
              <Phone size={14} aria-hidden /> Call
            </a>
            <a href={`sms:${phone}`} className={buttonClasses("outline", "md", "min-h-10 px-4")}>
              <MessageSquareText size={14} aria-hidden /> Text
            </a>
          </>
        )}
        <span className="flex-1" />
        {q.status !== "CONTACTED" && (
          <button type="button" disabled={saving} onClick={() => save({ status: "CONTACTED" }, "Marked as contacted.")} className={buttonClasses("primary", "md", "min-h-10 px-4 disabled:opacity-60")}>
            Mark contacted
          </button>
        )}
        {q.status !== "CLOSED" ? (
          <button type="button" disabled={saving} onClick={() => save({ status: "CLOSED" }, "Inquiry closed.")} className={buttonClasses("outline", "md", "min-h-10 px-4 disabled:opacity-60")}>
            Close
          </button>
        ) : (
          <button type="button" disabled={saving} onClick={() => save({ status: "NEW" }, "Inquiry reopened.")} className={buttonClasses("outline", "md", "min-h-10 px-4 disabled:opacity-60")}>
            Reopen
          </button>
        )}
      </div>
    </li>
  );
}
