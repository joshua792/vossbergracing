import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sponsors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { isLogoBackground, isSponsorTier } from "@/lib/sponsors";
import { revalidatePath } from "next/cache";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const tier = body.tier;
  const url = typeof body.url === "string" ? body.url.trim() : "";
  const logoUrl = typeof body.logoUrl === "string" ? body.logoUrl.trim() : "";
  const logoBackground = isLogoBackground(body.logoBackground)
    ? body.logoBackground
    : "dark";
  const displayOrder = Number.isFinite(body.displayOrder)
    ? Math.trunc(body.displayOrder)
    : 0;

  if (!name) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }
  if (!isSponsorTier(tier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  const [updated] = await db
    .update(sponsors)
    .set({
      name,
      tier,
      url: url || null,
      logoUrl: logoUrl || null,
      logoBackground,
      displayOrder,
      updatedAt: new Date(),
    })
    .where(eq(sponsors.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  revalidatePath("/");
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [deleted] = await db
    .delete(sponsors)
    .where(eq(sponsors.id, id))
    .returning();

  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  revalidatePath("/");
  return NextResponse.json({ success: true });
}
