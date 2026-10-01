import type { Metadata } from "next";
import { images } from "@/lib/content";
import { Classes } from "../components/Classes";
import { CTA } from "../components/CTA";
import { Experience } from "../components/Experience";
import { PageHeader } from "../components/PageHeader";

export const metadata: Metadata = {
  title: "Group Classes",
  description:
    "Group fitness at ActiveZone Butuan Fitness Studio. Ask about Zumba, strength, cardio and functional training sessions.",
  alternates: { canonical: "/classes" },
};

export default function ClassesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Classes"
        title={["Move", "together."]}
        description="Group sessions that keep you motivated and accountable. Ask our team which classes are running this week."
        image={images.pages.classes}
        imageAlt="Group fitness class training together in a bright studio"
      />
      <Classes />
      <Experience />
      <CTA />
    </>
  );
}
