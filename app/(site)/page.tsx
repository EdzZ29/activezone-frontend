import { About } from "@/app/components/About";
import { Classes } from "@/app/components/Classes";
import { Contact } from "@/app/components/Contact";
import { CTA } from "@/app/components/CTA";
import { Experience } from "@/app/components/Experience";
import { Facilities } from "@/app/components/Facilities";
import { Hero } from "@/app/components/Hero";
import { Location } from "@/app/components/Location";
import { MembershipPlans } from "@/app/components/MembershipPlans";
import { Stats } from "@/app/components/Stats";
import { Testimonials } from "@/app/components/Testimonials";
import { Trainers } from "@/app/components/Trainers";
import { WhyActiveZone } from "@/app/components/WhyActiveZone";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <WhyActiveZone />
      <Facilities />
      <MembershipPlans />
      <Classes />
      <Trainers />
      <Experience />
      <Testimonials />
      <Location />
      <Contact />
      <CTA />
    </>
  );
}
