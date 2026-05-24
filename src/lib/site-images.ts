import { db } from "@/lib/db";
import { siteImages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export type SiteImageSlot = {
  key: string;
  page: string;
  location: string;
  defaultUrl: string;
  // Container aspect ratio (width / height). Used to warn when an upload
  // will be cropped significantly by object-cover.
  aspectRatio: number;
  aspectLabel: string;
};

export const SITE_IMAGE_SLOTS: SiteImageSlot[] = [
  {
    key: "hero-background",
    page: "Home",
    location: "Hero section — full-screen background",
    defaultUrl: "/images/bike-grid.jpg",
    aspectRatio: 16 / 9,
    aspectLabel: "16:9 landscape (fills viewport)",
  },
  {
    key: "about-portrait",
    page: "Home",
    location: "About section — portrait photo",
    defaultUrl: "/images/reese-portrait.jpg",
    aspectRatio: 4 / 5,
    aspectLabel: "4:5 portrait",
  },
];

export function getSlot(key: string): SiteImageSlot | undefined {
  return SITE_IMAGE_SLOTS.find((s) => s.key === key);
}

export async function getSiteImageUrl(key: string): Promise<string> {
  const slot = getSlot(key);
  const fallback = slot?.defaultUrl ?? "";
  const [row] = await db
    .select()
    .from(siteImages)
    .where(eq(siteImages.key, key))
    .limit(1);
  return row?.url ?? fallback;
}

export type SiteImageWithOverride = SiteImageSlot & {
  currentUrl: string;
  isOverridden: boolean;
  updatedAt: Date | null;
};

export async function getAllSiteImages(): Promise<SiteImageWithOverride[]> {
  const rows = await db.select().from(siteImages);
  const overrides = new Map(rows.map((r) => [r.key, r]));
  return SITE_IMAGE_SLOTS.map((slot) => {
    const override = overrides.get(slot.key);
    return {
      ...slot,
      currentUrl: override?.url ?? slot.defaultUrl,
      isOverridden: !!override,
      updatedAt: override?.updatedAt ?? null,
    };
  });
}
