import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { eq, sql, asc } from "drizzle-orm";

const seedEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function normalize(email: string) {
  return email.trim().toLowerCase();
}

export async function listAdmins() {
  return db
    .select()
    .from(adminUsers)
    .orderBy(asc(adminUsers.createdAt));
}

export async function isAdmin(email: string): Promise<boolean> {
  const normalized = normalize(email);
  const [existing] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(sql`lower(${adminUsers.email}) = ${normalized}`)
    .limit(1);

  if (existing) return true;

  // Bootstrap from ADMIN_EMAILS env var on first sign-in.
  if (seedEmails.includes(normalized)) {
    await db
      .insert(adminUsers)
      .values({ email: normalized, addedBy: "seed" })
      .onConflictDoNothing();
    return true;
  }

  return false;
}

export async function addAdmin(email: string, addedBy: string | null) {
  const normalized = normalize(email);
  if (!normalized || !normalized.includes("@")) {
    throw new Error("Invalid email");
  }
  const [row] = await db
    .insert(adminUsers)
    .values({ email: normalized, addedBy })
    .onConflictDoNothing()
    .returning();
  return row ?? null;
}

export async function removeAdmin(id: string) {
  const [row] = await db
    .delete(adminUsers)
    .where(eq(adminUsers.id, id))
    .returning();
  return row ?? null;
}
