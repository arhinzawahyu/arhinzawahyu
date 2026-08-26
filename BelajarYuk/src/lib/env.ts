export const KUNCI_ENV_WAJIB = [
  "DATABASE_URL",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "GEMINI_API_KEY",
] as const;

/** Daftar kunci environment yang belum terisi, untuk pesan konfigurasi yang jujur. */
export function missingEnvKeys(
  env: Record<string, string | undefined> = import.meta.env as unknown as Record<string, string | undefined>,
): string[] {
  return KUNCI_ENV_WAJIB.filter((kunci) => !env[kunci]);
}
