import type { APIRoute } from "astro";
import { buatKlienSupabase, supabaseTerkonfigurasi } from "../../../lib/auth/server";
import { json } from "../../../lib/http";

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!supabaseTerkonfigurasi()) {
    return json({ status: "konfigurasi-kurang" }, 503);
  }
  const { error } = await buatKlienSupabase(request.headers.get("cookie"), cookies).auth.signOut();
  if (error) {
    return json({ status: "keluar-gagal", pesan: error.message }, 500);
  }
  return json({ status: "ok", arah: "/" });
};
