import { neon } from "@neondatabase/serverless";
import { env } from "../env.js";

/**
 * Postgres serverless (Neon) via HTTP — driver murni JS, tanpa kompilasi
 * native sehingga `npm install` lolos di Vercel. Satu-satunya syarat:
 * env `DATABASE_URL` (postgres://...) terisi, lokal maupun production.
 */
const connectionString = env.DATABASE_URL || "";

if (!connectionString) {
  console.warn(
    "[db] DATABASE_URL kosong — endpoint API yang menyentuh DB akan 500. " +
      "Isi dengan connection string Neon (lihat .env.example)."
  );
}

type NeonClient = ReturnType<typeof neon>;
let cached: NeonClient | null = null;

/**
 * Lazy: `neon()` throw bila connection string kosong, jadi client hanya
 * dibuat saat query pertama. Tanpa DATABASE_URL, error ditangkap route
 * menjadi 500 rapi — server/health/static tetap hidup.
 */
export const sql = ((...args: unknown[]) => {
  if (!cached) {
    if (!connectionString) throw new Error("DATABASE_URL belum diisi.");
    cached = neon(connectionString);
  }
  return (cached as (...a: unknown[]) => unknown)(...args);
}) as NeonClient;

export async function initDb(): Promise<void> {
  // Satu perintah per query: driver HTTP Neon menyiapkan prepared statement
  // yang menolak multi-command dalam satu string.
  await sql`
    CREATE TABLE IF NOT EXISTS rsvps (
      id TEXT PRIMARY KEY,
      guest_name TEXT NOT NULL,
      attendance TEXT NOT NULL CHECK (attendance IN ('HADIR', 'TIDAK_HADIR')),
      guest_count INTEGER NOT NULL CHECK (guest_count BETWEEN 1 AND 10),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS wishes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS wishes_created_at_idx ON wishes (created_at DESC)`;
}
