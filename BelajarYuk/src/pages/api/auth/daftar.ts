import type { APIRoute } from "astro";
import { buatKlienSupabase, supabaseTerkonfigurasi } from "../../../lib/auth/server";
import { pastikanProfil } from "../../../lib/auth/profil";
import { bacaJson, emailValid, json, kataSandiValid } from "../../../lib/http";

export const POST: APIRoute = async ({ request, cookies }) => {
  const isi = await bacaJson<{ email?: string; kataSandi?: string; nama?: string }>(request);
  if (!isi || !emailValid(isi.email) || !kataSandiValid(isi.kataSandi)) {
    return json({ status: "input-tak-valid", pesan: "Email harus valid dan kata sandi minimal 8 karakter." }, 400);
  }
  if (!supabaseTerkonfigurasi()) {
    return json(
      { status: "konfigurasi-kurang", kunci_kurang: ["SUPABASE_URL", "SUPABASE_ANON_KEY"] },
      503,
    );
  }

  const supabase = buatKlienSupabase(request.headers.get("cookie"), cookies);
  const { data, error } = await supabase.auth.signUp({
    email: isi.email,
    password: isi.kataSandi,
    options: { data: isi.nama ? { nama: isi.nama } : undefined },
  });

  if (error) {
    return json({ status: "daftar-gagal", pesan: error.message }, 400);
  }

  if (data.user) {
    await pastikanProfil(data.user.id, isi.nama ?? null);
  }

  return json({
    status: "ok",
    butuhVerifikasiEmail: !data.session,
    // Sementara ke /dashboard; diganti /onboarding saat Task 4 selesai.
    arah: data.session ? "/dashboard" : null,
  });
};
