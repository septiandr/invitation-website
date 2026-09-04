import { Router } from "express";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db/client.js";

export const rsvpRouter = Router();

const rsvpSchema = z.object({
  guestName: z.string().trim().min(2, "Nama minimal 2 karakter.").max(100, "Nama maksimal 100 karakter."),
  attendance: z.enum(["HADIR", "TIDAK_HADIR"]),
  guestCount: z.number().int().min(1, "Minimal 1 orang.").max(10, "Maksimal 10 orang."),
});

rsvpRouter.post("/", (req, res) => {
  const parsed = rsvpSchema.safeParse(req.body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    parsed.error.errors.forEach((e) => {
      const k = e.path[0] as string;
      fields[k] = e.message;
    });
    return res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "Periksa kembali input Anda.", fields },
    });
  }

  const { guestName, attendance, guestCount } = parsed.data;
  const id = uuidv4();
  const now = new Date().toISOString();

  try {
    const stmt = db.prepare(
      "INSERT INTO rsvps (id, guest_name, attendance, guest_count, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    );
    stmt.run(id, guestName.trim(), attendance, guestCount, now, now);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Gagal menyimpan RSVP." } });
  }

  return res.status(201).json({
    id,
    guestName: guestName.trim(),
    attendance,
    guestCount,
    createdAt: now,
  });
});
