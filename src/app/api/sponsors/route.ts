import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sponsors } from "@/lib/db/schema";
import { isSponsorTier, listSponsors } from "@/lib/sponsors";
import { revalidatePath } from "next/cache";

export async function GET() {
  const all = await listSponsors();
  return NextResponse.json(all);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const tier = body.tier;
  const url = typeof body.url === "string" ? body.url.trim() : "";
  const logoUrl = typeof body.logoUrl === "string" ? body.logoUrl.trim() : "";
  const displayOrder = Number.isFinite(body.displayOrder)
    ? Math.trunc(body.displayOrder)
    : 0;

  if (!name) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }
  if (!isSponsorTier(tier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  const [created] = await db
    .insert(sponsors)
    .values({
      name,
      tier,
      url: url || null,
      logoUrl: logoUrl || null,
      displayOrder,
    })
    .returning();

  revalidatePath("/");
  return NextResponse.json(created, { status: 201 });
}
