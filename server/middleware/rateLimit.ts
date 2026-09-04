import type { Request, Response, NextFunction } from "express";

type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

export function rateLimit({ windowMs, max, message }: { windowMs: number; max: number; message?: string }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || "unknown";
    const now = Date.now();
    let bucket = store.get(key);
    if (!bucket || now > bucket.resetAt) {
      bucket = { count: 0, resetAt: now + windowMs };
      store.set(key, bucket);
    }
    bucket.count += 1;
    if (bucket.count > max) {
      return res.status(429).json({
        error: {
          code: "RATE_LIMITED",
          message: message || "Terlalu banyak request. Coba lagi nanti.",
        },
      });
    }
    next();
  };
}

// cleanup every 10 min
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of store.entries()) if (now > v.resetAt) store.delete(k);
}, 10 * 60 * 1000);
