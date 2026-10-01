import { Footer } from "@/app/components/Footer";
import { JsonLd } from "@/app/components/JsonLd";
import { Navbar } from "@/app/components/Navbar";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <JsonLd />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
