export default function TombolKeluar() {
  async function keluar() {
    // Content-type JSON eksplisit agar lolos pemeriksaan origin Astro dan
    // polanya konsisten dengan endpoint otentikasi lain.
    await fetch("/api/auth/keluar", {
      method: "POST",
      headers: { "content-type": "application/json" },
    });
    window.location.assign("/");
  }

  return (
    <button
      type="button"
      onClick={keluar}
      className="min-h-[44px] rounded-lg border border-ink/25 px-4 py-2 text-sm hover:border-accent hover:text-accent"
    >
      Keluar
    </button>
  );
}
