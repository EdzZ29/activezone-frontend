"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/lib/content";

type LightboxProps = {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export function Lightbox({ images, index, onClose, onIndexChange }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const image = images[index];
  const count = images.length;

  const go = (step: number) => onIndexChange((index + step + count) % count);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndexChange((index + 1) % count);
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, count, onClose, onIndexChange]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${image.category} — image ${index + 1} of ${count}`}
      className="fixed inset-0 z-[60] flex flex-col bg-black/95 backdrop-blur-sm"
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-4 py-4 md:px-8" onClick={(e) => e.stopPropagation()}>
        <p className="font-display text-xs font-bold uppercase tracking-[0.24em] text-zinc-400">
          <span className="text-brand">{String(index + 1).padStart(2, "0")}</span> / {String(count).padStart(2, "0")}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="flex size-12 items-center justify-center text-white transition-colors hover:text-brand"
        >
          <X size={26} />
        </button>
      </div>

      <div className="relative flex-1">
        <div className="absolute inset-4 md:inset-x-24 md:inset-y-2" onClick={(e) => e.stopPropagation()}>
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            fill
            sizes="100vw"
            className="animate-rise object-contain"
          />
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className="absolute left-2 top-1/2 hidden size-14 -translate-y-1/2 items-center justify-center border border-white/15 bg-black/50 text-white transition-colors hover:border-brand hover:text-brand md:flex"
            >
              <ChevronLeft size={26} />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className="absolute right-2 top-1/2 hidden size-14 -translate-y-1/2 items-center justify-center border border-white/15 bg-black/50 text-white transition-colors hover:border-brand hover:text-brand md:flex"
            >
              <ChevronRight size={26} />
            </button>
          </>
        )}
      </div>

      <div className="px-4 py-6 text-center md:px-8" onClick={(e) => e.stopPropagation()}>
        <p className="font-display text-sm font-extrabold uppercase tracking-[0.18em] text-white">
          {image.category}
        </p>
        <p className="mt-1 text-sm text-zinc-400">{image.alt}</p>
        <p className="mt-3 text-xs text-zinc-600 md:hidden">Swipe to browse</p>
      </div>
    </div>
  );
}
