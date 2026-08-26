import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { AstroCookies } from "astro";

/**
 * Adapter untuk @supabase/ssr.
 * Pembacaan memakai header "cookie" mentah karena AstroCookies tidak menyediakan
 * getAll(); penulisan tetap lewat AstroCookies agar terikat ke respons Astro.
 */
function adapterCookie(headerCookie: string | null, cookies: AstroCookies) {
  const pasangan = new Map<string, string>();
  if (headerCookie) {
    for (const bagian of headerCookie.split(";")) {
      const indeks = bagian.indexOf("=");
      if (indeks > 0) {
        pasangan.set(bagian.slice(0, indeks).trim(), bagian.slice(indeks + 1).trim());
      }
    }
  }

  return {
    getAll() {
      return Array.from(pasangan, ([name, value]) => ({ name, value }));
    },
    setAll(daftar: { name: string; value: string; options?: Record<string, unknown> }[]) {
      for (const { name, value, options } of daftar) {
        // try/catch sesuai anjuran dokumen @supabase/ssr untuk lingkungan SSR.
        try {
          cookies.set(name, value, { path: "/", ...options });
        } catch {
          /* diabaikan */
        }
      }
    },
  };
}

export function buatKlienSupabase(
  headerCookie: string | null,
  cookies: AstroCookies,
  url = import.meta.env.SUPABASE_URL,
  kunciAnon = import.meta.env.SUPABASE_ANON_KEY,
): SupabaseClient {
  return createServerClient(url as string, kunciAnon as string, {
    cookies: adapterCookie(headerCookie, cookies),
  });
}

export function supabaseTerkonfigurasi(): boolean {
  return Boolean(import.meta.env.SUPABASE_URL && import.meta.env.SUPABASE_ANON_KEY);
}

export type { SupabaseClient, User };
