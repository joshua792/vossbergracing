"use client";

import { useState, useRef } from "react";
import { TiptapEditor } from "./tiptap-editor";
import { slugify } from "@/lib/utils";
import Image from "next/image";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage: string | null;
  published: boolean;
  publishedAt: string | null;
};

export function BlogForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial: BlogPost | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const featuredInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    content: initial?.content ?? "",
    featuredImage: initial?.featuredImage ?? "",
    published: initial?.published ?? false,
  });

  function handleTitleChange(title: string) {
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugEdited ? prev.slug : slugify(title),
    }));
  }

  async function handleFeaturedImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { url } = await res.json();
      setForm((prev) => ({ ...prev, featuredImage: url }));
    }
    setUploadingImage(false);

    if (featuredInputRef.current) featuredInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title,
      slug: form.slug,
      content: form.content,
      featuredImage: form.featuredImage || null,
      published: form.published,
      publishedAt: initial?.publishedAt || null,
    };

    if (initial) {
      await fetch(`/api/blog/${initial.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setSaving(false);
    onSaved();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-5"
    >
      <h3 className="font-heading text-lg font-bold uppercase text-white mb-4">
        {initial ? "Edit Post" : "New Post"}
      </h3>

      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          Title
        </label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white
                     focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20 outline-none"
          placeholder="Post title..."
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          Slug
        </label>
        <input
          type="text"
          required
          value={form.slug}
          onChange={(e) => {
            setSlugEdited(true);
            setForm((prev) => ({ ...prev, slug: e.target.value }));
          }}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white
                     focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20 outline-none"
          placeholder="post-url-slug"
        />
      </div>

      {/* Featured Image */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          Featured Image
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => featuredInputRef.current?.click()}
            disabled={uploadingImage}
            className="bg-white/10 hover:bg-white/15 text-white text-sm px-4 py-2 rounded-lg transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadingImage ? "Uploading..." : "Upload Image"}
          </button>
          {form.featuredImage && (
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, featuredImage: "" }))}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Remove
            </button>
          )}
          <input
            ref={featuredInputRef}
            type="file"
            accept="image/*"
            onChange={handleFeaturedImageUpload}
            className="hidden"
          />
        </div>
        {form.featuredImage && (
          <div className="mt-3 relative w-full max-w-sm aspect-video rounded-lg overflow-hidden border border-white/10">
            <Image
              src={form.featuredImage}
              alt="Featured image preview"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Content Editor */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          Content
        </label>
        <TiptapEditor
          content={form.content}
          onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
        />
      </div>

      {/* Published Toggle */}
      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, published: e.target.checked }))
            }
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:bg-brand-orange transition-colors
                          after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                          after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all
                          peer-checked:after:translate-x-full" />
        </label>
        <span className="text-sm text-gray-400">
          {form.published ? "Published" : "Draft"}
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-orange hover:bg-orange-500 text-white font-heading uppercase
                     tracking-wider text-sm px-6 py-2 rounded-lg transition-colors
                     disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : initial ? "Update" : "Create Post"}
        </button>
      </div>
    </form>
  );
}
