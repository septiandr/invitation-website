import { Router } from "express";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db/client.js";

export const wishesRouter = Router();

const wishSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter.").max(100, "Nama maksimal 100 karakter."),
  message: z.string().trim().min(1, "Pesan wajib diisi.").max(500, "Pesan maksimal 500 karakter."),
});

wishesRouter.get("/", (_req, res) => {
  try {
    const rows = db.prepare("SELECT id, name, message, created_at as createdAt FROM wishes ORDER BY datetime(created_at) DESC, rowid DESC").all() as Array<{
      id: string; name: string; message: string; createdAt: string;
    }>;
    // ensure ISO format
    const items = rows.map(r => ({
      id: r.id,
      name: r.name,
      message: r.message,
      createdAt: new Date(r.createdAt).toISOString(),
    }));
    return res.json({ items });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Gagal memuat wishes." } });
  }
});

wishesRouter.post("/", (req, res) => {
  const parsed = wishSchema.safeParse(req.body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    parsed.error.errors.forEach((e) => {
      fields[e.path[0] as string] = e.message;
    });
    return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Periksa kembali input Anda.", fields } });
  }

  const { name, message } = parsed.data;
  const id = uuidv4();
  const now = new Date().toISOString();

  try {
    const stmt = db.prepare("INSERT INTO wishes (id, name, message, created_at) VALUES (?, ?, ?, ?)");
    stmt.run(id, name.trim(), message.trim(), now);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Gagal menyimpan wishes." } });
  }

  return res.status(201).json({
    id,
    name: name.trim(),
    message: message.trim(),
    createdAt: now,
  });
});
