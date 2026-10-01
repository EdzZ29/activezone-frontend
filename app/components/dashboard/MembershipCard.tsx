import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ActiveAccess } from "@/lib/api/types";
import { daysUntil, formatDate } from "@/lib/format";

/** The member's "card": plan, validity and days left. Falls back to day pass / no plan. */
export function MembershipCard({ membership, pass }: { membership: ActiveAccess | null; pass: ActiveAccess | null }) {
  const current = membership ?? pass;
  const total = current ? Math.max(1, Math.round((+new Date(current.endsAt) - +new Date(current.startsAt)) / 86_400_000)) : 1;
  const left = current ? daysUntil(current.endsAt) : 0;
  const pct = current ? Math.min(100, Math.max(4, (left / total) * 100)) : 0;
  const endingSoon = membership !== null && left <= 5;

  return (
    <div className="clip-corner-lg relative isolate overflow-hidden border border-white/[0.07] bg-ink-850 p-6 md:p-8">
      <Image
        src="/brand/az-mark.png"
        alt=""
        width={624}
        height={403}
        className="pointer-events-none absolute -bottom-10 -right-10 -z-10 w-64 opacity-[0.06]"
      />
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-zinc-500">
        {membership ? "Membership" : pass ? "Day pass" : "Membership status"}
      </p>

      {current ? (
        <>
          <p className="mt-3 font-display text-4xl font-black uppercase tracking-[-0.02em] text-white">{current.planName}</p>
          <p className="mt-1 text-sm text-zinc-400">
            Valid until <span className="font-semibold text-white">{formatDate(current.endsAt)}</span>
          </p>

          {membership && (
            <div className="mt-8">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-zinc-400">Days remaining</span>
                <span className={`font-display text-2xl font-black ${endingSoon ? "text-amber-200" : "text-white"}`}>{left}</span>
              </div>
              <div className="mt-2 h-1.5 bg-white/[0.08]" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={left} aria-label="Days remaining">
                <div className={`h-full ${endingSoon ? "bg-amber-300" : "bg-brand"}`} style={{ width: `${pct}%` }} />
              </div>
              {endingSoon && (
                <Link href="/dashboard/membership" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-200 hover:underline">
                  Ending soon. Request a renewal <ArrowRight size={14} aria-hidden />
                </Link>
              )}
              <p className="mt-4 text-xs text-zinc-500">
                {current.includesClasses ? "Includes group classes." : "Gym access. Group classes are part of Premium."}
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <p className="mt-3 font-display text-3xl font-black uppercase tracking-[-0.02em] text-white">No active plan</p>
          <p className="mt-2 max-w-sm text-sm text-zinc-400">
            Pick a membership or drop in with a day pass. Payment is made at the front desk.
          </p>
          <Link href="/dashboard/membership" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
            Compare plans <ArrowRight size={14} aria-hidden />
          </Link>
        </>
      )}
    </div>
  );
}
