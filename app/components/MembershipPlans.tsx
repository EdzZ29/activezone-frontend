import { ArrowRight, Check, Info } from "lucide-react";
import { membershipNote, plans } from "@/lib/content";
import { site } from "@/lib/site";
import { ButtonLink } from "./ui/Button";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function MembershipPlans() {
  return (
    <section id="membership" aria-label="Membership plans" className="bg-ink-900 py-24 md:py-32">
      <div className="shell">
        <SectionHeading
          align="center"
          eyebrow="Membership"
          title={["Find your", "membership"]}
          description="Simple options whether you're dropping in for a session or committing to a routine."
        />

        <div className="mx-auto mt-16 grid max-w-6xl gap-4 md:grid-cols-3 md:gap-0">
          {plans.map((plan, i) => (
            <Reveal
              key={plan.id}
              delay={i * 100}
              className={`relative flex flex-col p-8 md:p-10 ${
                plan.featured
                  ? "z-10 bg-white text-ink-950 md:-my-6 md:py-16"
                  : "border border-white/[0.08] bg-ink-850 text-white md:border-x-0 first:md:border-l last:md:border-r"
              }`}
            >
              {plan.featured && (
                <span className="absolute right-0 top-0 bg-brand px-3 py-1.5 font-display text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-ink-950">
                  Recommended
                </span>
              )}

              <h3 className="font-display text-sm font-extrabold uppercase tracking-[0.22em]">
                {plan.name}
              </h3>
              <p className={`mt-2 text-sm ${plan.featured ? "text-zinc-600" : "text-zinc-400"}`}>
                {plan.summary}
              </p>

              <p className="mt-8 flex items-baseline gap-2">
                <span className="font-display text-[3.4rem] font-black leading-none tracking-[-0.04em]">
                  ₱{plan.price}
                </span>
                <span className="text-sm text-zinc-500">
                  / {plan.period}
                </span>
              </p>

              <ul
                className={`mt-8 flex-1 space-y-3.5 border-t pt-8 text-[0.95rem] ${
                  plan.featured ? "border-ink-950/10" : "border-white/[0.08]"
                }`}
              >
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      size={18}
                      strokeWidth={2.5}
                      aria-hidden
                      className={`mt-0.5 shrink-0 ${plan.featured ? "text-ink-950" : "text-brand"}`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <ButtonLink
                href={`/contact?inquiry=${plan.inquiry}#inquiry`}
                variant={plan.featured ? "dark" : "outline"}
                size="lg"
                className="mt-10 w-full"
                icon={<ArrowRight size={16} />}
              >
                {plan.cta}
              </ButtonLink>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-14 flex max-w-2xl flex-col items-center gap-3 text-center text-sm text-zinc-400 sm:flex-row sm:text-left">
          <Info size={18} className="shrink-0 text-brand" aria-hidden />
          <p>
            {membershipNote}{" "}
            <a href={site.phone.href} className="font-semibold text-white underline-offset-4 hover:underline">
              Call {site.phone.display}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
