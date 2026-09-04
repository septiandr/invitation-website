import { z } from "zod";

export const rsvpClientSchema = z.object({
  guestName: z.string().trim().min(2, "Nama minimal 2 karakter.").max(100, "Nama maksimal 100 karakter."),
  attendance: z.enum(["HADIR", "TIDAK_HADIR"], { required_error: "Pilih status kehadiran." }),
  guestCount: z.coerce.number().int().min(1, "Minimal 1 orang.").max(10, "Maksimal 10 orang."),
});

export const wishClientSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter.").max(100, "Nama maksimal 100 karakter."),
  message: z.string().trim().min(1, "Pesan wajib diisi.").max(500, "Pesan maksimal 500 karakter."),
});

export type RsvpClientInput = z.infer<typeof rsvpClientSchema>;
export type WishClientInput = z.infer<typeof wishClientSchema>;
