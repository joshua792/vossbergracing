"use client";

import { useEffect, useState } from "react";
import { SponsorForm } from "@/components/admin/sponsor-form";
import {
  SPONSOR_TIER_LABELS,
  type SponsorTier,
  type LogoBackground,
} from "@/lib/sponsors";
import Image from "next/image";

type Sponsor = {
  id: string;
  name: string;
  tier: SponsorTier;
  logoUrl: string | null;
  logoBackground: LogoBackground;
  url: string | null;
  displayOrder: number;
};

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Sponsor | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function fetchSponsors() {
    const res = await fetch("/api/sponsors");
    const data = await res.json();
    setSponsors(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchSponsors();
  }, []);

  async function handleDelete(sponsor: Sponsor) {
    if (!confirm(`Delete sponsor "${sponsor.name}"?`)) return;
    await fetch(`/api/sponsors/${sponsor.id}`, { method: "DELETE" });
    fetchSponsors();
  }

  function handleSaved() {
    setShowForm(false);
    setEditing(null);
    fetchSponsors();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase text-white">
            Sponsors
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Edit the sponsors shown on the homepage.
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="bg-brand-orange hover:bg-orange-500 text-white font-heading uppercase
                     tracking-wider text-sm px-6 py-2 rounded-lg transition-colors"
        >
          + Add Sponsor
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <SponsorForm
            initial={editing}
            onSaved={handleSaved}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : sponsors.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          No sponsors yet. Add your first one above.
        </p>
      ) : (
        <div className="space-y-3">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="bg-white/5 border border-white/5 rounded-lg p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className={`relative w-16 h-16 rounded border border-white/10 flex items-center justify-center overflow-hidden shrink-0 ${
                    sponsor.logoBackground === "light"
                      ? "bg-white"
                      : "bg-black/40"
                  }`}
                >
                  {sponsor.logoUrl ? (
                    <Image
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                    />
                  ) : (
                    <span className="text-[10px] text-gray-500 uppercase">
                      No logo
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white truncate">
                      {sponsor.name}
                    </h3>
                    <span className="text-[10px] uppercase tracking-wider bg-white/10 text-gray-300 px-2 py-0.5 rounded shrink-0">
                      {SPONSOR_TIER_LABELS[sponsor.tier]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {sponsor.url ?? "No URL"}
                    {" · "}order {sponsor.displayOrder}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setEditing(sponsor);
                    setShowForm(true);
                  }}
                  className="text-xs text-gray-400 hover:text-brand-orange transition-colors px-3 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(sponsor)}
                  className="text-xs text-gray-400 hover:text-red-400 transition-colors px-3 py-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
