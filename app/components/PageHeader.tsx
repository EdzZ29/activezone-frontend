import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Eyebrow } from "./ui/SectionHeading";

type PageHeaderProps = {
  eyebrow: string;
  title: string[];
  description: string;
  image: string;
  imageAlt: string;
};

/** Compact hero used at the top of inner pages. */
export function PageHeader({ eyebrow, title, description, image, imageAlt }: PageHeaderProps) {
  return (
    <section className="relative isolate flex min-h-[64svh] items-end overflow-hidden bg-ink-950 md:min-h-[70svh]">
      <Image src={image} alt={imageAlt} fill preload sizes="100vw" className="animate-hero-zoom -z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/75 to-ink-950/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950 via-ink-950/20 to-ink-950/50" />

      <div className="shell pb-16 pt-36 md:pb-20">
        <nav aria-label="Breadcrumb" className="animate-rise mb-8">
          <ol className="flex items-center gap-2 text-xs font-medium text-zinc-400">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight size={12} />
            </li>
            <li aria-current="page" className="text-zinc-200">
              {eyebrow}
            </li>
          </ol>
        </nav>
        <div className="animate-rise" style={{ animationDelay: "100ms" }}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <h1
          className="animate-rise mt-5 max-w-4xl font-display text-[clamp(2.6rem,7.5vw,6rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-white"
          style={{ animationDelay: "180ms" }}
        >
          {title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p
          className="animate-rise mt-6 max-w-xl text-base leading-relaxed text-zinc-300 md:text-lg"
          style={{ animationDelay: "280ms" }}
        >
          {description}
        </p>
      </div>
    </section>
  );
}
