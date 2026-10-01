# ActiveZone Butuan Fitness Studio — Website

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Lucide icons

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Editing content

| What | Where |
| --- | --- |
| Address, phone, hours, rating, map links, social links | `lib/site.ts` |
| Membership prices (`price: "XXX"`) and inclusions | `lib/content.ts` → `plans` |
| Classes, schedules, coaches per class | `lib/content.ts` → `classes` |
| Coach profiles | `lib/content.ts` → `trainers` |
| Gallery, page photos | `lib/content.ts` → `gallery`, `images` |
| Reviews | `lib/content.ts` → `testimonials` |
| Brand colours / fonts | `app/globals.css` (`@theme`), `app/layout.tsx` |

Set `NEXT_PUBLIC_SITE_URL` to the live domain for correct canonical, sitemap and Open Graph URLs.

## Before launch

- **Photos** are Unsplash stock placeholders. Add ActiveZone's own photos to `public/photos/` and point the entries in `lib/content.ts` at them (e.g. `"/photos/free-weights.jpg"`).
- **Prices, class schedules, coach names and social URLs** are placeholders until confirmed.
- **Inquiry form** has no backend: it validates and then offers to send the inquiry by SMS or call. Hook it up in `app/components/ContactForm.tsx` (`onSubmit`) once an API is available.
