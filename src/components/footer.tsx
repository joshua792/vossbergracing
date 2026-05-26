"use client";

import { usePathname } from "next/navigation";
import { rider } from "@/config/rider";

export function Footer() {
  const pathname = usePathname();

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  return (
    <footer className="border-t border-white/5 bg-brand-dark">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-heading text-xl font-bold text-brand-orange">
            {rider.numberDisplay}
          </span>
          <span className="text-sm text-gray-500">
            {rider.fullName} &copy; {new Date().getFullYear()}
          </span>
        </div>
        <p className="text-xs text-gray-600">
          {rider.series} {rider.class} &middot; {rider.team}
        </p>
      </div>
    </footer>
  );
}
