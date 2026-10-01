import { ClientOverview } from "@/app/components/dashboard/ClientOverview";
import { StaffOverview } from "@/app/components/dashboard/StaffOverview";
import { requireRole } from "@/lib/api/server";

export default async function DashboardHome() {
  const { user } = await requireRole("ADMIN", "STAFF", "MEMBER", "CUSTOMER");
  return user.role === "ADMIN" || user.role === "STAFF" ? <StaffOverview /> : <ClientOverview />;
}
