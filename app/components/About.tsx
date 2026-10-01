import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { aboutQualities, images } from "@/lib/content";
import { site } from "@/lib/site";
import { ButtonLink } from "./ui/Button";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function About({ showLink = true }: { showLink?: boolean }) {
  return (
    <section id="about" aria-label="About ActiveZone" className="overflow-hidden bg-ink-950 py-24 md:py-32">
      <div className="shell grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <Reveal className="relative">
          <div className="clip-corner-lg relative aspect-[4/5] overflow-hidden bg-ink-800 sm:aspect-[5/5] lg:aspect-[4/5]">
            <Image
              src={images.about}
              alt="Member training with a dumbbell on a bench in a bright gym"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -right-2 hidden w-44 border-4 border-ink-950 sm:block md:w-56 lg:-right-10">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={images.aboutDetail}
                alt="Close-up of a member doing barbell curls"
                fill
                sizes="224px"
                className="object-cover"
              />
            </div>
          </div>
          <div className="absolute left-0 top-0 h-24 w-[3px] bg-brand" aria-hidden />
          <p className="absolute bottom-6 left-6 max-w-[11rem] font-display text-xs font-bold uppercase leading-snug tracking-[0.2em] text-white/80 sm:max-w-none">
            {site.address.city} · Agusan del Norte
          </p>
        </Reveal>

        <div>
          <SectionHeading
            eyebrow="About ActiveZone"
            size="md"
            title={["More than a gym.", "Your active community."]}
            description="ActiveZone Butuan Fitness Studio is a modern fitness space designed to help people stay active, build strength, and work toward their fitness goals in a welcoming environment."
          />

          <Reveal delay={120}>
            <ul className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {aboutQualities.map((quality) => (
                <li key={quality} className="flex items-start gap-3 text-[0.95rem] text-zinc-200">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center bg-brand/15 text-brand">
                    <Check size={13} strokeWidth={3} aria-hidden />
                  </span>
                  {quality}
                </li>
              ))}
            </ul>
          </Reveal>

          {showLink && (
            <Reveal delay={200} className="mt-12">
              <ButtonLink href="/about" variant="outline" icon={<ArrowRight size={16} />}>
                Learn More
              </ButtonLink>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
