"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Results" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/images", label: "Images" },
  { href: "/admin/sponsors", label: "Sponsors" },
  { href: "/admin/users", label: "Users" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-brand-dark border-b border-white/5">
      <div className="max-w-4xl mx-auto px-4 flex items-center gap-6 h-10">
        {links.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs font-heading uppercase tracking-widest transition-colors ${
                isActive ? "text-brand-orange" : "text-gray-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
