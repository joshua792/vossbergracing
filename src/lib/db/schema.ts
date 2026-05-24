import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  primaryKey,
  date,
  boolean,
} from "drizzle-orm/pg-core";

// ============================================================================
// Users — populated by Auth.js on first login
// ============================================================================
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// ============================================================================
// Auth.js required tables
// ============================================================================
export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => [
    primaryKey({ columns: [table.provider, table.providerAccountId] }),
  ]
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })]
);

// ============================================================================
// Subscribers — email list for site updates
// ============================================================================
export const subscribers = pgTable("subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  confirmed: boolean("confirmed").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// ============================================================================
// Race Results
// ============================================================================
export const results = pgTable("results", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: date("date").notNull(),
  track: text("track").notNull(),
  qualifying: integer("qualifying").notNull(),
  race1: integer("race1").notNull(),
  race2: integer("race2"),
  championship: integer("championship").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// ============================================================================
// Admin Users — explicit allow-list for /admin access
// ============================================================================
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  addedBy: text("added_by"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// ============================================================================
// Sponsors — displayed on the homepage Sponsors section
// ============================================================================
export const sponsors = pgTable("sponsors", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  tier: text("tier").notNull(),
  logoUrl: text("logo_url"),
  url: text("url"),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// ============================================================================
// Site Images — admin-overridable image slots on the public site
// ============================================================================
export const siteImages = pgTable("site_images", {
  key: text("key").primaryKey(),
  url: text("url").notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// ============================================================================
// Blog Posts
// ============================================================================
export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull().default(""),
  featuredImage: text("featured_image"),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("published_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
