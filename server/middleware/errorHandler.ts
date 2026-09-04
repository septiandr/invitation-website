import type { Request, Response, NextFunction } from "express";

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: { code: "NOT_FOUND", message: "Route tidak ditemukan." } });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error("[error]", err);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server." } });
}
