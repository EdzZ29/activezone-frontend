import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { ButtonLink } from "./ui/Button";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function Location() {
  return (
    <section id="location" aria-label="Location" className="bg-ink-950 py-24 md:py-32">
      <div className="shell">
        <SectionHeading eyebrow="Location" title={["Find", "ActiveZone"]} />

        <div className="mt-14 grid grid-cols-1 overflow-hidden border border-white/[0.07] lg:grid-cols-[1fr_1.6fr]">
          <Reveal className="order-2 flex flex-col bg-ink-900 p-8 md:p-12 lg:order-1">
            <dl className="space-y-8">
              <div className="flex gap-4">
                <MapPin size={22} className="mt-0.5 shrink-0 text-brand" aria-hidden />
                <div>
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">Address</dt>
                  <dd className="mt-1.5 text-lg font-semibold leading-snug text-white">
                    <address className="not-italic">{site.address.full}</address>
                  </dd>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone size={22} className="mt-0.5 shrink-0 text-brand" aria-hidden />
                <div>
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">Phone</dt>
                  <dd className="mt-1.5 text-lg font-semibold text-white">
                    <a href={site.phone.href} className="hover:text-brand">
                      {site.phone.display}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock size={22} className="mt-0.5 shrink-0 text-brand" aria-hidden />
                <div>
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">Hours</dt>
                  <dd className="mt-1.5 text-lg font-semibold text-white">Open until {site.hours.closesAt}</dd>
                </div>
              </div>
            </dl>

            <div className="mt-12 flex flex-col gap-3 sm:flex-row lg:mt-auto lg:flex-col lg:pt-12">
              <ButtonLink href={site.maps.directions} size="lg" className="flex-1" icon={<Navigation size={16} />}>
                Get Directions
              </ButtonLink>
              <ButtonLink href={site.phone.href} variant="outline" size="lg" className="flex-1" icon={<Phone size={16} />}>
                Call ActiveZone
              </ButtonLink>
            </div>
          </Reveal>

          <div className="relative order-1 min-h-[340px] bg-ink-800 md:min-h-[460px] lg:order-2">
            <iframe
              title="Map showing ActiveZone Butuan Fitness Studio on G. Flores Ave, Butuan City"
              src={site.maps.embed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_invert(0.92)_contrast(0.9)_brightness(0.95)]"
              allowFullScreen
            />
            <a
              href={site.maps.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-4 flex items-center gap-2 bg-ink-950/90 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:text-brand"
            >
              <MapPin size={16} className="text-brand" aria-hidden />
              {site.address.floor}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
