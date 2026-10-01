import type { Metadata } from "next";
import { requireRole } from "@/lib/api/server";
import { MyMembership } from "./MyMembership";

export const metadata: Metadata = { title: "Membership" };

export default async function MembershipPage() {
  await requireRole("MEMBER", "CUSTOMER");
  return <MyMembership />;
}
