"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const callback = searchParams.get("callback");
  const email = searchParams.get("email");

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="text-6xl font-heading font-black text-brand-orange opacity-30 mb-4">
          #11
        </div>
        <h1 className="font-heading text-xl text-white mb-2">
          Confirm Sign In
        </h1>
        {email && (
          <p className="text-gray-400 text-sm mb-6">
            Signing in as{" "}
            <span className="text-brand-orange font-medium">{email}</span>
          </p>
        )}
        {callback ? (
          <a
            href={callback}
            className="inline-block rounded-lg bg-brand-orange px-8 py-3 text-base font-semibold
                       text-white hover:bg-orange-500 transition-colors"
          >
            Complete Sign In
          </a>
        ) : (
          <p className="text-red-400">Invalid or expired link.</p>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-dark flex items-center justify-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
