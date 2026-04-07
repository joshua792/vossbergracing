import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { results } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { desc } from "drizzle-orm";
import { notifySubscribers, buildResultEmail } from "@/lib/notify";

export async function GET() {
  const allResults = await db
    .select()
    .from(results)
    .orderBy(desc(results.date));
  return NextResponse.json(allResults);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const [newResult] = await db
    .insert(results)
    .values({
      date: body.date,
      track: body.track,
      qualifying: body.qualifying,
      race1: body.race1,
      race2: body.race2 || null,
      championship: body.championship,
    })
    .returning();

  // Notify subscribers (fire-and-forget, don't block the response)
  notifySubscribers(
    `Race Update: ${body.track}`,
    buildResultEmail(body.track, body.qualifying, body.race1, body.race2 || null, body.championship)
  ).catch((err) => console.error("[notify] Error:", err));

  return NextResponse.json(newResult, { status: 201 });
}
