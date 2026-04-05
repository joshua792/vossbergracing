"use client";

import { useState, useEffect } from "react";
import { ResultForm } from "@/components/admin/result-form";

type Result = {
  id: string;
  date: string;
  track: string;
  qualifying: number;
  race1: number;
  race2: number | null;
  championship: number;
};

export default function AdminPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Result | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function fetchResults() {
    const res = await fetch("/api/results");
    const data = await res.json();
    setResults(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchResults();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this result?")) return;
    await fetch(`/api/results/${id}`, { method: "DELETE" });
    fetchResults();
  }

  function handleEdit(result: Result) {
    setEditing(result);
    setShowForm(true);
  }

  function handleSaved() {
    setShowForm(false);
    setEditing(null);
    fetchResults();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl font-bold uppercase text-white">
          Race Results
        </h1>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="bg-brand-orange hover:bg-orange-500 text-white font-heading uppercase
                     tracking-wider text-sm px-6 py-2 rounded-lg transition-colors"
        >
          + Add Result
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <ResultForm
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
      ) : results.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          No results yet. Add your first race result above.
        </p>
      ) : (
        <div className="space-y-3">
          {results.map((result) => (
            <div
              key={result.id}
              className="bg-white/5 border border-white/5 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div>
                  <h3 className="font-medium text-white">{result.track}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(result.date + "T00:00:00").toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-3 text-sm">
                  <span className="text-gray-400">
                    Q: <span className="text-brand-blue font-bold">{result.qualifying}</span>
                  </span>
                  <span className="text-gray-400">
                    R1: <span className="text-brand-orange font-bold">{result.race1}</span>
                  </span>
                  <span className="text-gray-400">
                    R2:{" "}
                    <span className="text-brand-orange font-bold">
                      {result.race2 ?? "—"}
                    </span>
                  </span>
                  <span className="text-gray-400">
                    Champ: <span className="text-white font-bold">{result.championship}</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(result)}
                  className="text-xs text-gray-400 hover:text-brand-orange transition-colors px-3 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(result.id)}
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
