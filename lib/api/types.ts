/** Shapes returned by the ActiveZone API (activezone-backend). */

export type Role = "ADMIN" | "STAFF" | "MEMBER" | "CUSTOMER";
export type PaymentMethod = "CASH" | "GCASH" | "CARD" | "BANK" | "OTHER";
export type InquiryStatus = "NEW" | "CONTACTED" | "CLOSED";
export type InquiryType = "membership" | "daily-pass" | "personal-training" | "classes" | "general" | "cancellation";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: Role;
  status: "ACTIVE" | "DISABLED";
  /** True until someone given the default password picks their own. */
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ActiveAccess = {
  id: string;
  startsAt: string;
  endsAt: string;
  planId: string;
  planName: string;
  planKind: "PASS" | "MEMBERSHIP";
  includesClasses: boolean;
};

export type Session = {
  user: User;
  access: { membership: ActiveAccess | null; pass: ActiveAccess | null };
};

export type ClientRow = User & { accessEndsAt: string | null; planName: string | null };

export type Plan = {
  id: string;
  name: string;
  kind: "PASS" | "MEMBERSHIP";
  priceCents: number | null;
  durationDays: number;
  description: string | null;
  features: string[];
  includesClasses: boolean;
  isActive: boolean;
  sortOrder: number;
};

export type MembershipRecord = {
  id: string;
  userId: string;
  planId: string;
  startsAt: string;
  endsAt: string;
  status: "ACTIVE" | "CANCELLED";
  notes: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
  planName: string;
  planKind: "PASS" | "MEMBERSHIP";
};

export type Payment = {
  id: string;
  /** Negative for refunds. */
  amountCents: number;
  membershipId?: string | null;
  method: PaymentMethod;
  note: string | null;
  createdAt: string;
};

export type LedgerPayment = Payment & {
  isWalkIn: boolean;
  userId: string | null;
  firstName: string;
  lastName: string;
  recordedBy: string | null;
};

export type CheckIn = { id: string; checkedInAt: string; planName: string | null };

export type TodayCheckIn = {
  id: string;
  checkedInAt: string;
  isWalkIn: boolean;
  userId: string | null;
  firstName: string;
  lastName: string;
  role: Role | null;
  planName: string | null;
  planKind: "PASS" | "MEMBERSHIP" | null;
};

export type ClientDetail = {
  user: User;
  memberships: MembershipRecord[];
  payments: Payment[];
  checkIns: { id: string; checkedInAt: string }[];
};

export type GymClass = { id: string; name: string; description: string | null; isActive: boolean };

export type ClassSession = {
  id: string;
  classId: string;
  className: string;
  description: string | null;
  startsAt: string;
  endsAt: string;
  capacity: number;
  isCancelled: boolean;
  coachName: string | null;
  bookedCount: number;
  myBooking: boolean;
};

export type RosterEntry = {
  id: string;
  status: string;
  bookedAt: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string | null;
};

export type Inquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  type: InquiryType;
  message: string;
  status: InquiryStatus;
  notes: string | null;
  userId: string | null;
  createdAt: string;
};

export type MyInquiry = Pick<Inquiry, "id" | "type" | "message" | "status" | "createdAt">;

export type ExpiringMembership = {
  id: string;
  endsAt: string;
  planName: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  email: string;
};

export type Overview = {
  activeMembers: number;
  customers: number;
  checkInsToday: number;
  walkInsToday: number;
  newInquiries: number;
  expiringSoon: number;
  revenueTodayCents: number;
  revenueMonthCents: number | null;
  checkInsByDay: { day: string; visits: number }[];
};

export type WalkInRecord = {
  id: string;
  name: string;
  phone: string | null;
  planName: string;
  amountCents: number;
  method: PaymentMethod;
  note: string | null;
  createdAt: string;
};

export type MyPassCode = {
  code: string;
  refreshAt: string;
  checkedInAt: string | null;
  hasAccess: boolean;
};

export type CheckInResult = {
  checkIn: { id: string; checkedInAt: string };
  user: { id: string; firstName: string; lastName: string };
  access: ActiveAccess | null;
  soldDayPass: boolean;
  alreadyCheckedIn: boolean;
};
