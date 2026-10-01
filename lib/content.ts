/**
 * Editable website content: memberships, classes, coaches, gallery and reviews.
 *
 * Anything marked "placeholder" is not confirmed ActiveZone information yet —
 * replace it with real details before launch.
 */
import {
  CalendarClock,
  Dumbbell,
  HeartHandshake,
  Sprout,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Photography                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Builds an Unsplash image URL. These are stock photos used as stand-ins —
 * swap them for ActiveZone's own photos (e.g. "/photos/weights-area.jpg") when available.
 */
function photo(id: string, opts: { w?: number; h?: number; faces?: boolean } = {}) {
  const { w = 1800, h, faces } = opts;
  const params = new URLSearchParams({ auto: "format", fit: "crop", w: String(w), q: "80" });
  if (h) params.set("h", String(h));
  if (faces) params.set("crop", "faces");
  return `https://images.unsplash.com/${id}?${params.toString()}`;
}

export const images = {
  hero: photo("photo-1534438327276-14e5300c3a48", { w: 2400 }),
  about: photo("photo-1546483875-ad9014c88eba", { w: 1400, h: 1700 }),
  aboutDetail: photo("photo-1581009146145-b5ef050c2e1e", { w: 800, h: 800 }),
  finalCta: photo("photo-1605296867304-46d5465a13f1", { w: 2400 }),
  pages: {
    about: photo("photo-1623874514711-0f321325f318", { w: 2400 }),
    membership: photo("photo-1532029837206-abbe2b7620e3", { w: 2400 }),
    classes: photo("photo-1518310383802-640c2de311b2", { w: 2400 }),
    trainers: photo("photo-1549060279-7e168fcee0c2", { w: 2400 }),
    facilities: photo("photo-1593079831268-3381b0db4a77", { w: 2400 }),
    contact: photo("photo-1580261450046-d0a30080dc9b", { w: 2400 }),
  },
};

/* -------------------------------------------------------------------------- */
/* About                                                                      */
/* -------------------------------------------------------------------------- */

export const aboutQualities = [
  "Clean and organized environment",
  "Well-maintained equipment",
  "Beginner-friendly atmosphere",
  "Friendly and approachable staff",
  "Variety of fitness equipment",
  "Flexible operating hours",
  "Group fitness activities",
];

export type Feature = { title: string; description: string; icon: LucideIcon };

export const features: Feature[] = [
  {
    title: "Well-Equipped",
    description:
      "A variety of machines, free weights, and fitness equipment for different training goals.",
    icon: Dumbbell,
  },
  {
    title: "Beginner Friendly",
    description:
      "A comfortable environment where beginners can start their fitness journey without feeling intimidated.",
    icon: Sprout,
  },
  {
    title: "Supportive Community",
    description: "A welcoming environment with approachable staff and coaches.",
    icon: HeartHandshake,
  },
  {
    title: "Flexible Schedule",
    description: "Open until 10 PM so members can train around their daily schedules.",
    icon: CalendarClock,
  },
];

/* -------------------------------------------------------------------------- */
/* Facilities gallery                                                         */
/* -------------------------------------------------------------------------- */

export type GalleryImage = {
  src: string;
  alt: string;
  category: string;
  /** Tile size in the desktop grid. */
  layout: "tall" | "wide" | "square";
};

export const gallery: GalleryImage[] = [
  {
    src: photo("photo-1541534741688-6078c6bfb5c5", { w: 1400 }),
    alt: "Member performing a barbell lift inside a squat rack",
    category: "Strength Training",
    layout: "tall",
  },
  {
    src: photo("photo-1571902943202-507ec2618e8f", { w: 1600 }),
    alt: "Row of treadmills and cardio machines beside large windows",
    category: "Cardio",
    layout: "wide",
  },
  {
    src: photo("photo-1544033527-b192daee1f5b", { w: 1400 }),
    alt: "Rack of dumbbells arranged by weight",
    category: "Free Weights",
    layout: "square",
  },
  {
    src: photo("photo-1599901860904-17e6ed7083a0", { w: 1400 }),
    alt: "Open floor space with mats for stretching and group workouts",
    category: "Group Workout Area",
    layout: "square",
  },
  {
    src: photo("photo-1571731956672-f2b94d7dd0cb", { w: 1400 }),
    alt: "Member training on a cable pulldown machine",
    category: "Training Equipment",
    layout: "tall",
  },
  {
    src: photo("photo-1540497077202-7c8a3999166f", { w: 1600 }),
    alt: "Bright, organized gym interior with machines and benches",
    category: "Gym Interior",
    layout: "wide",
  },
  {
    src: photo("photo-1517836357463-d25dfeac3438", { w: 1400 }),
    alt: "Close-up of a loaded barbell being lifted from the floor",
    category: "Strength Training",
    layout: "square",
  },
  {
    src: photo("photo-1576678927484-cc907957088c", { w: 1400 }),
    alt: "Close-up of dumbbells lined up on a rack",
    category: "Free Weights",
    layout: "square",
  },
];

/* -------------------------------------------------------------------------- */
/* Membership                                                                 */
/* -------------------------------------------------------------------------- */

export type Plan = {
  id: string;
  name: string;
  /** Placeholder price — replace "XXX" with the confirmed rate (numbers only, e.g. "150"). */
  price: string;
  period: string;
  summary: string;
  features: string[];
  cta: string;
  inquiry: InquiryType;
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    id: "daily",
    name: "Daily Pass",
    price: "XXX",
    period: "per visit",
    summary: "Drop in and train whenever it suits you.",
    features: ["Full gym access", "Access to standard equipment", "No long-term commitment"],
    cta: "Get Started",
    inquiry: "daily-pass",
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "XXX",
    period: "per month",
    summary: "For members building a steady training routine.",
    features: ["Full gym access", "Flexible training schedule", "Member benefits"],
    cta: "Join Now",
    inquiry: "membership",
    featured: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "XXX",
    period: "per month",
    summary: "Everything in the gym, plus group sessions.",
    features: ["Full gym access", "Group classes", "Additional member benefits"],
    cta: "Get Started",
    inquiry: "membership",
  },
];

export const membershipNote =
  "Membership rates and inclusions may vary. Contact us for the latest rates.";

/* -------------------------------------------------------------------------- */
/* Group classes                                                              */
/* -------------------------------------------------------------------------- */

export type FitnessClass = {
  id: string;
  name: string;
  description: string;
  image: string;
  /** Placeholder until the timetable is confirmed. */
  schedule: string;
  /** Placeholder until coach assignments are confirmed. */
  coach: string;
};

const TBA = "To be announced";

export const classes: FitnessClass[] = [
  {
    id: "zumba",
    name: "Zumba",
    description: "Dance-based cardio set to upbeat music — high energy, easy to follow.",
    image: photo("photo-1524594152303-9fd13543fe6e", { w: 1200, h: 900 }),
    schedule: TBA,
    coach: TBA,
  },
  {
    id: "group-fitness",
    name: "Group Fitness",
    description: "Coach-led full-body sessions where the group keeps you moving.",
    image: photo("photo-1518611012118-696072aa579a", { w: 1200, h: 900 }),
    schedule: TBA,
    coach: TBA,
  },
  {
    id: "strength",
    name: "Strength Training",
    description: "Learn the fundamentals of lifting with good form and steady progression.",
    image: photo("photo-1517963879433-6ad2b056d712", { w: 1200, h: 900 }),
    schedule: TBA,
    coach: TBA,
  },
  {
    id: "cardio",
    name: "Cardio",
    description: "Conditioning work to build stamina and support heart health.",
    image: photo("photo-1536922246289-88c42f957773", { w: 1200, h: 900 }),
    schedule: TBA,
    coach: TBA,
  },
  {
    id: "functional",
    name: "Functional Training",
    description: "Movement-based training for everyday strength, mobility and balance.",
    image: photo("photo-1599058917212-d750089bc07e", { w: 1200, h: 900 }),
    schedule: TBA,
    coach: TBA,
  },
];

export const classesNote =
  "Class offerings and schedules change — message or call us to confirm which sessions are currently running.";

/* -------------------------------------------------------------------------- */
/* Coaches (placeholders)                                                     */
/* -------------------------------------------------------------------------- */

export type Trainer = {
  name: string;
  specialty: string;
  bio: string;
  image: string;
  /** Optional link to the coach's social profile. Falls back to the inquiry form. */
  contactHref?: string;
};

export const trainers: Trainer[] = [
  {
    name: "Coach Name",
    specialty: "Strength Training",
    bio: "Coach profile coming soon — background, certifications and coaching style.",
    image: photo("photo-1567013127542-490d757e51fc", { w: 900, h: 1125, faces: true }),
  },
  {
    name: "Coach Name",
    specialty: "Group Fitness",
    bio: "Coach profile coming soon — background, certifications and coaching style.",
    image: photo("photo-1594381898411-846e7d193883", { w: 900, h: 1125, faces: true }),
  },
  {
    name: "Coach Name",
    specialty: "Functional Training",
    bio: "Coach profile coming soon — background, certifications and coaching style.",
    image: photo("photo-1579758629938-03607ccdbaba", { w: 900, h: 1125, faces: true }),
  },
  {
    name: "Coach Name",
    specialty: "Beginner Coaching",
    bio: "Coach profile coming soon — background, certifications and coaching style.",
    image: photo("photo-1550345332-09e3ac987658", { w: 900, h: 1125, faces: true }),
  },
];

/* -------------------------------------------------------------------------- */
/* Member experience                                                          */
/* -------------------------------------------------------------------------- */

export const experience = [
  {
    label: "Beginners",
    text: "Start at your own pace with room to learn.",
    image: photo("photo-1594737625785-a6cbdabd333c", { w: 1200, h: 1400 }),
  },
  {
    label: "Experienced Lifters",
    text: "Free weights and machines to keep progressing.",
    image: photo("photo-1554284126-aa88f22d8b74", { w: 1200, h: 1400 }),
  },
  {
    label: "Group Workouts",
    text: "Move together and stay motivated.",
    image: photo("photo-1518310383802-640c2de311b2", { w: 1200, h: 1400 }),
  },
  {
    label: "Personal Training",
    text: "One-on-one guidance from a coach.",
    image: photo("photo-1584466977773-e625c37cdd50", { w: 1200, h: 1400 }),
  },
  {
    label: "Community",
    text: "Familiar faces who keep you showing up.",
    image: photo("photo-1607962837359-5e7e89f86776", { w: 1200, h: 1400 }),
  },
];

/* -------------------------------------------------------------------------- */
/* Reviews — short excerpts from public Google reviews                        */
/* -------------------------------------------------------------------------- */

export type Testimonial = {
  quote: string;
  author: string;
  /** Star rating left by the reviewer, if known. Leave out rather than guessing. */
  rating?: number;
};

export const testimonials: Testimonial[] = [
  { quote: "Affordable, clean, and beginner-friendly.", author: "Hannah Montil" },
  {
    quote: "Clean, aesthetic vibe with very accommodating staff and coaches.",
    author: "Reinan Dela Peña",
  },
  {
    quote: "A solid place to work out with a good variety of machines and free weights.",
    author: "Ritik Rurka",
  },
];

/* -------------------------------------------------------------------------- */
/* Inquiry form                                                               */
/* -------------------------------------------------------------------------- */

export const inquiryTypes = [
  { value: "membership", label: "Membership" },
  { value: "daily-pass", label: "Daily Pass" },
  { value: "personal-training", label: "Personal Training" },
  { value: "classes", label: "Classes" },
  { value: "general", label: "General Inquiry" },
] as const;

export type InquiryType = (typeof inquiryTypes)[number]["value"];
