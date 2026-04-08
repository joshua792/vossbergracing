import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { stripHtml, formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.published, true))
    .orderBy(desc(blogPosts.publishedAt));

  return (
    <div className="pt-24 pb-16 min-h-screen bg-brand-dark">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-1 bg-brand-orange" />
          <span className="font-heading text-sm uppercase tracking-widest text-brand-orange">
            News &amp; Updates
          </span>
        </div>

        <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase mb-2">
          The <span className="text-brand-orange">Blog</span>
        </h1>
        <p className="text-gray-400 mb-10">
          Race recaps, behind-the-scenes, and updates from the track.
        </p>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="font-heading text-xl uppercase">No posts yet</p>
            <p className="text-sm mt-2">Check back soon for updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => {
              const excerpt = stripHtml(post.content).slice(0, 160);
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block bg-white/5 border border-white/5 rounded-lg overflow-hidden
                             hover:border-brand-orange/30 transition-colors"
                >
                  {post.featuredImage && (
                    <div className="relative aspect-video">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-xs text-gray-500 mb-2">
                      {post.publishedAt ? formatDate(post.publishedAt) : ""}
                    </p>
                    <h2 className="font-heading text-lg font-bold uppercase text-white group-hover:text-brand-orange transition-colors mb-2">
                      {post.title}
                    </h2>
                    {excerpt && (
                      <p className="text-sm text-gray-400 line-clamp-3">
                        {excerpt}
                        {post.content.length > 160 ? "..." : ""}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
