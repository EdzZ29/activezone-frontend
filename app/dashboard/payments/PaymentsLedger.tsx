"use client";

import Link from "next/link";
import { useState } from "react";
import { Download } from "lucide-react";
import { Async, Badge, EmptyState, PageHeader, Panel, StatTile, Table, Tabs } from "@/app/components/dashboard/ui";
import { buttonClasses } from "@/app/components/ui/Button";
import type { LedgerPayment } from "@/lib/api/types";
import { useApi } from "@/lib/api/use-api";
import { formatDate, formatDateTime, fullName, manilaDateKey, paymentMethodLabels, peso } from "@/lib/format";

type Range = "today" | "7" | "30" | "month";

function rangeFrom(range: Range) {
  const today = manilaDateKey();
  if (range === "today") return today;
  if (range === "month") return `${today.slice(0, 8)}01`;
  return manilaDateKey(new Date(Date.now() - (Number(range) - 1) * 86_400_000));
}

type Ledger = { from: string; to: string; totalCents: number; refundsCents: number; payments: LedgerPayment[] };

export function PaymentsLedger() {
  const [range, setRange] = useState<Range>("30");
  const ledger = useApi<Ledger>(`/payments?from=${rangeFrom(range)}T00:00:00%2B08:00`);

  function exportCsv(rows: LedgerPayment[]) {
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const lines = [
      ["Date", "Client", "Type", "Amount (PHP)", "Method", "Note", "Recorded by"],
      ...rows.map((p) => [
        formatDateTime(p.createdAt),
        fullName(p),
        p.amountCents < 0 ? "Refund" : p.isWalkIn ? "Walk-in" : "Payment",
        (p.amountCents / 100).toFixed(2),
        paymentMethodLabels[p.method],
        p.note ?? "",
        p.recordedBy ?? "",
      ]),
    ].map((r) => r.map((c) => escape(String(c))).join(","));
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `activezone-payments-${rangeFrom(range)}.csv` });
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader title="Payments" description="Everything recorded at the front desk: memberships, day passes, walk-in guests and refunds from cancellations." />

      <Tabs<Range>
        value={range}
        onChange={setRange}
        options={[
          { value: "today", label: "Today" },
          { value: "7", label: "Last 7 days" },
          { value: "30", label: "Last 30 days" },
          { value: "month", label: "This month" },
        ]}
      />

      <Async state={ledger}>
        {({ totalCents, refundsCents, payments, from, to }) => {
          const byMethod = payments.reduce<Record<string, number>>((acc, p) => {
            acc[p.method] = (acc[p.method] ?? 0) + p.amountCents;
            return acc;
          }, {});
          const top = Object.entries(byMethod).sort((a, b) => b[1] - a[1]);
          const walkIns = payments.filter((p) => p.isWalkIn);
          const walkInCents = walkIns.reduce((sum, p) => sum + p.amountCents, 0);
          const walkInCount = walkIns.length;
          return (
            <>
              <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatTile
                  label="Net collected"
                  value={peso(totalCents)}
                  accent
                  hint={`${formatDate(from, { month: "short", day: "numeric" })} – ${formatDate(to)}`}
                />
                <StatTile label="Walk-ins" value={peso(walkInCents)} hint={`${walkInCount} guest${walkInCount === 1 ? "" : "s"}`} />
                <StatTile label="Refunds" value={peso(refundsCents)} hint={refundsCents ? "From cancellations" : "None in this period"} />
                {top.slice(0, 1).map(([method, cents]) => (
                  <StatTile key={method} label={`Top method · ${paymentMethodLabels[method as keyof typeof paymentMethodLabels]}`} value={peso(cents)} />
                ))}
              </div>

              <Panel
                className="mt-4"
                padded={false}
                title="Transactions"
                action={
                  payments.length > 0 && (
                    <button type="button" onClick={() => exportCsv(payments)} className={buttonClasses("ghost", "md", "text-xs")}>
                      <Download size={14} aria-hidden /> Export CSV
                    </button>
                  )
                }
              >
                {payments.length === 0 ? (
                  <EmptyState title="No payments in this period" />
                ) : (
                  <Table head={["Date", "Client", "Amount", "Method", "Note", "Recorded by"]}>
                    {payments.map((p) => (
                      <tr key={p.id}>
                        <td className="whitespace-nowrap px-5 py-3 text-zinc-400">{formatDateTime(p.createdAt)}</td>
                        <td className="px-5 py-3">
                          <span className="flex items-center gap-2">
                            {p.userId ? (
                              <Link href={`/dashboard/clients/${p.userId}`} className="font-medium text-white hover:text-brand">
                                {fullName(p)}
                              </Link>
                            ) : (
                              <span className="font-medium text-white">{fullName(p)}</span>
                            )}
                            {p.isWalkIn && <Badge tone="blue">Walk-in</Badge>}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3 font-semibold tabular-nums text-white">
                          {peso(p.amountCents)}
                          {p.amountCents < 0 && (
                            <span className="ml-2 align-middle">
                              <Badge tone="red">Refund</Badge>
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-zinc-400">{paymentMethodLabels[p.method]}</td>
                        <td className="px-5 py-3 text-zinc-500">{p.note ?? ""}</td>
                        <td className="px-5 py-3 text-zinc-500">{p.recordedBy ?? ""}</td>
                      </tr>
                    ))}
                  </Table>
                )}
              </Panel>
            </>
          );
        }}
      </Async>
    </>
  );
}
