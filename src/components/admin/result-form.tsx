"use client";

import { useState } from "react";

type Result = {
  id: string;
  date: string;
  track: string;
  qualifying: number;
  race1: number;
  race2: number | null;
  championship: number;
};

export function ResultForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial: Result | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    date: initial?.date ?? "",
    track: initial?.track ?? "",
    qualifying: initial?.qualifying ?? "",
    race1: initial?.race1 ?? "",
    race2: initial?.race2 ?? "",
    championship: initial?.championship ?? "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      date: form.date,
      track: form.track,
      qualifying: Number(form.qualifying),
      race1: Number(form.race1),
      race2: form.race2 ? Number(form.race2) : null,
      championship: Number(form.championship),
    };

    if (initial) {
      await fetch(`/api/results/${initial.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/results", {
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
      className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4"
    >
      <h3 className="font-heading text-lg font-bold uppercase text-white mb-4">
        {initial ? "Edit Result" : "Add Result"}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Date
          </label>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white
                       focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Track
          </label>
          <input
            type="text"
            required
            placeholder="Circuit of the Americas"
            value={form.track}
            onChange={(e) => setForm({ ...form, track: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white
                       placeholder:text-gray-600
                       focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Qualifying
          </label>
          <input
            type="number"
            required
            min="1"
            value={form.qualifying}
            onChange={(e) => setForm({ ...form, qualifying: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white
                       focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Race 1
          </label>
          <input
            type="number"
            required
            min="1"
            value={form.race1}
            onChange={(e) => setForm({ ...form, race1: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white
                       focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Race 2 <span className="text-gray-600">(opt)</span>
          </label>
          <input
            type="number"
            min="1"
            value={form.race2}
            onChange={(e) => setForm({ ...form, race2: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white
                       focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Championship
          </label>
          <input
            type="number"
            required
            min="1"
            value={form.championship}
            onChange={(e) =>
              setForm({ ...form, championship: e.target.value })
            }
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white
                       focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20 outline-none"
          />
        </div>
      </div>

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
          {saving ? "Saving..." : initial ? "Update" : "Add Result"}
        </button>
      </div>
    </form>
  );
}
