import "server-only";
import { plans as fallbackPlans, type Plan as ContentPlan } from "@/lib/content";
import { backendUrl } from "./server";
import type { Plan } from "./types";

/**
 * Website membership cards: layout and copy come from lib/content.ts, prices from
 * the admin dashboard (Plans & Prices) when the API is reachable. Refreshed every 5 minutes.
 * Plans are matched by name; anything without a confirmed price keeps the "XXX" placeholder.
 */
export async function getWebsitePlans(): Promise<ContentPlan[]> {
  const base = backendUrl();
  if (!base) return fallbackPlans;

  try {
    const res = await fetch(`${base}/api/plans`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return fallbackPlans;
    const live = (await res.json()) as Plan[];
    const byName = new Map(live.map((p) => [p.name.toLowerCase(), p]));

    return fallbackPlans.map((plan) => {
      const match = byName.get(plan.name.toLowerCase());
      if (!match) return plan;
      return {
        ...plan,
        price: match.priceCents === null ? plan.price : (match.priceCents / 100).toLocaleString("en-PH"),
        features: match.features.length ? match.features : plan.features,
        summary: match.description ?? plan.summary,
      };
    });
  } catch {
    return fallbackPlans;
  }
}
