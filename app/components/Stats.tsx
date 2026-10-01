import { site } from "@/lib/site";
import { CountUp } from "./ui/CountUp";
import { Reveal } from "./ui/Reveal";

const stats = [
  { value: site.rating.value, decimals: 1, suffix: "★", label: `${site.rating.source} Rating` },
  { value: site.rating.count, suffix: "+", label: "Reviews" },
  { value: 10, suffix: " PM", label: "Closing Time" },
  { value: 100, suffix: "%", label: "Fitness Focused" },
];

export function Stats() {
  return (
    <section id="stats" aria-label="ActiveZone at a glance" className="border-y border-white/[0.06] bg-ink-900">
      <div className="shell">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={i * 80}
              className={`flex flex-col-reverse gap-2 py-9 md:py-12 ${
                i % 2 === 1 ? "border-l border-white/[0.06] pl-6 md:pl-10" : ""
              } ${i >= 2 ? "border-t border-white/[0.06] lg:border-t-0" : ""} ${
                i === 2 ? "lg:border-l lg:pl-10" : ""
              }`}
            >
              <dt className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-zinc-500 md:text-xs">
                {stat.label}
              </dt>
              <dd className="font-display text-[clamp(2.4rem,6vw,4.25rem)] font-black leading-none tracking-[-0.03em] text-white">
                <CountUp to={stat.value} decimals={stat.decimals} />
                <span className="text-brand">{stat.suffix}</span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
