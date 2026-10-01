import type { Metadata } from "next";
import { images } from "@/lib/content";
import { CTA } from "../components/CTA";
import { MembershipPlans } from "../components/MembershipPlans";
import { PageHeader } from "../components/PageHeader";
import { Testimonials } from "../components/Testimonials";
import { WhyActiveZone } from "../components/WhyActiveZone";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "Daily passes and memberships at ActiveZone Butuan Fitness Studio. Contact us for the latest rates and inclusions.",
  alternates: { canonical: "/membership" },
};

export default function MembershipPage() {
  return (
    <>
      <PageHeader
        eyebrow="Membership"
        title={["Train on", "your terms."]}
        description="Drop in for a day or make ActiveZone part of your routine. Pick the option that fits your schedule."
        image={images.pages.membership}
        imageAlt="Loaded barbell resting on the gym floor"
      />
      <MembershipPlans />
      <WhyActiveZone />
      <Testimonials />
      <CTA />
    </>
  );
}
