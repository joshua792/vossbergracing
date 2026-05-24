import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { removeAdmin } from "@/lib/admins";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [target] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.id, id))
    .limit(1);

  if (!target) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (target.email.toLowerCase() === session.user.email.toLowerCase()) {
    return NextResponse.json(
      { error: "You can't remove yourself" },
      { status: 400 }
    );
  }

  const removed = await removeAdmin(id);
  if (!removed) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
