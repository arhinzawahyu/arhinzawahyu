import type { APIRoute } from "astro";
import { sql } from "drizzle-orm";
import { db } from "../../lib/db";
import { missingEnvKeys } from "../../lib/env";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export const GET: APIRoute = async () => {
  const kunciKurang = missingEnvKeys();

  if (!import.meta.env.DATABASE_URL) {
    return json({ status: "konfigurasi-kurang", kunci_kurang: kunciKurang }, 503);
  }

  try {
    await db.execute(sql`select 1`);
    return json({ status: "ok", db: true, kunci_kurang: kunciKurang }, 200);
  } catch (error) {
    console.error("[health] ping database gagal:", error);
    return json({ status: "db-gagal", kunci_kurang: kunciKurang }, 500);
  }
};
