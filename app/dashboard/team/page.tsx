import type { Metadata } from "next";
import { requireRole } from "@/lib/api/server";
import { TeamList } from "./TeamList";

export const metadata: Metadata = { title: "Team" };

export default async function TeamPage() {
  await requireRole("ADMIN");
  return <TeamList />;
}
