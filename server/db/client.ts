import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = process.env.DATABASE_URL || "./data.db";
// allow DATABASE_URL like file:./data.db or ./data.db
const normalized = dbPath.replace(/^file:/, "");
const resolved = path.resolve(normalized);

const dir = path.dirname(resolved);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

export const db = new Database(resolved);

db.pragma("journal_mode = WAL");

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS rsvps (
      id TEXT PRIMARY KEY,
      guest_name TEXT NOT NULL,
      attendance TEXT NOT NULL CHECK (attendance IN ('HADIR', 'TIDAK_HADIR')),
      guest_count INTEGER NOT NULL CHECK (guest_count BETWEEN 1 AND 10),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS wishes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS wishes_created_at_idx ON wishes (created_at DESC);
  `);
}

initDb();
