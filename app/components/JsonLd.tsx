import { site } from "@/lib/site";

/** LocalBusiness (ExerciseGym) structured data for search engines. */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ExerciseGym",
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phone.international,
    image: `${site.url}/brand/activezone-logo.png`,
    logo: `${site.url}/brand/activezone-logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.floor}, ${site.address.street}`,
      addressLocality: site.address.city,
      addressRegion: site.address.province,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    hasMap: site.maps.reviews,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.rating.value,
      reviewCount: site.rating.count,
      bestRating: 5,
    },
    sameAs: Object.values(site.social).filter((url) => url.startsWith("http")),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
