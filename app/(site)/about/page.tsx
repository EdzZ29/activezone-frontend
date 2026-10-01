import type { Metadata } from "next";
import { images } from "@/lib/content";
import { About } from "@/app/components/About";
import { CTA } from "@/app/components/CTA";
import { Experience } from "@/app/components/Experience";
import { PageHeader } from "@/app/components/PageHeader";
import { Stats } from "@/app/components/Stats";
import { Testimonials } from "@/app/components/Testimonials";
import { WhyActiveZone } from "@/app/components/WhyActiveZone";

export const metadata: Metadata = {
  title: "About",
  description:
    "Get to know ActiveZone Butuan Fitness Studio, a clean, beginner-friendly gym with welcoming staff on G. Flores Ave, Butuan City.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={["More than", "a gym."]}
        description="A modern fitness studio in Butuan City built around clean spaces, good equipment and people who make you feel welcome."
        image={images.pages.about}
        imageAlt="Spacious gym floor with benches and strength equipment"
      />
      <Stats />
      <About showLink={false} />
      <WhyActiveZone />
      <Experience />
      <Testimonials />
      <CTA />
    </>
  );
}
