import { db } from "@/lib/db";
import { sponsors } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export const SPONSOR_TIERS = ["title", "sponsor", "team"] as const;
export type SponsorTier = (typeof SPONSOR_TIERS)[number];

export const LOGO_BACKGROUNDS = ["dark", "light"] as const;
export type LogoBackground = (typeof LOGO_BACKGROUNDS)[number];

export function isSponsorTier(value: unknown): value is SponsorTier {
  return (
    typeof value === "string" &&
    (SPONSOR_TIERS as readonly string[]).includes(value)
  );
}

export function isLogoBackground(value: unknown): value is LogoBackground {
  return (
    typeof value === "string" &&
    (LOGO_BACKGROUNDS as readonly string[]).includes(value)
  );
}

export const SPONSOR_TIER_LABELS: Record<SponsorTier, string> = {
  title: "Title Sponsor",
  sponsor: "Sponsor",
  team: "Team",
};

export async function listSponsors() {
  return db
    .select()
    .from(sponsors)
    .orderBy(asc(sponsors.tier), asc(sponsors.displayOrder), asc(sponsors.name));
}
