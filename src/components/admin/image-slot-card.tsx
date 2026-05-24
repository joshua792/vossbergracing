"use client";

import { useRef, useState } from "react";
import Image from "next/image";

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

type PendingUpload = {
  previewUrl: string;
  width: number;
  height: number;
  aspectRatio: number;
  file: File;
};

// Threshold (as a ratio difference) above which we warn that significant
// cropping will happen. 0.1 ≈ 10% off the target aspect.
const ASPECT_WARN_THRESHOLD = 0.1;

export function ImageSlotCard({
  slot,
  onChanged,
}: {
  slot: Slot;
  onChanged: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<PendingUpload | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handlePickFile() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    const previewUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setPending({
        previewUrl,
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight,
        file,
      });
    };
    img.onerror = () => {
      setError("Could not read the selected image.");
      URL.revokeObjectURL(previewUrl);
    };
    img.src = previewUrl;
  }

  function clearPending() {
    if (pending) URL.revokeObjectURL(pending.previewUrl);
    setPending(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSave() {
    if (!pending) return;
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", pending.file);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const { url } = await uploadRes.json();

      const saveRes = await fetch(`/api/site-images/${slot.key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!saveRes.ok) throw new Error("Save failed");

      clearPending();
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleRevert() {
    if (!confirm("Revert to the default image for this slot?")) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/site-images/${slot.key}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Revert failed");
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const ratioDiff = pending
    ? Math.abs(pending.aspectRatio - slot.aspectRatio) / slot.aspectRatio
    : 0;
  const willCropSignificantly = pending && ratioDiff > ASPECT_WARN_THRESHOLD;

  return (
    <div className="bg-white/5 border border-white/5 rounded-lg p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-heading text-xs uppercase tracking-widest text-brand-orange">
              {slot.page}
            </span>
            {slot.isOverridden && (
              <span className="text-[10px] uppercase tracking-wider bg-brand-blue/20 text-brand-blue px-2 py-0.5 rounded">
                Custom
              </span>
            )}
          </div>
          <h2 className="font-heading text-lg font-bold uppercase text-white">
            {slot.location}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Designed for {slot.aspectLabel}
          </p>
        </div>
        {slot.isOverridden && (
          <button
            type="button"
            onClick={handleRevert}
            disabled={saving}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
          >
            Revert to default
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Current */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Current
          </p>
          <div
            className="relative w-full rounded-lg overflow-hidden border border-white/10 bg-black/40"
            style={{ aspectRatio: slot.aspectRatio }}
          >
            <Image
              src={slot.currentUrl}
              alt={`Current ${slot.location}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        </div>

        {/* New */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            {pending ? "Preview (cropped to slot)" : "Replace"}
          </p>
          {pending ? (
            <>
              <div
                className="relative w-full rounded-lg overflow-hidden border border-white/10 bg-black/40"
                style={{ aspectRatio: slot.aspectRatio }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pending.previewUrl}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Upload is {pending.width}&times;{pending.height} (
                {pending.aspectRatio.toFixed(2)}:1). Slot is{" "}
                {slot.aspectRatio.toFixed(2)}:1.
              </p>
              {willCropSignificantly && (
                <div className="mt-2 rounded border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-300">
                  <strong className="block font-heading uppercase tracking-wider text-yellow-400 mb-1">
                    Aspect mismatch
                  </strong>
                  This image is {Math.round(ratioDiff * 100)}% off the slot&apos;s
                  aspect ratio. It will fill the slot, but some of the image
                  will be cropped to fit.
                </div>
              )}
            </>
          ) : (
            <div
              className="relative w-full rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center text-xs text-gray-500"
              style={{ aspectRatio: slot.aspectRatio }}
            >
              No new image selected
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="mt-3 flex items-center gap-2">
            {!pending ? (
              <button
                type="button"
                onClick={handlePickFile}
                className="bg-white/10 hover:bg-white/15 text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Choose image...
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-brand-orange hover:bg-orange-500 text-white font-heading uppercase
                             tracking-wider text-sm px-5 py-2 rounded-lg transition-colors
                             disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {saving
                    ? "Saving..."
                    : willCropSignificantly
                      ? "Replace anyway"
                      : "Replace"}
                </button>
                <button
                  type="button"
                  onClick={clearPending}
                  disabled={saving}
                  className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1"
                >
                  Cancel
                </button>
              </>
            )}
          </div>

          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}
