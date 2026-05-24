import { auth } from "@/lib/auth";
import { AdminUsersClient } from "@/components/admin/admin-users-client";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await auth();
  const currentEmail = session?.user?.email ?? "";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold uppercase text-white">
          Admin Users
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Anyone listed here can sign in to the admin section via magic link.
        </p>
      </div>
      <AdminUsersClient currentEmail={currentEmail} />
    </div>
  );
}
