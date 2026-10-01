"use client";

import { useState } from "react";
import { formatDate } from "@/lib/format";

type Point = { day: string; visits: number };

/** Daily check-ins as columns (one series, so no legend; the panel title names it). */
export function CheckInsChart({ data }: { data: Point[] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(4, ...data.map((d) => d.visits));
  // Round the axis top to a tidy number so gridlines land on whole values.
  const step = Math.ceil(max / 4);
  const top = step * 4;
  const ticks = [0, step, step * 2, step * 3, top];
  const label = (d: Point) => formatDate(`${d.day}T12:00:00+08:00`, { weekday: "short", month: "short", day: "numeric" });
  const total = data.reduce((sum, d) => sum + d.visits, 0);

  return (
    <figure>
      <div className="relative flex h-56 gap-3">
        {/* Y axis */}
        <div className="relative w-6 shrink-0 text-right text-[0.68rem] tabular-nums text-zinc-500" aria-hidden>
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 -translate-y-1/2" style={{ bottom: `${(t / top) * 100}%` }}>
              {t}
            </span>
          ))}
        </div>

        <div className="relative flex-1">
          {/* Gridlines: hairline, solid, recessive */}
          {ticks.map((t) => (
            <span
              key={t}
              aria-hidden
              className={`absolute inset-x-0 h-px ${t === 0 ? "bg-white/20" : "bg-white/[0.06]"}`}
              style={{ bottom: `${(t / top) * 100}%` }}
            />
          ))}

          <ol className="absolute inset-0 flex items-end" onMouseLeave={() => setActive(null)}>
            {data.map((d, i) => (
              <li key={d.day} className="relative flex h-full flex-1 items-end justify-center">
                {/* Hit target is the full column, wider than the bar */}
                <button
                  type="button"
                  className="absolute inset-0 focus-visible:outline-offset-0"
                  aria-label={`${label(d)}: ${d.visits} check-in${d.visits === 1 ? "" : "s"}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                />
                <span
                  aria-hidden
                  className={`pointer-events-none w-[min(24px,70%)] rounded-t-[4px] transition-colors ${
                    active === i ? "bg-brand" : "bg-chart"
                  }`}
                  style={{ height: `${(d.visits / top) * 100}%`, minHeight: d.visits ? 2 : 0 }}
                />
                {active === i && (
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute z-10 -translate-y-2 whitespace-nowrap border border-white/10 bg-ink-950 px-2.5 py-1.5 text-xs shadow-xl"
                    style={{
                      bottom: `${(d.visits / top) * 100}%`,
                      ...(i < 2 ? { left: 0 } : i > data.length - 3 ? { right: 0 } : {}),
                    }}
                  >
                    <span className="block text-zinc-400">{label(d)}</span>
                    <span className="font-semibold text-white">
                      {d.visits} check-in{d.visits === 1 ? "" : "s"}
                    </span>
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* X axis: first, middle and last day keep labels from colliding */}
      <div className="ml-9 mt-2 flex justify-between text-[0.68rem] text-zinc-500" aria-hidden>
        <span>{formatDate(`${data[0].day}T12:00:00+08:00`, { month: "short", day: "numeric" })}</span>
        <span>{formatDate(`${data[7]?.day ?? data[0].day}T12:00:00+08:00`, { month: "short", day: "numeric" })}</span>
        <span>Today</span>
      </div>

      <figcaption className="mt-3 text-xs text-zinc-500">{total} check-ins in the last 14 days</figcaption>

      {/* Table view for screen readers */}
      <table className="sr-only">
        <caption>Check-ins per day, last 14 days</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Check-ins</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.day}>
              <td>{label(d)}</td>
              <td>{d.visits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
