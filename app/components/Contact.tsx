import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { ContactForm } from "./ContactForm";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

const details = [
  { icon: Phone, label: "Call or text", value: site.phone.display, href: site.phone.href },
  { icon: MapPin, label: "Visit us", value: site.address.full, href: site.maps.directions },
  { icon: Clock, label: "Hours", value: site.hours.label },
];

export function Contact() {
  return (
    <section id="contact" aria-label="Contact" className="bg-ink-950 py-24 md:py-32">
      <div className="shell grid grid-cols-1 gap-14 lg:grid-cols-[0.85fr_1.25fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title={["Ready to", "start?"]}
            description="Ask about memberships, day passes, personal training or classes. The fastest way to reach us is a call or text."
          />

          <Reveal delay={100}>
            <ul className="mt-12 divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {details.map(({ icon: Icon, label, value, href }) => {
                const body = (
                  <>
                    <span className="flex size-11 shrink-0 items-center justify-center bg-ink-850 text-brand">
                      <Icon size={20} aria-hidden />
                    </span>
                    <span>
                      <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                        {label}
                      </span>
                      <span className="mt-1 block font-semibold leading-snug text-white">{value}</span>
                    </span>
                  </>
                );
                return (
                  <li key={label}>
                    {href ? (
                      <a
                        href={href}
                        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="group flex items-center gap-4 py-5 transition-colors hover:text-brand"
                      >
                        {body}
                        <Navigation
                          size={16}
                          aria-hidden
                          className="ml-auto shrink-0 rotate-45 text-zinc-600 transition-colors group-hover:text-brand"
                        />
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 py-5">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <div id="inquiry" className="scroll-mt-28">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
