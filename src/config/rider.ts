/**
 * Rider Configuration — Hank Vossberg
 * ─────────────────────────────────────────────────────────────────────────────
 * All rider-specific content lives here. To update brand colors, edit the
 * CSS custom properties in src/app/globals.css:
 *
 *   --color-brand-blue:         primary accent  → Aprilia red: #D0021B
 *   --color-brand-orange:       highlight color → white or light gray: #F0F0F0
 *   --color-brand-dark:         page background → near-black: #0D0D0D
 *   --color-brand-dark-lighter: section bg      → dark gray: #1A1A1A
 *
 * NOTE: Verify exact hex values against actual Robem Engineering 2026 livery
 * assets before publishing. These are reasonable starting points based on the
 * Aprilia RS 660 color scheme.
 */

export const rider = {
  // ── Identity ──────────────────────────────────────────────────────────────
  firstName: "Hank",
  lastName: "Vossberg",
  fullName: "Hank Vossberg",
  number: 31,
  numberDisplay: "#31",

  // ── Racing ────────────────────────────────────────────────────────────────
  series: "MotoAmerica",
  class: "SC-Project Twins Cup",
  team: "Robem Engineering",

  // ── Contact ───────────────────────────────────────────────────────────────
  contactEmail: "contact@vossbergracing.com",

  // ── SEO / Metadata ────────────────────────────────────────────────────────
  meta: {
    title: "Hank Vossberg | #31 MotoAmerica Twins Cup",
    description:
      "Official website of Hank Vossberg, #31 rider in the MotoAmerica SC-Project Twins Cup competing with Robem Engineering on the Aprilia RS 660.",
  },

  // ── About Section ─────────────────────────────────────────────────────────
  bio: [
    "Hailing from Wisconsin, Hank Vossberg is making an emphatic statement in American motorcycle road racing. At just 15 years old, the Robem Engineering Aprilia rider arrived in the 2026 MotoAmerica SC-Project Twins Cup with serious pedigree — and immediately proved he belonged at the front.",
    "Competing as the #31 rider aboard the Aprilia RS 660, Vossberg wasted no time establishing his championship credentials. He claimed victory at the season opener at Daytona International Speedway, then backed it up with a dominant sweep of both races at Barber Motorsports Park to vault to the top of the Twins Cup standings.",
    "A calculated, mature racer well beyond his years, Vossberg brings prior MotoAmerica experience and WERA Endurance Series mileage on the Aprilia platform. The 2026 Twins Cup title is firmly in his sights.",
  ],

  stats: [
    { value: "#31", label: "Number" },
    { value: "1st", label: "Championship" },
    { value: "TC", label: "Twins Cup" },
  ],

  // ── Image Alt Text ────────────────────────────────────────────────────────
  images: {
    heroAlt: "Hank Vossberg #31 Robem Engineering Aprilia RS 660 at speed",
    portraitAlt: "Hank Vossberg with his #31 Robem Engineering Aprilia RS 660",
  },

  // ── Sponsors Section ──────────────────────────────────────────────────────
  sponsorshipBlurb: "Partner with the MotoAmerica Twins Cup championship leader.",
} as const;
