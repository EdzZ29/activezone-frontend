import { features } from "@/lib/content";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function WhyActiveZone() {
  return (
    <section aria-label="Why train at ActiveZone" className="relative overflow-hidden bg-ink-900 py-24 md:py-32">
      {/* Faint brand mark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 top-10 select-none font-display text-[clamp(8rem,22vw,20rem)] font-black leading-none tracking-tighter text-white/[0.025]"
      >
        AZ
      </span>

      <div className="shell relative grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.4fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eyebrow="Why ActiveZone"
            size="md"
            title={["Why train at", "ActiveZone?"]}
            description="Everything you need to train consistently — in a space that feels good to walk into."
          />
        </div>

        <div className="grid gap-px bg-white/[0.06] sm:grid-cols-2">
          {features.map(({ title, description, icon: Icon }, i) => (
            <Reveal
              key={title}
              delay={i * 90}
              className="group relative bg-ink-900 p-8 transition-colors duration-300 hover:bg-ink-850 md:p-10"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-brand transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
              />
              <div className="flex items-start justify-between">
                <span className="flex size-14 items-center justify-center border border-white/10 text-brand transition-colors duration-300 group-hover:border-brand/50">
                  <Icon size={26} strokeWidth={1.75} aria-hidden />
                </span>
                <span className="font-display text-sm font-bold text-zinc-600">0{i + 1}</span>
              </div>
              <h3 className="mt-8 font-display text-xl font-extrabold uppercase tracking-tight text-white md:text-2xl">
                {title}
              </h3>
              <p className="mt-3 leading-relaxed text-zinc-400">{description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
