import type { Metadata } from "next";
import { requireRole } from "@/lib/api/server";
import { PaymentsLedger } from "./PaymentsLedger";

export const metadata: Metadata = { title: "Payments" };

export default async function PaymentsPage() {
  await requireRole("ADMIN");
  return <PaymentsLedger />;
}
