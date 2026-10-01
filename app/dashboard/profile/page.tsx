import type { Metadata } from "next";
import { requireRole } from "@/lib/api/server";
import { ProfileForms } from "./ProfileForms";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  await requireRole("ADMIN", "STAFF", "MEMBER", "CUSTOMER");
  return <ProfileForms />;
}
