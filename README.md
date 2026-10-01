# ActiveZone Butuan Fitness Studio: Website & Dashboards

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Lucide icons

The public website plus login and dashboards for **Admin, Staff, Members and Customers**. Data and accounts come from
the API in [`../activezone-backend`](../activezone-backend).

```bash
cp .env.example .env.local   # BACKEND_URL=http://localhost:4000
npm install
npm run dev                  # http://localhost:3001  (start the backend first)
```

## How it fits together

- `/api/*` is proxied to `BACKEND_URL` (see `next.config.ts`), so the login cookie is first-party on this site.
- `/login`, `/register`: sign in / customer self-registration.
- `/dashboard`: one dashboard, with navigation and pages per role:
  - **Admin:** overview with revenue, check-in desk, clients, classes, inquiries, payments (CSV export), plans & prices, team
  - **Staff:** overview, check-in desk (members, day passes and walk-in guests), clients & memberships (assign, cancel with refund), classes, inquiries
  - **Member:** membership card & days left, visits, class booking, payments, cancellation requests, profile
  - **Customer:** plans and online membership requests, visits, profile
- Pages check the role on the server (`requireRole` in `lib/api/server.ts`); the API enforces the same rules.
- The website contact form saves inquiries to the dashboard. If the API is unreachable it offers to send by SMS instead.
- Membership prices set in **Plans & Prices** appear on the website's membership section (refreshed every 5 minutes).

## Editing website content

| What | Where |
| --- | --- |
| Address, phone, hours, rating, map links, social links | `lib/site.ts` |
| Membership card copy (prices come from the dashboard) | `lib/content.ts` → `plans` |
| Classes, coaches, gallery, page photos, reviews | `lib/content.ts` |
| Brand colours / fonts | `app/globals.css` (`@theme`), `app/layout.tsx` |

## Deploying on Vercel

Set these environment variables, then redeploy:

- `BACKEND_URL`: the deployed API, e.g. `https://activezone-api.onrender.com`
- `NEXT_PUBLIC_SITE_URL`: this site's URL, e.g. `https://activezone-liart.vercel.app`

Without `BACKEND_URL` the public site still works, but login, dashboards and online inquiries won't.

## Before launch

- **Photos** are Unsplash stock placeholders. Replace them with ActiveZone's own photos (`lib/content.ts`).
- **Prices**: set the real rates under Dashboard → Plans & Prices.
- **Coach names, class schedules and social URLs** are placeholders until confirmed.
