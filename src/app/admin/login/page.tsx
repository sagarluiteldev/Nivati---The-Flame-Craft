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
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f4eee4_0%,#FBFEF9_38%,#f2eee6_100%)] px-4 py-12 md:px-8">
        <div className="mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center">
          <AdminSetupNotice />
        </div>
      </main>
    );
  }

  const message =
    params.error === "unauthorized"
      ? "Your account is authenticated but does not have the required administrative permissions."
      : undefined;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f4eee4_0%,#FBFEF9_38%,#f2eee6_100%)] px-4 py-12 md:px-8">
      <div className="mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center">
        <AdminLoginForm
          defaultEmail={session.user?.email ?? ""}
          message={message}
          canSignOut={session.status === "not-admin"}
        />
      </div>
    </main>
  );
}

