import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { addAdmin, listAdmins } from "@/lib/admins";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const admins = await listAdmins();
  return NextResponse.json(admins);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const email = typeof body.email === "string" ? body.email : "";

  try {
    const row = await addAdmin(email, session.user.email);
    if (!row) {
      return NextResponse.json(
        { error: "Email is already an admin" },
        { status: 409 }
      );
    }
    return NextResponse.json(row, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to add admin" },
      { status: 400 }
    );
  }
}
