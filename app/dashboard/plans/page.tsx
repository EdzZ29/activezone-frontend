import type { Metadata } from "next";
import { requireRole } from "@/lib/api/server";
import { PlansManager } from "./PlansManager";

export const metadata: Metadata = { title: "Plans & Prices" };

export default async function PlansPage() {
  await requireRole("ADMIN");
  return <PlansManager />;
}
