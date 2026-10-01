import type { Metadata } from "next";
import { images } from "@/lib/content";
import { Contact } from "@/app/components/Contact";
import { Location } from "@/app/components/Location";
import { PageHeader } from "@/app/components/PageHeader";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact ActiveZone Butuan Fitness Studio. Call 0954 237 2496 or visit us at the 2nd Floor, Ralav Building, G. Flores Ave, Butuan City.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={["Let's get", "you started."]}
        description="Questions about memberships, day passes, coaching or classes? Reach out and we'll help you get going."
        image={images.pages.contact}
        imageAlt="Squat rack in front of a window overlooking the city"
      />
      <Contact />
      <Location />
    </>
  );
}
