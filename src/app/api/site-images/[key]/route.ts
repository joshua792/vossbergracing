import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { siteImages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSlot } from "@/lib/site-images";
import { revalidatePath } from "next/cache";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await params;
  if (!getSlot(key)) {
    return NextResponse.json({ error: "Unknown image slot" }, { status: 404 });
  }

  const body = await req.json();
  const url = typeof body.url === "string" ? body.url.trim() : "";
  if (!url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  }

  await db
    .insert(siteImages)
    .values({ key, url })
    .onConflictDoUpdate({
      target: siteImages.key,
      set: { url, updatedAt: new Date() },
    });

  revalidatePath("/");
  return NextResponse.json({ key, url });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await params;
  if (!getSlot(key)) {
    return NextResponse.json({ error: "Unknown image slot" }, { status: 404 });
  }

  await db.delete(siteImages).where(eq(siteImages.key, key));
  revalidatePath("/");
  return NextResponse.json({ success: true });
}
