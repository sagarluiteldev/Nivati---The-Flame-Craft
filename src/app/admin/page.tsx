import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminSetupNotice from "@/components/admin/AdminSetupNotice";
import { requireAdminSession } from "@/lib/admin-auth";
import { getAdminCatalogProducts } from "@/lib/catalog-server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export default async function AdminPage() {
  if (!hasSupabaseEnv()) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f4eee4_0%,#f9f7f2_38%,#f2eee6_100%)] px-4 py-12 md:px-8">
        <div className="mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center">
          <AdminSetupNotice />
        </div>
      </main>
    );
  }

  const session = await requireAdminSession();
  const { products, errorMessage } = await getAdminCatalogProducts(session.supabase);

  return (
    <AdminDashboard
      adminEmail={session.user?.email ?? session.adminRecord?.email ?? "Admin"}
      initialProducts={products}
      dataError={errorMessage}
    />
  );
}
