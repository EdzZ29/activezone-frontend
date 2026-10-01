"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { joinHref, navLinks, site } from "@/lib/site";
import { Logo } from "./Logo";
import { ButtonLink } from "./ui/Button";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll and allow Esc to close while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const solid = scrolled || open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          solid
            ? "border-b border-white/[0.06] bg-ink-950/90 backdrop-blur-xl"
            : "border-b border-transparent bg-gradient-to-b from-black/60 to-transparent"
        }`}
      >
        <nav
          aria-label="Main"
          className={`shell flex items-center justify-between transition-[height] duration-300 ${
            scrolled ? "h-16" : "h-20 md:h-24"
          }`}
        >
          <Logo compact={scrolled} />

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative px-3 py-2 font-display text-[0.74rem] font-semibold uppercase tracking-[0.14em] transition-colors xl:px-4 ${
                      active ? "text-white" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {link.label}
                    <span
                      aria-hidden
                      className={`absolute inset-x-3 -bottom-0.5 h-[2px] origin-left bg-brand transition-transform duration-300 xl:inset-x-4 ${
                        active ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ButtonLink href={joinHref}>Join Now</ButtonLink>
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative -mr-2 flex size-12 items-center justify-center lg:hidden"
            >
              <span className="relative block h-3.5 w-6">
                <span
                  className={`absolute left-0 h-[2px] w-6 bg-white transition-all duration-300 ${
                    open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute right-0 top-1/2 h-[2px] -translate-y-1/2 bg-brand transition-all duration-300 ${
                    open ? "w-0 opacity-0" : "w-4"
                  }`}
                />
                <span
                  className={`absolute left-0 h-[2px] w-6 bg-white transition-all duration-300 ${
                    open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu — kept outside the header: its backdrop-filter would trap fixed children */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-ink-950 transition-[opacity,visibility] duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        style={{ top: scrolled ? "4rem" : "5rem" }}
        inert={!open}
      >
        <div className="shell flex min-h-full flex-col pb-10 pt-6">
          <ul className="flex flex-col">
            {navLinks.map((link, i) => {
              const active = isActive(link.href);
              return (
                <li
                  key={link.href}
                  className={`border-b border-white/[0.07] transition-[opacity,transform] duration-500 ease-out-expo ${
                    open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                  style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between py-4 font-display text-2xl font-extrabold uppercase tracking-tight ${
                      active ? "text-brand" : "text-white"
                    }`}
                  >
                    {link.label}
                    <ArrowRight size={20} className={active ? "text-brand" : "text-zinc-600"} />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div
            className={`mt-auto space-y-3 pt-10 transition-opacity delay-300 duration-500 ${
              open ? "opacity-100" : "opacity-0"
            }`}
          >
            <ButtonLink
              href={joinHref}
              size="lg"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Join ActiveZone
            </ButtonLink>
            <ButtonLink
              href={site.phone.href}
              variant="outline"
              size="lg"
              className="w-full"
              icon={<Phone size={16} />}
            >
              Call {site.phone.display}
            </ButtonLink>
            <p className="flex items-center justify-center gap-2 pt-2 text-sm text-zinc-500">
              <MapPin size={14} className="text-brand" />
              {site.address.short} · {site.hours.label}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
