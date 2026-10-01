import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  /** Each entry renders on its own line. */
  title: string[];
  description?: ReactNode;
  align?: "left" | "center";
  /** "md" suits headings that share a row with other content. */
  size?: "lg" | "md";
  className?: string;
};

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`flex items-center gap-3 font-display text-[0.72rem] font-bold uppercase tracking-[0.28em] text-brand ${className}`}
    >
      <span aria-hidden className="h-[2px] w-7 -skew-x-[30deg] bg-brand" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  size = "lg",
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <Reveal
      className={`${centered ? "mx-auto text-center" : ""} max-w-3xl ${className}`}
    >
      <Eyebrow className={centered ? "justify-center" : ""}>{eyebrow}</Eyebrow>
      <h2
        className={`mt-5 text-balance font-display font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-white ${
          size === "lg" ? "text-[clamp(2.1rem,5.2vw,4rem)]" : "text-[clamp(2rem,3.7vw,3.25rem)]"
        }`}
      >
        {title.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>
      {description && (
        <p
          className={`mt-6 max-w-xl text-base leading-relaxed text-zinc-400 md:text-lg ${centered ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
