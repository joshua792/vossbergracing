"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await signIn("resend", { email, redirect: false });
      if (result?.error) {
        setError("Failed to send sign-in email. Please try again.");
      } else {
        setEmailSent(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-6xl font-heading font-black text-brand-orange opacity-30 mb-2">
            #11
          </div>
          <h1 className="font-heading text-2xl text-white tracking-wide uppercase">
            RF11 Admin
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Sign in to manage race results.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur rounded-lg border border-white/10 p-6">
          {emailSent ? (
            <div className="text-center py-4">
              <p className="text-base font-semibold text-white">
                Check your email
              </p>
              <p className="text-sm text-gray-400 mt-2">
                We sent a sign-in link to{" "}
                <span className="font-medium text-brand-orange">{email}</span>
              </p>
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
                className="mt-4 text-sm text-brand-orange hover:text-orange-300 font-medium"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoFocus
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-base text-white
                             placeholder:text-gray-500
                             focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full rounded-lg bg-brand-orange px-4 py-3 text-base font-semibold
                           text-white hover:bg-orange-500 transition-colors
                           disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {loading ? "Sending link..." : "Sign in with Email"}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            &larr; Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
