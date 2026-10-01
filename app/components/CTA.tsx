import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { images } from "@/lib/content";
import { joinHref } from "@/lib/site";
import { ButtonLink } from "./ui/Button";
import { Reveal } from "./ui/Reveal";

export function CTA() {
  return (
    <section aria-label="Start your fitness journey" className="relative isolate overflow-hidden bg-ink-950">
      <Image
        src={images.finalCta}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40" />
      <div aria-hidden className="absolute inset-y-0 left-0 -z-10 w-1.5 bg-brand" />

      <div className="shell py-28 md:py-40">
        <Reveal className="max-w-3xl">
          <h2 className="font-display text-[clamp(2.6rem,7vw,6rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-white">
            Your fitness journey <span className="text-brand">starts today.</span>
          </h2>
          <p className="mt-7 max-w-lg text-base leading-relaxed text-zinc-300 md:text-lg">
            Step into ActiveZone and start working toward a stronger, healthier, more active you.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={joinHref} size="lg" icon={<ArrowRight size={18} />}>
              Join Now
            </ButtonLink>
            <ButtonLink href="/contact#inquiry" variant="outline" size="lg">
              Contact Us
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
