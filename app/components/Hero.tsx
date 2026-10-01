import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { images } from "@/lib/content";
import { joinHref, site } from "@/lib/site";
import { ButtonLink } from "./ui/Button";
import { Stars } from "./ui/Stars";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink-950"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src={images.hero}
          alt="Members training among racks of dumbbells in a modern gym"
          fill
          preload
          sizes="100vw"
          className="animate-hero-zoom object-cover object-[60%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/40" />
      </div>

      <div className="shell flex flex-1 flex-col justify-center pb-28 pt-32 md:pb-32 md:pt-40">
        <p
          className="animate-rise inline-flex w-fit items-center gap-2 border border-white/15 bg-black/40 px-3.5 py-2 text-[0.78rem] font-medium text-zinc-200 backdrop-blur-md"
          style={delay(100)}
        >
          <MapPin size={14} className="text-brand" aria-hidden />
          {site.address.short}
        </p>

        <h1
          id="hero-title"
          className="mt-7 font-display text-[clamp(2.9rem,9vw,7.25rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] text-white"
        >
          <span className="animate-rise block" style={delay(200)}>
            Your stronger
          </span>
          <span className="animate-rise block" style={delay(320)}>
            self starts <span className="text-brand">here.</span>
          </span>
        </h1>

        <p
          className="animate-rise mt-7 max-w-lg text-base leading-relaxed text-zinc-300 md:text-lg"
          style={delay(460)}
        >
          Train in a clean, welcoming, and fully equipped fitness studio in the heart of Butuan City.
        </p>

        <div
          className="animate-rise mt-10 flex flex-col gap-3 sm:flex-row"
          style={delay(580)}
        >
          <ButtonLink href={joinHref} size="lg" icon={<ArrowRight size={18} />}>
            Join ActiveZone
          </ButtonLink>
          <ButtonLink href="/membership" variant="outline" size="lg">
            Explore Memberships
          </ButtonLink>
        </div>
      </div>

      {/* Bottom bar: rating + scroll cue */}
      <div className="shell relative pb-8">
        <div className="flex items-end justify-between gap-6">
          <a
            href="#stats"
            className="group hidden items-center gap-4 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-zinc-400 transition-colors hover:text-white md:flex"
          >
            <span className="relative block h-12 w-px overflow-hidden bg-white/15">
              <span className="animate-scroll-cue absolute inset-x-0 top-0 h-1/2 bg-brand" />
            </span>
            Scroll
          </a>

          <div
            className="animate-rise ml-auto flex items-center gap-4 border-l-2 border-brand bg-black/50 py-3 pl-4 pr-5 backdrop-blur-md"
            style={delay(750)}
          >
            <span className="font-display text-3xl font-black text-white">{site.rating.value}</span>
            <span>
              <Stars rating={site.rating.value} size={14} />
              <span className="mt-1 block text-xs text-zinc-400">
                {site.rating.count} {site.rating.source} reviews
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
