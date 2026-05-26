import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { stripHtml } from "@/lib/utils";
import { rider } from "@/config/rider";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true)))
    .limit(1);

  if (!post) return { title: "Post Not Found" };

  const description = stripHtml(post.content).slice(0, 160);

  return {
    title: `${post.title} | ${rider.fullName}`,
    description,
    openGraph: {
      title: post.title,
      description,
      ...(post.featuredImage && { images: [post.featuredImage] }),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true)))
    .limit(1);

  if (!post) notFound();

  return (
    <div className="pt-24 pb-16 min-h-screen bg-brand-dark">
      <div className="max-w-3xl mx-auto px-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-brand-orange transition-colors mb-8"
        >
          &larr; Back to Blog
        </Link>

        {post.featuredImage && (
          <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-3">
            {post.publishedAt ? formatDate(post.publishedAt) : ""}
          </p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase text-white">
            {post.title}
          </h1>
        </div>

        <article
          className="prose-blog text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
}
