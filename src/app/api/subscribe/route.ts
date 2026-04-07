import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscribers } from "@/lib/db/schema";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    await db
      .insert(subscribers)
      .values({ email: email.toLowerCase().trim(), confirmed: true })
      .onConflictDoNothing();
  } catch {
    // already subscribed — that's fine
  }

  return NextResponse.json({ success: true });
}
