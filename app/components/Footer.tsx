import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import { navLinks, site } from "@/lib/site";
import { Logo } from "./Logo";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "./ui/Icons";

const socials = [
  { label: "Facebook", href: site.social.facebook, icon: FacebookIcon },
  { label: "Instagram", href: site.social.instagram, icon: InstagramIcon },
  { label: "TikTok", href: site.social.tiktok, icon: TikTokIcon },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-ink-950">
      <div className="shell grid grid-cols-1 gap-12 py-16 md:grid-cols-2 md:py-20 lg:grid-cols-[1.4fr_0.8fr_1.2fr_0.8fr]">
        <div>
          <Logo />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-zinc-400">
            {site.name} is a clean, welcoming fitness studio in the heart of Butuan City.
          </p>
          <p className="mt-6 font-display text-[0.7rem] font-bold uppercase tracking-[0.16em] text-brand">
            {site.tagline}
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-display text-[0.7rem] font-bold uppercase tracking-[0.24em] text-zinc-500">Explore</h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-zinc-300 transition-colors hover:text-brand">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-[0.7rem] font-bold uppercase tracking-[0.24em] text-zinc-500">Contact</h2>
          <ul className="mt-5 space-y-4 text-sm text-zinc-300">
            <li className="flex gap-3">
              <MapPin size={17} className="mt-0.5 shrink-0 text-brand" aria-hidden />
              <a
                href={site.maps.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="leading-relaxed hover:text-white"
              >
                {site.address.floor}, {site.address.street}, {site.address.city}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone size={17} className="mt-0.5 shrink-0 text-brand" aria-hidden />
              <a href={site.phone.href} className="hover:text-white">
                {site.phone.display}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock size={17} className="mt-0.5 shrink-0 text-brand" aria-hidden />
              <span className="font-semibold text-white">{site.hours.label}</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-[0.7rem] font-bold uppercase tracking-[0.24em] text-zinc-500">Follow</h2>
          <ul className="mt-5 flex gap-2">
            {socials.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={`ActiveZone on ${label}`}
                  {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex size-11 items-center justify-center border border-white/10 text-zinc-300 transition-colors hover:border-brand hover:text-brand"
                >
                  <Icon size={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="shell flex flex-col gap-2 py-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {site.name}. All rights reserved.</p>
          <p>{site.address.city}, {site.address.province}</p>
        </div>
      </div>
    </footer>
  );
}
