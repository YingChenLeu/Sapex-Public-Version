// Shared data shapes and helpers for the Rate Your Chance feature.
//
// Posts are stored anonymously: we keep `authorUid` server-side for
// ownership checks and de-duplicating ratings, but the UI never displays it.

export type RegionId =
  | "north-america"
  | "latin-america"
  | "western-europe"
  | "eastern-europe"
  | "mena"
  | "sub-saharan-africa"
  | "central-asia"
  | "south-asia"
  | "east-asia"
  | "southeast-asia"
  | "oceania";

export type RegionDef = {
  id: RegionId;
  label: string;
  short: string;
  description: string;
  examples: string;
  // Pin position (cx, cy) on a 1000x500 SVG viewBox. Used to place
  // a clickable map pin over the world map background.
  pinX: number;
  pinY: number;
};

// Pin coordinates are tuned for the worldmap.png asset stretched to a
// 1000x500 SVG viewBox.
export const REGIONS: RegionDef[] = [
  {
    id: "north-america",
    label: "North America",
    short: "N. America",
    description: "United States, Canada, Mexico",
    examples: "USA · Canada · Mexico",
    pinX: 195,
    pinY: 175,
  },
  {
    id: "latin-america",
    label: "Latin America & Caribbean",
    short: "Latin America",
    description: "Central & South America, Caribbean",
    examples: "Brazil · Argentina · Chile · Peru · Colombia",
    pinX: 320,
    pinY: 365,
  },
  {
    id: "western-europe",
    label: "Western Europe",
    short: "W. Europe",
    description: "UK, EU west, Nordics",
    examples: "UK · France · Germany · Spain · Italy · Sweden",
    pinX: 490,
    pinY: 145,
  },
  {
    id: "eastern-europe",
    label: "Eastern Europe",
    short: "E. Europe",
    description: "Central, Balkan, and Eastern European states",
    examples: "Poland · Czechia · Romania · Ukraine · Russia (W)",
    pinX: 575,
    pinY: 125,
  },
  {
    id: "mena",
    label: "Middle East & North Africa",
    short: "MENA",
    description: "Arab states, Iran, Israel, Turkey, Egypt, Maghreb",
    examples: "UAE · Saudi · Iran · Turkey · Egypt · Morocco",
    pinX: 570,
    pinY: 220,
  },
  {
    id: "sub-saharan-africa",
    label: "Sub-Saharan Africa",
    short: "SSA",
    description: "All African countries south of the Sahara",
    examples: "Nigeria · Kenya · Ghana · South Africa · Ethiopia",
    pinX: 555,
    pinY: 350,
  },
  {
    id: "central-asia",
    label: "Central Asia",
    short: "C. Asia",
    description: "Stans + Mongolia",
    examples: "Kazakhstan · Uzbekistan · Mongolia · Kyrgyzstan",
    pinX: 705,
    pinY: 145,
  },
  {
    id: "south-asia",
    label: "South Asia",
    short: "S. Asia",
    description: "Indian subcontinent",
    examples: "India · Pakistan · Bangladesh · Sri Lanka · Nepal",
    pinX: 720,
    pinY: 260,
  },
  {
    id: "east-asia",
    label: "East Asia",
    short: "E. Asia",
    description: "China, Japan, Korea, Taiwan",
    examples: "China · Japan · S. Korea · Taiwan · HK",
    pinX: 830,
    pinY: 175,
  },
  {
    id: "southeast-asia",
    label: "Southeast Asia",
    short: "SE Asia",
    description: "ASEAN region",
    examples: "Singapore · Vietnam · Thailand · Indonesia · Philippines",
    pinX: 850,
    pinY: 290,
  },
  {
    id: "oceania",
    label: "Oceania",
    short: "Oceania",
    description: "Australia, NZ, Pacific Islands",
    examples: "Australia · New Zealand · Fiji",
    pinX: 905,
    pinY: 380,
  },
];

export const REGION_BY_ID: Record<RegionId, RegionDef> = REGIONS.reduce(
  (acc, r) => {
    acc[r.id] = r;
    return acc;
  },
  {} as Record<RegionId, RegionDef>,
);

export function isRegionId(value: unknown): value is RegionId {
  return (
    typeof value === "string" &&
    REGIONS.some((r) => r.id === (value as RegionId))
  );
}

export type RYCVerdict = "reach" | "target" | "likely" | "safety";

export const VERDICT_META: Record<
  RYCVerdict,
  { label: string; description: string; color: string; ring: string }
> = {
  reach: {
    label: "Reach",
    description: "Long shot — under typical admit thresholds.",
    color: "#F87171",
    ring: "ring-red-400/40",
  },
  target: {
    label: "Target",
    description: "Within range, but no guarantee.",
    color: "#FBBF24",
    ring: "ring-amber-300/40",
  },
  likely: {
    label: "Likely",
    description: "Stronger profile than typical admit.",
    color: "#7CDCBD",
    ring: "ring-emerald-300/40",
  },
  safety: {
    label: "Safety",
    description: "Very strong odds based on stats alone.",
    color: "#60A5FA",
    ring: "ring-sky-300/40",
  },
};

export const VERDICT_ORDER: RYCVerdict[] = [
  "reach",
  "target",
  "likely",
  "safety",
];

export type RYCPost = {
  id: string;
  authorUid: string;
  dreamSchool: string;
  intendedMajor: string;
  region: RegionId;
  usState: string;
  schoolType: string;
  gpaUnweighted: number | null;
  gpaWeighted: number | null;
  classRank: string;
  satScore: number | null;
  actScore: number | null;
  rigor: string;
  extracurriculars: string;
  awards: string;
  essaysSummary: string;
  spike: string;
  demographics: string;
  additionalContext: string;
  createdAt: Date | null;
  ratingsCount: number;
  chanceTotal: number;
  reachCount: number;
  targetCount: number;
  likelyCount: number;
  safetyCount: number;
  commentsCount: number;
};

export type RYCRating = {
  chance: number;
  verdict: RYCVerdict;
  note: string;
};

export const US_STATES: { code: string; name: string }[] = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

export const SCHOOL_TYPES = [
  "Public",
  "Private",
  "Charter",
  "Magnet",
  "Religious",
  "Boarding",
  "Homeschool",
  "Online",
  "Other",
] as const;

export const RYC_DISCLAIMER =
  "Heads up: please double-check every detail. The opinions here are just opinions — these reviewers are not admission officers, just peers offering some guidance.";

export function averageChance(p: Pick<RYCPost, "ratingsCount" | "chanceTotal">) {
  if (!p.ratingsCount) return null;
  return Math.round(p.chanceTotal / p.ratingsCount);
}

export function topVerdict(
  p: Pick<
    RYCPost,
    "reachCount" | "targetCount" | "likelyCount" | "safetyCount"
  >,
): RYCVerdict | null {
  const counts: Record<RYCVerdict, number> = {
    reach: p.reachCount,
    target: p.targetCount,
    likely: p.likelyCount,
    safety: p.safetyCount,
  };
  let best: RYCVerdict | null = null;
  let bestCount = 0;
  for (const v of VERDICT_ORDER) {
    if (counts[v] > bestCount) {
      best = v;
      bestCount = counts[v];
    }
  }
  return bestCount > 0 ? best : null;
}

export function parseOptionalNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return null;
  return n;
}
