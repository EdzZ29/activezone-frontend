"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Quote } from "lucide-react";
import { testimonials } from "@/lib/content";
import { site } from "@/lib/site";
import { ButtonLink } from "./ui/Button";
import { GoogleIcon } from "./ui/Icons";
import { Reveal } from "./ui/Reveal";
import { Eyebrow } from "./ui/SectionHeading";
import { Stars } from "./ui/Stars";

export function Testimonials() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(0);

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    if (!card) return;
    setCurrent(Math.round(track.scrollLeft / (card.offsetWidth + 12)));
  };

  const scrollTo = (i: number) => {
    const card = trackRef.current?.children[i] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <section aria-label="Member reviews" className="bg-ink-900 py-24 md:py-32">
      <div className="shell grid grid-cols-1 gap-14 lg:grid-cols-[0.8fr_1.6fr] lg:gap-16">
        {/* Rating summary */}
        <Reveal className="flex flex-col">
          <Eyebrow>Reviews</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2.1rem,5.2vw,4rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-white">
            What members say
          </h2>

          <div className="mt-10 border-t border-white/[0.08] pt-8">
            <p className="font-display text-7xl font-black leading-none tracking-[-0.04em] text-white">
              {site.rating.value}
              <span className="text-3xl text-zinc-500"> / 5</span>
            </p>
            <Stars rating={site.rating.value} size={22} className="mt-4" />
            <p className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
              <GoogleIcon size={16} />
              Based on <strong className="font-semibold text-white">{site.rating.count} Google reviews</strong>
            </p>
          </div>

          <ButtonLink
            href={site.maps.reviews}
            variant="outline"
            className="mt-10 self-start"
            icon={<ArrowUpRight size={16} />}
          >
            Read More Reviews
          </ButtonLink>
        </Reveal>

        {/* Review excerpts, swipeable on mobile */}
        <div className="min-w-0">
          <ul
            ref={trackRef}
            onScroll={onScroll}
            className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-4 lg:overflow-visible lg:px-0"
          >
            {testimonials.map((t, i) => (
              <Reveal
                as="li"
                key={t.author}
                delay={i * 90}
                className={`w-[85%] shrink-0 snap-center sm:w-[60%] lg:w-auto ${i === 0 ? "lg:col-span-2" : ""}`}
              >
                <figure className="flex h-full flex-col justify-between border border-white/[0.07] bg-ink-850 p-7 md:p-9">
                  <div>
                    <Quote size={30} className="text-brand" fill="currentColor" strokeWidth={0} aria-hidden />
                    {t.rating && <Stars rating={t.rating} size={14} className="mt-5" />}
                    <blockquote
                      className={`mt-5 font-display font-bold leading-snug tracking-tight text-white ${
                        i === 0 ? "text-2xl md:text-3xl" : "text-xl"
                      }`}
                    >
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                  </div>
                  <figcaption className="mt-8 flex items-center justify-between gap-4 border-t border-white/[0.07] pt-5">
                    <span className="font-semibold text-zinc-200">{t.author}</span>
                    <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <GoogleIcon size={14} /> Google review
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>

          {/* Mobile pager */}
          <div className="mt-6 flex justify-center gap-2 lg:hidden">
            {testimonials.map((t, i) => (
              <button
                key={t.author}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Show review ${i + 1}`}
                aria-current={current === i}
                className="flex h-8 items-center"
              >
                <span
                  className={`block h-[3px] transition-all duration-300 ${
                    current === i ? "w-8 bg-brand" : "w-4 bg-white/20"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
