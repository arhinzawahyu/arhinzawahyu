import { useState, type FormEvent } from "react";

interface Props {
  mode: "masuk" | "daftar";
}

const TEKS_TOMBOL = {
  masuk: "Masuk",
  daftar: "Buat akun",
} as const;

export default function FormOtentikasi({ mode }: Props) {
  const [email, setEmail] = useState("");
  const [kataSandi, setKataSandi] = useState("");
  const [nama, setNama] = useState("");
  const [galat, setGalat] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [sibuk, setSibuk] = useState(false);

  async function kirim(e: FormEvent) {
    e.preventDefault();
    setGalat(null);
    setInfo(null);
    setSibuk(true);
    try {
      const jalur = mode === "masuk" ? "/api/auth/masuk" : "/api/auth/daftar";
      const isi = mode === "daftar" ? { email, kataSandi, nama } : { email, kataSandi };
      const res = await fetch(jalur, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(isi),
      });
      const data = await res.json();

      if (!res.ok) {
        setGalat(data.pesan ?? "Terjadi kesalahan. Coba lagi.");
        return;
      }
      if (data.arah) {
        window.location.assign(data.arah as string);
        return;
      }
      if (data.butuhVerifikasiEmail) {
        setInfo("Cek emailmu untuk tautan verifikasi, lalu masuk di sini.");
      }
    } catch {
      setGalat("Tidak dapat menghubungi server. Periksa koneksi.");
    } finally {
      setSibuk(false);
    }
  }

  return (
    <form onSubmit={kirim} className="flex w-full max-w-sm flex-col gap-4" noValidate={false}>
      {mode === "daftar" && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="nama" className="text-sm">Nama panggilan</label>
          <input
            id="nama"
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="misal: Rani"
            autoComplete="nickname"
            className="rounded-lg border border-ink/20 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="rounded-lg border border-ink/20 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="kataSandi" className="text-sm">Kata sandi</label>
        <input
          id="kataSandi"
          type="password"
          required
          minLength={8}
          value={kataSandi}
          onChange={(e) => setKataSandi(e.target.value)}
          autoComplete={mode === "masuk" ? "current-password" : "new-password"}
          className="rounded-lg border border-ink/20 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-accent"
        />
        {mode === "daftar" && (
          <p className="text-xs opacity-60">Minimal 8 karakter.</p>
        )}
      </div>

      {galat && (
        <p role="alert" className="rounded-lg border border-accent/40 px-3 py-2 text-sm text-accent">
          {galat}
        </p>
      )}
      {info && (
        <p role="status" className="rounded-lg border border-ink/20 px-3 py-2 text-sm opacity-90">
          {info}
        </p>
      )}

      <button
        type="submit"
        disabled={sibuk}
        className="mt-2 min-h-[44px] rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-base disabled:opacity-50"
      >
        {sibuk ? "Memproses..." : TEKS_TOMBOL[mode]}
      </button>

      <p className="mt-2 text-center text-xs opacity-70">
        {mode === "masuk" ? (
          <>
            Belum punya akun? <a href="/daftar" className="underline decoration-accent underline-offset-2">Buat akun</a>
          </>
        ) : (
          <>
            Sudah punya akun? <a href="/masuk" className="underline decoration-accent underline-offset-2">Masuk</a>
          </>
        )}
      </p>
    </form>
  );
}
