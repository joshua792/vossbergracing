"use client";

import { useEffect, useState } from "react";
import { ImageSlotCard } from "@/components/admin/image-slot-card";

type Slot = {
  key: string;
  page: string;
  location: string;
  defaultUrl: string;
  aspectRatio: number;
  aspectLabel: string;
  currentUrl: string;
  isOverridden: boolean;
  updatedAt: string | null;
};

export default function AdminImagesPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchSlots() {
    const res = await fetch("/api/site-images");
    const data = await res.json();
    setSlots(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchSlots();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold uppercase text-white">
          Site Images
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Replace images used across the public site. Uploads that don&apos;t
          match the slot&apos;s aspect ratio will be cropped to fit.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-6">
          {slots.map((slot) => (
            <ImageSlotCard key={slot.key} slot={slot} onChanged={fetchSlots} />
          ))}
        </div>
      )}
    </div>
  );
}
