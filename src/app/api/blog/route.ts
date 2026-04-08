import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const publishedOnly = searchParams.get("published") === "true";

  const query = db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));

  const posts = publishedOnly
    ? await query.where(eq(blogPosts.published, true))
    : await query;

  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const [newPost] = await db
    .insert(blogPosts)
    .values({
      title: body.title,
      slug: body.slug,
      content: body.content,
      featuredImage: body.featuredImage || null,
      published: body.published ?? false,
      publishedAt: body.published ? new Date() : null,
    })
    .returning();

  return NextResponse.json(newPost, { status: 201 });
}
