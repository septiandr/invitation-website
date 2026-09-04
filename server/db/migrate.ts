import { initDb } from "./client.js";

try {
  await initDb();
  console.log("Migration completed");
  process.exit(0);
} catch (e) {
  console.error("Migration failed:", e);
  process.exit(1);
}
