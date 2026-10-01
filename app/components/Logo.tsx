import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  compact?: boolean;
  /** Tighter subtitle for narrow spaces like the dashboard sidebar. */
  tight?: boolean;
  className?: string;
};

export function Logo({ compact = false, tight = false, className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="ActiveZone Butuan Fitness Studio home"
      className={`group flex items-center gap-3 ${className}`}
    >
      <Image
        src="/brand/az-mark.png"
        alt=""
        width={624}
        height={403}
        preload
        className={`w-auto transition-[height] duration-300 ${compact ? "h-7" : "h-8 md:h-9"}`}
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.05rem] font-extrabold tracking-[0.06em] text-white md:text-lg">
          ACTIVEZONE
        </span>
        <span
          className={`mt-1 whitespace-nowrap font-display text-[0.55rem] font-semibold text-zinc-400 ${
            tight ? "tracking-[0.14em]" : "tracking-[0.3em] md:text-[0.6rem]"
          }`}
        >
          BUTUAN FITNESS STUDIO
        </span>
      </span>
    </Link>
  );
}
