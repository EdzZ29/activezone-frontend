import type { Metadata } from "next";
import { images } from "@/lib/content";
import { CTA } from "@/app/components/CTA";
import { Facilities } from "@/app/components/Facilities";
import { Location } from "@/app/components/Location";
import { PageHeader } from "@/app/components/PageHeader";
import { WhyActiveZone } from "@/app/components/WhyActiveZone";

export const metadata: Metadata = {
  title: "Facilities",
  description:
    "Take a look inside ActiveZone Butuan Fitness Studio: strength, cardio, free weights and group workout areas.",
  alternates: { canonical: "/facilities" },
};

export default function FacilitiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Facilities"
        title={["Built for", "your workout."]}
        description="A clean, organized space with a variety of machines, free weights and room to move."
        image={images.pages.facilities}
        imageAlt="Barbell and weight plates on a gym floor"
      />
      <Facilities />
      <WhyActiveZone />
      <Location />
      <CTA />
    </>
  );
}
