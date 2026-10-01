import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { trainers } from "@/lib/content";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function Trainers() {
  return (
    <section id="trainers" aria-label="Coaches" className="bg-ink-900 py-24 md:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow="Coaches"
          title={["Meet your", "coaches"]}
          description="Approachable coaches who help members train safely and with purpose, whether it's your first session or your hundredth."
        />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trainers.map((trainer, i) => (
            <Reveal as="li" key={`${trainer.specialty}-${i}`} delay={i * 90}>
              <article className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-ink-800">
                  <Image
                    src={trainer.image}
                    alt={`${trainer.name}, ${trainer.specialty} coach`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover grayscale transition-[filter,transform] duration-700 ease-out-expo group-hover:scale-[1.04] group-hover:grayscale-0"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-transparent to-transparent" />
                  <Link
                    href={trainer.contactHref ?? "/contact?inquiry=personal-training#inquiry"}
                    aria-label={`Contact ${trainer.name} about ${trainer.specialty}`}
                    className="absolute right-4 top-4 flex size-11 items-center justify-center bg-black/60 text-white backdrop-blur transition-colors hover:bg-brand hover:text-ink-950"
                  >
                    <MessageCircle size={18} aria-hidden />
                  </Link>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="font-display text-[0.68rem] font-bold uppercase tracking-[0.22em] text-brand">
                      {trainer.specialty}
                    </p>
                    <h3 className="mt-1.5 font-display text-2xl font-extrabold uppercase tracking-tight text-white">
                      {trainer.name}
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400">{trainer.bio}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
