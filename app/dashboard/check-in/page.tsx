import type { Metadata } from "next";
import { requireRole } from "@/lib/api/server";
import { CheckInDesk } from "./CheckInDesk";

export const metadata: Metadata = { title: "Check-in" };

export default async function CheckInPage() {
  await requireRole("ADMIN", "STAFF");
  return <CheckInDesk />;
}
