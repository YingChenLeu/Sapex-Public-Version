const LEET_MAP: Record<string, string> = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "5": "s",
  "7": "t",
  "@": "a",
  "$": "s",
};

function normalizeForProfanity(input: string): string {
  const lower = input.toLowerCase();
  let out = "";
  for (const ch of lower) {
    out += LEET_MAP[ch] ?? ch;
  }
  // Keep letters/numbers/spaces only; collapse whitespace.
  out = out.replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  return out;
}

// Mild words are allowed (requested by user). We only block more severe profanity
// and slurs. This is client-side only; still enforce rules server-side if possible.
const ALLOWED_MILD = new Set([
  "damn",
  "hell",
  "crap",
  "shit",
  "bullshit",
  "wtf",
  "omg",
  "sucks",
  "jerk",
]);

// NOTE: These are matched on word boundaries after normalization.
// Keep this list focused on strong profanity / hateful slurs.
const SEVERE_WORDS = [
  // Strong profanity
  "fuck",
  "fucking",
  "motherfucker",
  "bitch",
  "bastard",
  "asshole",
  "cunt",
  "dick",
  "pussy",
  "slut",
  "whore",
  // Hateful slurs (non-exhaustive)
  "nigger",
  "nigga",
  "faggot",
  "kike",
  "spic",
  "chink",
  "raghead",
  "retard",
];

const SEVERE_RE = new RegExp(
  `\\b(?:${SEVERE_WORDS.map((w) => w.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")).join("|")})\\b`,
  "i",
);

export function containsSevereProfanity(input: string): boolean {
  const normalized = normalizeForProfanity(input);
  if (!normalized) return false;

  // Fast allow: if normalized is only mild words, allow.
  const parts = normalized.split(" ").filter(Boolean);
  if (parts.length > 0 && parts.every((p) => ALLOWED_MILD.has(p))) return false;

  return SEVERE_RE.test(normalized);
}

