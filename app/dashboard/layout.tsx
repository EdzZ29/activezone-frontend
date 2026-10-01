import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/app/components/dashboard/DashboardShell";
import { backendUrl, getSession } from "@/lib/api/server";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | ActiveZone Dashboard" },
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  if (!backendUrl()) {
    // Without BACKEND_URL there's no API to log in against.
    throw new Error("The dashboard isn't connected yet: set BACKEND_URL to the ActiveZone API address.");
  }
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard");

  return <DashboardShell session={session}>{children}</DashboardShell>;
}
