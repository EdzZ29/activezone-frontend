import {
  CalendarDays,
  CreditCard,
  Dumbbell,
  Inbox,
  LayoutDashboard,
  QrCode,
  ScanLine,
  ShieldCheck,
  Tags,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/lib/api/types";

export type NavItem = { label: string; href: string; icon: LucideIcon };

/** Dashboard navigation per role. Pages enforce the same rules server-side via requireRole(). */
export const dashboardNav: Record<Role, NavItem[]> = {
  ADMIN: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Check-in", href: "/dashboard/check-in", icon: ScanLine },
    { label: "Clients", href: "/dashboard/clients", icon: Users },
    { label: "Classes", href: "/dashboard/classes", icon: CalendarDays },
    { label: "Inquiries", href: "/dashboard/inquiries", icon: Inbox },
    { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
    { label: "Plans & Prices", href: "/dashboard/plans", icon: Tags },
    { label: "Team", href: "/dashboard/team", icon: ShieldCheck },
    { label: "Profile", href: "/dashboard/profile", icon: UserRound },
  ],
  STAFF: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Check-in", href: "/dashboard/check-in", icon: ScanLine },
    { label: "Clients", href: "/dashboard/clients", icon: Users },
    { label: "Classes", href: "/dashboard/classes", icon: CalendarDays },
    { label: "Inquiries", href: "/dashboard/inquiries", icon: Inbox },
    { label: "Profile", href: "/dashboard/profile", icon: UserRound },
  ],
  MEMBER: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My QR pass", href: "/dashboard/pass", icon: QrCode },
    { label: "Membership", href: "/dashboard/membership", icon: Dumbbell },
    { label: "Classes", href: "/dashboard/classes", icon: CalendarDays },
    { label: "Profile", href: "/dashboard/profile", icon: UserRound },
  ],
  CUSTOMER: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My QR pass", href: "/dashboard/pass", icon: QrCode },
    { label: "Memberships", href: "/dashboard/membership", icon: Dumbbell },
    { label: "Classes", href: "/dashboard/classes", icon: CalendarDays },
    { label: "Profile", href: "/dashboard/profile", icon: UserRound },
  ],
};
