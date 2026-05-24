"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { SPONSOR_TIERS, SPONSOR_TIER_LABELS, type SponsorTier } from "@/lib/sponsors";

type Sponsor = {
  id: string;
  name: string;
  tier: SponsorTier;
  logoUrl: string | null;
  url: string | null;
  displayOrder: number;
};

export function SponsorForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial: Sponsor | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: initial?.name ?? "",
    tier: (initial?.tier ?? "sponsor") as SponsorTier,
    url: initial?.url ?? "",
    logoUrl: initial?.logoUrl ?? "",
    displayOrder: initial?.displayOrder ?? 0,
  });

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { url } = await res.json();
      setForm((prev) => ({ ...prev, logoUrl: url }));
    } else {
      setError("Logo upload failed");
    }
    setUploadingLogo(false);
    if (logoInputRef.current) logoInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name,
      tier: form.tier,
      url: form.url,
      logoUrl: form.logoUrl,
      displayOrder: Number(form.displayOrder) || 0,
    };

    const res = initial
      ? await fetch(`/api/sponsors/${initial.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/sponsors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    setSaving(false);
    if (!res.ok) {
      const { error: msg } = await res.json().catch(() => ({ error: "" }));
      setError(msg || "Save failed");
      return;
    }
    onSaved();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-5"
    >
      <h3 className="font-heading text-lg font-bold uppercase text-white mb-2">
        {initial ? "Edit Sponsor" : "New Sponsor"}
      </h3>

      {/* Name */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          Name
        </label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white
                     focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20 outline-none"
        />
      </div>

      {/* Tier + display order */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Tier
          </label>
          <select
            value={form.tier}
            onChange={(e) =>
              setForm((p) => ({ ...p, tier: e.target.value as SponsorTier }))
            }
            className="w-full rounded-lg border border-white/10 bg-brand-dark px-3 py-2 text-sm text-white
                       focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20 outline-none"
          >
            {SPONSOR_TIERS.map((tier) => (
              <option key={tier} value={tier}>
                {SPONSOR_TIER_LABELS[tier]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Display order
          </label>
          <input
            type="number"
            value={form.displayOrder}
            onChange={(e) =>
              setForm((p) => ({ ...p, displayOrder: Number(e.target.value) }))
            }
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white
                       focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20 outline-none"
          />
        </div>
      </div>

      {/* URL */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          URL
        </label>
        <input
          type="url"
          placeholder="https://example.com"
          value={form.url}
          onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white
                     placeholder:text-gray-600
                     focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20 outline-none"
        />
      </div>

      {/* Logo */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          Logo
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            disabled={uploadingLogo}
            className="bg-white/10 hover:bg-white/15 text-white text-sm px-4 py-2 rounded-lg transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadingLogo ? "Uploading..." : "Upload logo"}
          </button>
          {form.logoUrl && (
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, logoUrl: "" }))}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Remove
            </button>
          )}
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </div>
        {form.logoUrl && (
          <div className="mt-3 relative w-32 h-32 rounded-lg overflow-hidden border border-white/10 bg-black/40">
            <Image
              src={form.logoUrl}
              alt="Logo preview"
              fill
              className="object-contain p-2"
              sizes="128px"
            />
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Logos are shown contained in their card (not cropped). A transparent PNG/SVG works best.
        </p>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

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
          {saving ? "Saving..." : initial ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
