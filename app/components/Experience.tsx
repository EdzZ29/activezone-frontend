import Image from "next/image";
import { experience } from "@/lib/content";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function Experience() {
  return (
    <section aria-label="Member experience" className="overflow-hidden bg-ink-950 py-24 md:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow="Member Experience"
          title={["Train with", "confidence"]}
          description="Whether you're just getting started or already have years of training experience, ActiveZone provides a space where you can focus on your goals."
        />
      </div>

      {/* Horizontal strip on mobile, five-column mosaic from md up */}
      <div className="shell mt-14">
        <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0">
          {experience.map((item, i) => (
            <Reveal
              as="li"
              key={item.label}
              delay={i * 80}
              className={`w-[72%] shrink-0 snap-start sm:w-[45%] md:w-auto ${i % 2 === 1 ? "md:mt-12" : ""}`}
            >
              <figure className="group relative aspect-[3/4] overflow-hidden bg-ink-800 md:aspect-[3/5]">
                <Image
                  src={item.image}
                  alt={`${item.label} at the gym`}
                  fill
                  sizes="(min-width: 768px) 20vw, 72vw"
                  className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.06]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5">
                  <span className="font-display text-xs font-bold text-brand">0{i + 1}</span>
                  <span className="mt-1 block font-display text-lg font-extrabold uppercase leading-tight tracking-tight text-white">
                    {item.label}
                  </span>
                  <span className="mt-2 block text-sm leading-snug text-zinc-300">{item.text}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
