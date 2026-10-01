import type { Metadata } from "next";
import { requireRole } from "@/lib/api/server";
import { InquiriesBoard } from "./InquiriesBoard";

export const metadata: Metadata = { title: "Inquiries" };

export default async function InquiriesPage() {
  await requireRole("ADMIN", "STAFF");
  return <InquiriesBoard />;
}
