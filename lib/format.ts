/** Display helpers. All dates are shown in Philippine time regardless of the viewer's device. */

const TZ = "Asia/Manila";

const pesoFormatter = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });

export function peso(cents: number | null | undefined, fallback = "Rate TBA") {
  return cents === null || cents === undefined ? fallback : pesoFormatter.format(cents / 100);
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }) {
  return new Intl.DateTimeFormat("en-PH", { timeZone: TZ, ...opts }).format(new Date(iso));
}

export function formatTime(iso: string) {
  return new Intl.DateTimeFormat("en-PH", { timeZone: TZ, hour: "numeric", minute: "2-digit" }).format(new Date(iso));
}

export function formatDateTime(iso: string) {
  return `${formatDate(iso, { month: "short", day: "numeric" })}, ${formatTime(iso)}`;
}

export function formatWeekday(iso: string) {
  return formatDate(iso, { weekday: "long", month: "short", day: "numeric" });
}

/** "YYYY-MM-DD" for the Manila calendar day of a date. */
export function manilaDateKey(date: Date | string = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date(date));
}

/** Combine a date input ("2026-10-01") and time input ("18:30") entered in Manila time. */
export function manilaDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00+08:00`).toISOString();
}

export function daysUntil(iso: string) {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000));
}

export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return formatDate(iso);
}

export function fullName(p: { firstName: string; lastName: string }) {
  return `${p.firstName} ${p.lastName}`.trim();
}

export function initials(p: { firstName: string; lastName: string }) {
  return `${p.firstName[0] ?? ""}${p.lastName[0] ?? ""}`.toUpperCase();
}

export const roleLabels = {
  ADMIN: "Admin",
  STAFF: "Staff",
  MEMBER: "Member",
  CUSTOMER: "Customer",
} as const;

export const paymentMethodLabels = {
  CASH: "Cash",
  GCASH: "GCash",
  CARD: "Card",
  BANK: "Bank transfer",
  OTHER: "Other",
} as const;

export const inquiryTypeLabels = {
  membership: "Membership",
  "daily-pass": "Daily Pass",
  "personal-training": "Personal Training",
  classes: "Classes",
  general: "General Inquiry",
  cancellation: "Cancellation request",
} as const;
