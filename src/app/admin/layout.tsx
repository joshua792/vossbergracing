import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-brand-dark">
      <header className="bg-brand-dark-lighter border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-heading text-xl font-bold text-brand-orange">
              #11
            </Link>
            <span className="text-gray-500">/</span>
            <span className="font-heading text-sm uppercase tracking-widest text-white">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">{session.user?.email}</span>
            <form
              action={async () => {
                "use server";
                const { signOut } = await import("@/lib/auth");
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <AdminNav />
      {children}
    </div>
  );
}
