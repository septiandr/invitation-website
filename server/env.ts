/**
 * Konfigurasi terpusat — SEMUA hardcoded di sini, tanpa file .env.
 * Kalau password Neon di-reset, ganti string DATABASE_URL di bawah.
 */
export const env = {
  DATABASE_URL:
    "postgresql://neondb_owner:npg_Mis7QVNoUP0n@ep-purple-cake-b3qxw84c-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  PORT: 3000,
  PUBLIC_APP_URL: "http://localhost:5173",
  EVENT_TIMEZONE: "Asia/Jakarta",
} as const;
