import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/app/admin/login/admin-login-form";
import { getAdminSession } from "@/lib/supabase/admin";

export default async function AdminLoginPage() {
  const { user, isAdmin } = await getAdminSession();

  if (user && isAdmin) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-surface px-4 py-16">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-surface-variant bg-surface-container-low p-6 shadow-sm md:p-8">
        <h1 className="mb-2 font-headline text-4xl font-black text-on-surface">Acceso Admin</h1>
        <p className="mb-6 text-on-surface-variant">Solo la dueña puede administrar productos.</p>
        <AdminLoginForm />
      </div>
    </main>
  );
}
