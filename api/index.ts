/**
 * Entry serverless Vercel: teruskan SEMUA request (API + static + SPA
 * fallback) ke aplikasi Express. Lihat vercel.json (rewrites + includeFiles).
 */
import app from "../dist-server/server/app.js";

export default app;
