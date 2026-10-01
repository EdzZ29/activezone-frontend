import type { Metadata, Viewport } from "next";
import { Open_Sans } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

// Open Sans for all text (variable font, weights 300–800).
const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

const title = "ActiveZone Butuan Fitness Studio | Gym in Butuan City";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: "%s | ActiveZone Butuan Fitness Studio",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "gym Butuan City",
    "fitness studio Butuan",
    "ActiveZone Butuan",
    "gym membership Butuan",
    "Zumba Butuan",
    "personal training Butuan",
    "G. Flores Ave gym",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
  },
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${openSans.variable} antialiased`}>
      <body className="min-h-full bg-ink-950 font-sans text-zinc-100">
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
