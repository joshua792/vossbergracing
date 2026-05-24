"use client";

import { useEffect, useState } from "react";

type Admin = {
  id: string;
  email: string;
  addedBy: string | null;
  createdAt: string;
};

export function AdminUsersClient({ currentEmail }: { currentEmail: string }) {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchAdmins() {
    const res = await fetch("/api/admins");
    const data = await res.json();
    setAdmins(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchAdmins();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await fetch("/api/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const { error: msg } = await res.json().catch(() => ({ error: "" }));
      setError(msg || "Failed to add admin");
      return;
    }
    setEmail("");
    fetchAdmins();
  }

  async function handleRemove(admin: Admin) {
    if (!confirm(`Remove admin access for ${admin.email}?`)) return;
    const res = await fetch(`/api/admins/${admin.id}`, { method: "DELETE" });
    if (!res.ok) {
      const { error: msg } = await res.json().catch(() => ({ error: "" }));
      alert(msg || "Failed to remove admin");
      return;
    }
    fetchAdmins();
  }

  return (
    <>
      <form
        onSubmit={handleAdd}
        className="bg-white/5 border border-white/10 rounded-lg p-5 mb-8"
      >
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Add admin
        </label>
        <div className="flex gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white
                       placeholder:text-gray-600
                       focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20 outline-none"
          />
          <button
            type="submit"
            disabled={submitting || !email}
            className="bg-brand-orange hover:bg-orange-500 text-white font-heading uppercase
                       tracking-wider text-sm px-5 py-2 rounded-lg transition-colors
                       disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {submitting ? "Adding..." : "Add"}
          </button>
        </div>
        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
      </form>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : admins.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No admins yet.</p>
      ) : (
        <div className="space-y-2">
          {admins.map((admin) => {
            const isSelf =
              admin.email.toLowerCase() === currentEmail.toLowerCase();
            return (
              <div
                key={admin.id}
                className="bg-white/5 border border-white/5 rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-white">
                    {admin.email}
                    {isSelf && (
                      <span className="ml-2 text-[10px] uppercase tracking-wider bg-brand-blue/20 text-brand-blue px-2 py-0.5 rounded">
                        You
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Added{" "}
                    {new Date(admin.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {admin.addedBy && admin.addedBy !== "seed" && (
                      <> &middot; by {admin.addedBy}</>
                    )}
                    {admin.addedBy === "seed" && (
                      <> &middot; from ADMIN_EMAILS</>
                    )}
                  </p>
                </div>
                {!isSelf && (
                  <button
                    onClick={() => handleRemove(admin)}
                    className="text-xs text-gray-400 hover:text-red-400 transition-colors px-3 py-1"
                  >
                    Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
