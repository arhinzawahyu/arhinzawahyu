import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = import.meta.env.DATABASE_URL ?? "";

// prepare:false karena Supabase memakai connection pooler:
// prepared statement bisa bentrok antar koneksi pool.
export const client = postgres(connectionString, { prepare: false, max: 10 });
export const db = drizzle(client);
