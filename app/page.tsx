import { About } from "./components/About";
import { Classes } from "./components/Classes";
import { Contact } from "./components/Contact";
import { CTA } from "./components/CTA";
import { Experience } from "./components/Experience";
import { Facilities } from "./components/Facilities";
import { Hero } from "./components/Hero";
import { Location } from "./components/Location";
import { MembershipPlans } from "./components/MembershipPlans";
import { Stats } from "./components/Stats";
import { Testimonials } from "./components/Testimonials";
import { Trainers } from "./components/Trainers";
import { WhyActiveZone } from "./components/WhyActiveZone";

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
