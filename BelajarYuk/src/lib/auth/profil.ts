import { db } from "../db";
import { profiles } from "../db/schema";
import { PROFIL_DEFAULT } from "../kuis/skor";

/**
 * Memastikan baris profil ada untuk user; dipanggil saat daftar maupun masuk.
 * Persona diisi PROFIL_DEFAULT sampai pengguna menyelesaikan kuis onboarding.
 */
export async function pastikanProfil(userId: string, nama?: string | null): Promise<void> {
  await db
    .insert(profiles)
    .values({
      userId,
      nama: nama ?? null,
      personaJson: PROFIL_DEFAULT,
    })
    .onConflictDoNothing({ target: profiles.userId });
}
