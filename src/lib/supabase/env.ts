function readSupabaseEnv() {
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

function getMissingSupabaseEnv() {
  const env = readSupabaseEnv();

  return Object.entries(env)
    .filter(([, value]) => !value)
    .map(([key]) => key);
}

export function hasSupabaseEnv() {
  return getMissingSupabaseEnv().length === 0;
}

export function getSupabaseEnv() {
  const env = readSupabaseEnv();
  const missing = getMissingSupabaseEnv();

  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno de Supabase: ${missing.join(", ")}`);
  }

  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL as string,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  };
}
