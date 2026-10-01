"use client";

import Image from "next/image";
import { useState } from "react";
import { Expand } from "lucide-react";
import { gallery, type GalleryImage } from "@/lib/content";
import { Lightbox } from "./Lightbox";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

const tileLayout: Record<GalleryImage["layout"], string> = {
  tall: "row-span-2",
  wide: "col-span-2",
  square: "",
};

export function Facilities() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="facilities" aria-label="Facilities" className="bg-ink-950 py-24 md:py-32">
      <div className="shell">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Facilities"
            title={["Built for", "your workout"]}
            description="Strength, cardio and open floor space under one roof. Tap any photo to take a closer look."
          />
        </div>

        <ul className="mt-14 grid grid-flow-dense auto-rows-[200px] grid-cols-2 gap-2 sm:auto-rows-[240px] md:grid-cols-4 md:gap-3 lg:auto-rows-[270px]">
          {gallery.map((item, i) => (
            <Reveal
              as="li"
              key={item.src}
              delay={(i % 4) * 70}
              className={tileLayout[item.layout]}
            >
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View ${item.category} photo: ${item.alt}`}
                className="group relative block h-full w-full overflow-hidden bg-ink-800 text-left"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes={item.layout === "wide" ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                  className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.06]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute right-3 top-3 flex size-9 items-center justify-center bg-black/50 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                  <Expand size={16} aria-hidden />
                </span>
                <span className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-4 md:p-5">
                  <span aria-hidden className="h-[2px] w-4 bg-brand transition-all duration-300 group-hover:w-8" />
                  <span className="font-display text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white md:text-xs">
                    {item.category}
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>

      {active !== null && (
        <Lightbox
          images={gallery}
          index={active}
          onClose={() => setActive(null)}
          onIndexChange={setActive}
        />
      )}
    </section>
  );
}
