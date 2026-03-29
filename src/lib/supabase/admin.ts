import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAdminSession() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, isAdmin: false };
  }

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("es_admin")
    .eq("id", user.id)
    .maybeSingle();

  return {
    user,
    isAdmin: Boolean(perfil?.es_admin),
  };
}

export async function requireAdmin(redirectTo = "/admin/login") {
  const session = await getAdminSession();

  if (!session.user || !session.isAdmin) {
    redirect(redirectTo);
  }

  return session;
}