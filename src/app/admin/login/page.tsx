import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import AdminSetupNotice from "@/components/admin/AdminSetupNotice";
import { getAdminSession } from "@/lib/admin-auth";

interface PageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const session = await getAdminSession();

  if (session.status === "ready") {
    redirect("/admin");
  }

  if (session.status === "missing-env") {
    return (
      <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f4f7f4] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg">
          <AdminSetupNotice />
        </div>
      </main>
    );
  }

  const message =
    params.error === "unauthorized"
      ? "Your account is authenticated but does not have the required administrative permissions in the database."
      : undefined;

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f4f7f4] flex flex-col items-center justify-center p-4 sm:p-6">
      <AdminLoginForm
        defaultEmail={session.user?.email ?? ""}
        message={message}
        canSignOut={session.status === "not-admin"}
      />
    </main>
  );
}
