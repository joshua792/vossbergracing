import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { notifySubscribers, buildBlogPostEmail } from "@/lib/notify";
import { stripHtml } from "@/lib/utils";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1);

  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}

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

  // Check if this is a newly published post (was draft, now published)
  const [existing] = await db
    .select({ published: blogPosts.published })
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1);

  const newlyPublished = body.published && existing && !existing.published;

  // If publishing for the first time, set publishedAt
  let publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
  if (body.published && !publishedAt) {
    publishedAt = new Date();
  }

  const [updated] = await db
    .update(blogPosts)
    .set({
      title: body.title,
      slug: body.slug,
      content: body.content,
      featuredImage: body.featuredImage || null,
      published: body.published ?? false,
      publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Notify subscribers when a draft is published for the first time
  if (newlyPublished) {
    const excerpt = stripHtml(body.content).slice(0, 200);
    notifySubscribers(
      `New Post: ${body.title}`,
      buildBlogPostEmail(body.title, body.slug, excerpt, body.featuredImage || null)
    ).catch((err) => console.error("[notify] Error:", err));
  }

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
    .delete(blogPosts)
    .where(eq(blogPosts.id, id))
    .returning();

  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
