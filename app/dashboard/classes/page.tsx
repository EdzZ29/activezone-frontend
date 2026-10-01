import type { Metadata } from "next";
import { requireRole } from "@/lib/api/server";
import { ClassesSchedule } from "./ClassesSchedule";

export const metadata: Metadata = { title: "Classes" };

export default async function ClassesPage() {
  await requireRole("ADMIN", "STAFF", "MEMBER", "CUSTOMER");
  return <ClassesSchedule />;
}
