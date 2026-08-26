import { date, integer, jsonb, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

/**
 * Skema Fase A (spesifikasi §8). Tabel Fase B/C (insights, materi, materi_chunks)
 * menyusul bersama tugasnya masing-masing.
 *
 * profiles.user_id memakai id user dari Supabase Auth (auth.users.id).
 * Di lokal tidak ada skema auth, jadi sengaja tanpa foreign key lintas skema;
 * FK dan RLS dipasang saat migrasi ke cloud.
 */

export const profiles = pgTable("profiles", {
  userId: text("user_id").primaryKey(),
  nama: text("nama"),
  personaJson: jsonb("persona_json").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const conversations = pgTable("conversations", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  judul: text("judul"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id")
    .notNull()
    .references(() => conversations.id),
  /** "user" atau "assistant" */
  peran: text("peran").notNull(),
  konten: text("konten").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const usageDaily = pgTable(
  "usage_daily",
  {
    userId: text("user_id").notNull(),
    tanggal: date("tanggal", { mode: "string" }).notNull(),
    jumlahPermintaan: integer("jumlah_permintaan").notNull().default(0),
  },
  (tabel) => [uniqueIndex("usage_daily_user_tanggal_unik").on(tabel.userId, tabel.tanggal)],
);
