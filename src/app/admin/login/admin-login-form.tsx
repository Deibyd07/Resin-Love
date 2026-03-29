"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextPath = searchParams.get("next") || "/admin";

  async function onSubmit(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setLoading(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-semibold text-on-surface">
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-2xl border border-surface-variant bg-surface px-4 py-3 text-on-surface outline-none transition-colors placeholder:text-on-surface-variant focus:border-primary"
          placeholder="duena@resinlove.co"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-semibold text-on-surface">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-2xl border border-surface-variant bg-surface px-4 py-3 text-on-surface outline-none transition-colors placeholder:text-on-surface-variant focus:border-primary"
          placeholder="********"
        />
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-primary px-4 py-3 font-bold text-on-primary transition-transform disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Ingresando..." : "Entrar al panel"}
      </button>
    </form>
  );
}
