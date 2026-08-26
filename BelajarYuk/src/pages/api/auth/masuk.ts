import type { APIRoute } from "astro";
import { buatKlienSupabase, supabaseTerkonfigurasi } from "../../../lib/auth/server";
import { pastikanProfil } from "../../../lib/auth/profil";
import { bacaJson, emailValid, json, kataSandiValid } from "../../../lib/http";

export const POST: APIRoute = async ({ request, cookies }) => {
  const isi = await bacaJson<{ email?: string; kataSandi?: string }>(request);
  if (!isi || !emailValid(isi.email) || !kataSandiValid(isi.kataSandi)) {
    return json({ status: "input-tak-valid", pesan: "Email dan kata sandi wajib diisi." }, 400);
  }
  if (!supabaseTerkonfigurasi()) {
    return json(
      { status: "konfigurasi-kurang", kunci_kurang: ["SUPABASE_URL", "SUPABASE_ANON_KEY"] },
      503,
    );
  }

  const supabase = buatKlienSupabase(request.headers.get("cookie"), cookies);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: isi.email,
    password: isi.kataSandi,
  });

  if (error) {
    return json({ status: "masuk-gagal", pesan: "Email atau kata sandi salah." }, 401);
  }

  if (data.user) {
    // Nama tidak tersedia di sesi; cukup pastikan baris profilnya ada.
    await pastikanProfil(data.user.id, null);
  }

  return json({ status: "ok", arah: "/dashboard" });
};
