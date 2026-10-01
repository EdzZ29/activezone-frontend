"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { CircleCheck, Info, RefreshCw, Sun } from "lucide-react";
import { useSession } from "@/app/components/dashboard/session";
import { Async, PageHeader } from "@/app/components/dashboard/ui";
import type { MyPassCode } from "@/lib/api/types";
import { useApi } from "@/lib/api/use-api";
import { formatDate, formatTime, fullName } from "@/lib/format";

/** How often to re-check the code and whether the front desk has scanned it. */
const POLL_MS = 8000;

export function MyPass() {
  const { user, access } = useSession();
  const pass = useApi<MyPassCode>("/check-ins/my-code");
  const { reload } = pass;
  const [image, setImage] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const code = pass.data?.code;
  const refreshAt = pass.data?.refreshAt;

  // Keep the code fresh and pick up the desk's scan without a page reload.
  useEffect(() => {
    const id = setInterval(reload, POLL_MS);
    return () => clearInterval(id);
  }, [reload]);

  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    QRCode.toString(code, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 2,
      color: { dark: "#08080a", light: "#ffffff" },
    }).then((svg) => {
      if (!cancelled) setImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
    });
    return () => {
      cancelled = true;
    };
  }, [code]);

  useEffect(() => {
    if (!refreshAt) return;
    const tick = () => setSecondsLeft(Math.max(0, Math.round((new Date(refreshAt).getTime() - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [refreshAt]);

  const plan = access.membership ?? access.pass;

  return (
    <>
      <PageHeader title="My QR pass" description="Show this at the front desk. Staff scan it to record your time-in for the day." />

      <Async state={pass}>
        {(p) => (
          <div className="mx-auto max-w-sm">
            {p.checkedInAt ? (
              <div role="status" className="mb-4 flex items-center gap-3 border border-brand/40 bg-brand/10 p-4">
                <CircleCheck size={22} className="shrink-0 text-brand" aria-hidden />
                <p className="text-sm text-white">
                  <span className="font-semibold">You&apos;re timed in today</span> at {formatTime(p.checkedInAt)}. Have a
                  great workout!
                </p>
              </div>
            ) : !p.hasAccess ? (
              <div className="mb-4 flex items-start gap-3 border border-amber-300/30 bg-amber-300/[0.06] p-4 text-sm text-zinc-200">
                <Info size={18} className="mt-0.5 shrink-0 text-amber-200" aria-hidden />
                <p>You don&apos;t have an active plan right now. When staff scan this, they can sell you a day pass.</p>
              </div>
            ) : null}

            <div className="border border-white/[0.07] bg-ink-900 p-6 text-center">
              <div className="mx-auto aspect-square w-full max-w-[18rem] bg-white p-2">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt="Your ActiveZone QR pass" className="size-full [image-rendering:pixelated]" />
                ) : (
                  <div className="size-full animate-pulse bg-zinc-200" />
                )}
              </div>
              <p className="mt-5 font-display text-xl font-extrabold uppercase tracking-tight text-white">{fullName(user)}</p>
              <p className="mt-1 text-sm text-zinc-400">
                {plan ? `${plan.planName} · valid until ${formatDate(plan.endsAt)}` : "No active plan"}
              </p>
              <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-zinc-500">
                <RefreshCw size={12} aria-hidden />
                {secondsLeft !== null && secondsLeft > 0 ? `New code in ${secondsLeft}s` : "Refreshing…"} · changes so it can&apos;t be copied
              </p>
            </div>

            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-500">
              <Sun size={14} aria-hidden /> Turn up your screen brightness for a quicker scan.
            </p>
          </div>
        )}
      </Async>
    </>
  );
}
