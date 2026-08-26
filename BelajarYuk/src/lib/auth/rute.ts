/** Penentu rute otentikasi, fungsi murni agar mudah diuji tanpa Astro/Supabase. */

const RUTE_PROTEKSI = ["/dashboard", "/chat", "/materi", "/onboarding"] as const;
const RUTE_ONTENTIKASI = ["/masuk", "/daftar"] as const;

/**
 * Mengembalikan tujuan redirect bila perlu, atau null bila boleh lanjut.
 * - Belum login menyentuh rute proteksi -> ke /masuk
 * - Sudah login membuka halaman otentikasi -> ke /dashboard
 */
export function tentukanRute(pathname: string, sesiAda: boolean): string | null {
  const jalur = pathname.replace(/\/+$/, "") || "/";

  const terproteksi = RUTE_PROTEKSI.some(
    (rute) => jalur === rute || jalur.startsWith(`${rute}/`),
  );
  if (!sesiAda && terproteksi) return "/masuk";
  if (sesiAda && (RUTE_ONTENTIKASI as readonly string[]).includes(jalur)) return "/dashboard";
  return null;
}
