import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { rsvpRouter } from "./routes/rsvps.js";
import { wishesRouter } from "./routes/wishes.js";
import { rateLimit } from "./middleware/rateLimit.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = Number(process.env.PORT || 3000);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: false }));

// request logging minimal
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/rsvps", rateLimit({ windowMs: 60_000, max: 30 }), rsvpRouter);
const wishRateLimit = rateLimit({ windowMs: 60_000, max: 20 });
app.use(
  "/api/wishes",
  (req, res, next) => {
    if (req.method === "POST") return wishRateLimit(req, res, next);
    next();
  },
  wishesRouter
);

// 404 for unknown api
app.use("/api", notFoundHandler);

// serve frontend static in production
const distPath = path.resolve(__dirname, "../../dist");
const altDistPath = path.resolve(__dirname, "../dist");
const staticPath = (() => {
  try {
    if (fs.existsSync(path.join(distPath, "index.html"))) return distPath;
    if (fs.existsSync(path.join(altDistPath, "index.html"))) return altDistPath;
    return distPath;
  } catch { return distPath; }
})();
app.use(express.static(staticPath));

// SPA fallback - serve index.html for non-api routes when dist exists
app.get("*", (_req, res, next) => {
  const index = path.join(staticPath, "index.html");
  res.sendFile(index, (err) => {
    if (err) next();
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
