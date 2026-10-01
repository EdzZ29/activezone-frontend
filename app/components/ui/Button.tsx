import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost" | "dark";
type Size = "md" | "lg";

const base =
  "group/btn inline-flex items-center justify-center gap-2.5 whitespace-nowrap font-display font-bold uppercase tracking-[0.08em] transition-[background-color,color,border-color,transform] duration-200 ease-out active:scale-[0.98] select-none";

const variants: Record<Variant, string> = {
  primary: "clip-corner bg-brand text-ink-950 hover:bg-white",
  dark: "clip-corner bg-ink-950 text-white hover:bg-ink-800",
  outline:
    "border border-white/25 text-white hover:border-brand hover:text-brand backdrop-blur-sm",
  ghost: "text-white hover:text-brand",
};

const sizes: Record<Size, string> = {
  md: "min-h-12 px-6 text-[0.78rem]",
  lg: "min-h-14 px-8 text-[0.82rem]",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${base} ${variants[variant]} ${variant === "ghost" ? "" : sizes[size]} ${extra}`;
}

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">;

/** Renders a Next.js <Link> for internal routes, and a plain <a> for tel:, sms:, mailto: and external URLs. */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  children,
  ...rest
}: ButtonLinkProps) {
  const classes = buttonClasses(variant, size, className);
  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <span className="transition-transform duration-200 group-hover/btn:translate-x-0.5">
          {icon}
        </span>
      )}
    </>
  );

  const isExternal = /^(https?:|tel:|sms:|mailto:)/.test(href);
  if (isExternal) {
    const opensTab = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        {...(opensTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}
