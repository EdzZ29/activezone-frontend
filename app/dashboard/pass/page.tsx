import type { Metadata } from "next";
import { requireRole } from "@/lib/api/server";
import { MyPass } from "./MyPass";

export const metadata: Metadata = { title: "My QR pass" };

export default async function PassPage() {
  await requireRole("MEMBER", "CUSTOMER");
  return <MyPass />;
}
