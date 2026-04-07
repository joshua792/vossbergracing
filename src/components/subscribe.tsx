"use client";

import { useState } from "react";

export function Subscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-20 bg-brand-dark" id="subscribe">
      <div className="max-w-xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-1 bg-brand-orange" />
          <span className="font-heading text-sm uppercase tracking-widest text-brand-orange">
            Stay Updated
          </span>
          <div className="w-12 h-1 bg-brand-orange" />
        </div>

        <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase mb-3">
          Keep in <span className="text-brand-orange">Touch</span>
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          Get race results and updates delivered straight to your inbox.
        </p>

        {status === "success" ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-6 py-4">
            <p className="text-green-400 font-medium">You&apos;re subscribed!</p>
            <p className="text-green-400/60 text-sm mt-1">
              We&apos;ll email you when there&apos;s a race update.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-base text-white
                         placeholder:text-gray-600
                         focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none"
            />
            <button
              type="submit"
              disabled={status === "loading" || !email}
              className="bg-brand-orange hover:bg-orange-500 text-white font-heading uppercase
                         tracking-wider text-sm px-8 py-3 rounded-lg transition-colors
                         disabled:bg-gray-600 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-red-400 text-sm mt-3">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  );
}
