import type { Metadata } from "next";
import { images } from "@/lib/content";
import { CTA } from "../components/CTA";
import { PageHeader } from "../components/PageHeader";
import { Testimonials } from "../components/Testimonials";
import { Trainers } from "../components/Trainers";

export const metadata: Metadata = {
  title: "Coaches",
  description:
    "Meet the coaches at ActiveZone Butuan Fitness Studio and ask about personal training in Butuan City.",
  alternates: { canonical: "/trainers" },
};

export default function TrainersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Trainers"
        title={["Coached with", "purpose."]}
        description="Approachable, supportive coaches who help you train safely and stay consistent."
        image={images.pages.trainers}
        imageAlt="Close-up of a hand gripping a barbell"
      />
      <Trainers />
      <Testimonials />
      <CTA />
    </>
  );
}
