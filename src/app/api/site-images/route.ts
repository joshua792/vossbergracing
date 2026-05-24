import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllSiteImages } from "@/lib/site-images";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const slots = await getAllSiteImages();
  return NextResponse.json(slots);
}
