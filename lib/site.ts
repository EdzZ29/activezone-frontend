/**
 * Business details for ActiveZone Butuan Fitness Studio.
 * Edit this file to update contact info, hours, ratings and links across the whole site.
 */

const mapQuery =
  "ActiveZone Butuan Fitness Studio, Ralav Building, G. Flores Ave, Butuan City, Agusan del Norte";

export const site = {
  name: "ActiveZone Butuan Fitness Studio",
  shortName: "ActiveZone",
  tagline: "Train Strong. Feel Strong. Be Active.",
  description:
    "ActiveZone Butuan Fitness Studio — a clean, welcoming, and well-equipped fitness studio in Butuan City. Explore memberships, classes, facilities, and start your fitness journey today.",
  // Set NEXT_PUBLIC_SITE_URL to the live domain once it is known (used for SEO/Open Graph URLs).
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  phone: {
    display: "0954 237 2496",
    href: "tel:09542372496",
    sms: "sms:09542372496",
    international: "+63 954 237 2496",
  },

  address: {
    floor: "2nd Floor, Ralav Building",
    street: "G. Flores Ave",
    city: "Butuan City",
    province: "Agusan del Norte",
    postalCode: "8600",
    country: "PH",
    short: "G. Flores Ave, Butuan City",
    full: "2nd Floor, Ralav Building, G. Flores Ave, Butuan City, Agusan del Norte 8600",
  },

  hours: {
    closesAt: "10:00 PM",
    closesShort: "10 PM",
    label: "Open until 10 PM",
  },

  rating: {
    value: 4.9,
    count: 159,
    source: "Google",
  },

  maps: {
    directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`,
    reviews: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`,
    embed: `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=17&output=embed`,
  },

  // Placeholder links — replace "#" with ActiveZone's real profile URLs.
  social: {
    facebook: "#",
    instagram: "#",
    tiktok: "#",
  },
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Membership", href: "/membership" },
  { label: "Classes", href: "/classes" },
  { label: "Trainers", href: "/trainers" },
  { label: "Facilities", href: "/facilities" },
  { label: "Contact", href: "/contact" },
] as const;

/** Primary "Join" destination used by every Join CTA. */
export const joinHref = "/contact?inquiry=membership#inquiry";
