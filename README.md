# Website Invitation — Ricky & Felly

Website undangan pernikahan publik dengan nuansa editorial, intimate & premium. Tamu dapat membuka cover, melihat countdown, detail acara, gallery, lokasi, mengirim RSVP dan wishes yang tersimpan persisten via API + SQLite.

Referensi visual: [Ricky + Felly Invitato](https://invitato.net/template-rickyfelly/?code=D3EC9693640) — dipakai untuk mood/art-direction, bukan pixel-perfect clone.

---

## 1. Cara Menjalankan Lokal

### Prereq
- Node.js 20+ (tested 22.16.0)
- npm 10+

### Install
```bash
npm install
```

### Environment
Copy `.env.example` ke `.env` (opsional — default SQLite file):
```
DATABASE_URL=./data.db
PORT=3000
PUBLIC_APP_URL=http://localhost:5173
EVENT_TIMEZONE=Asia/Jakarta
```

### Development (Vite + Express via proxy)
```bash
npm run dev
# client: http://localhost:5173
# server: http://localhost:3000  (diproduksi via proxy /api)
```
- `npm run dev:client` — Vite saja
- `npm run dev:server` — Express watch via `tsx`

### Production build + serve
```bash
npm run build          # vite build -> dist/
npm run build:server   # tsc server -> dist-server/
npm start              # serve dist via Express di PORT (default 3000)
```
Health check: `GET /api/health` → `{ status:"ok" }`

### Migration
SQLite otomatis dibuat saat server start (`server/db/client.ts: initDb`). Manual:
```bash
npm run migrate
```

### Verifikasi API
```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/wishes
curl -X POST http://localhost:3000/api/wishes -H "Content-Type: application/json" -d '{"name":"Budi","message":"Selamat!"}'
curl -X POST http://localhost:3000/api/rsvps -H "Content-Type: application/json" -d '{"guestName":"Budi","attendance":"HADIR","guestCount":2}'
```

---

## 2. Arsitektur

Single public web app — React + TypeScript (Vite), Express API, SQLite (better-sqlite3). Tanpa auth/dashboard di MVP.

```
Browser --HTTPS--> Frontend (React+TS) --JSON/HTTPS--> Backend Express --> SQLite (rsvps, wishes)
```

**Repository:**
```
assets/               # assessment pack (background.jpg + 1.png..10.png)
public/assets/        # served static copy untuk production
src/
  app/App.tsx
  app/eventConfig.ts  # single source of truth untuk konten acara
  components/Cover|Hero|Countdown|EventDetails|Gallery|Location|RsvpForm|Wishes|MusicControl
  hooks/useCountdown, useReveal
  lib/apiClient, validation, formatters
  styles/global.css   # design tokens
  types/
server/
  app.ts              # express, static serve, health
  routes/rsvps.ts, wishes.ts
  middleware/rateLimit, errorHandler
  db/client.ts, migrate.ts
```

**Tanggung jawab:**
- Frontend: render cover tanpa menunggu API, countdown client-side, lazy load wishes saat section masuk viewport, validasi cepat + disable double-submit, render plain text (no dangerouslySetInnerHTML).
- API: validasi zod, normalisasi trim, map error → `{ error:{code,message,fields}}`, rate-limit POST, payload limit 16kb.
- DB: file SQLite, WAL mode, migration idempoten, index `wishes(created_at DESC)`.

---

## 3. Environment

| Variable | Contoh | Keterangan |
|---|---|---|
| `DATABASE_URL` | `./data.db` atau `file:./data.db` | Path SQLite file |
| `PORT` | `3000` | Port Express |
| `PUBLIC_APP_URL` | `https://...` | URL publik untuk OG/metadata |
| `EVENT_TIMEZONE` | `Asia/Jakarta` | Digunakan di eventConfig + countdown |

Secret tidak dicommit; hanya `.env.example`.

---

## 4. Database

Schema (otomatis via `initDb`):

```sql
CREATE TABLE rsvps (
  id TEXT PRIMARY KEY,
  guest_name TEXT NOT NULL,
  attendance TEXT NOT NULL CHECK (attendance IN ('HADIR','TIDAK_HADIR')),
  guest_count INTEGER NOT NULL CHECK (guest_count BETWEEN 1 AND 10),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE wishes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX wishes_created_at_idx ON wishes (created_at DESC);
```

- `rsvps` & `wishes` append-only dari sisi pengguna.
- `guestCount` konsisten 1–10 untuk `HADIR` maupun `TIDAK_HADIR` (dipilih 1 sebagai jumlah kontak standar; tidak menggunakan 0 agar form tetap sederhana).
- `created_at` ISO string, di-order DESC untuk wishes terbaru dulu.

Untuk ganti ke Postgres di production, cukup ganti `DATABASE_URL` + adapt `db/client.ts` (saat ini SQLite untuk kemudahan assessment tanpa infra eksternal).

---

## 5. API Contract

Base `/api`, JSON.

- `POST /api/rsvps` → 201 `{id, guestName, attendance, guestCount, createdAt}` — 400 VALIDATION_ERROR, 429 RATE_LIMITED
- `GET /api/wishes` → 200 `{items:[{id,name,message,createdAt}]}` order DESC
- `POST /api/wishes` → 201 item tunggal
- `GET /api/health` → 200 `{status:"ok"}`
- Error: `{ error:{code, message, fields?} }` — code: VALIDATION_ERROR, NOT_FOUND, RATE_LIMITED, INTERNAL_ERROR

Frontend memakai satu `apiClient` dengan timeout 10s; tidak melakukan optimistic update — wishes baru prepend hanya setelah 201.

---

## 6. Deployment

Pipeline minimum:
1. `npm ci` (lockfile)
2. `npm run build && npm run build:server`
3. `npm run migrate` (idempoten)
4. `npm start` (Express serve `dist`)

Provider bebas (Vercel, Fly, Render, Railway, VPS). Pastikan `DATABASE_URL` persistent (volume mount untuk SQLite atau Postgres URL). Health check `GET /api/health`.

Untuk hosting terpisah (frontend CDN + API), set `vite.config.ts` proxy ke API URL production dan pastikan CORS.

---

## 7. Keputusan Teknis yang Dikunci

| # | Keputusan | Alasan |
|---|---|---|
|1| **Frontend Vite + React + TS** | Sesuai rekomendasi PRD, cepat untuk MVP 1–2 hari, HMR baik |
|2| **Backend Express + TS + Zod** | Sederhana, validasi terpusat, mudah di-deploy sebagai single Node service |
|3| **DB SQLite (better-sqlite3)** | Zero infra untuk assessment; file-based, WAL, migration mudah. Mudah swap ke Postgres via DATABASE_URL |
|4| **guestCount TIDAK_HADIR = 1–10 (default 1)** | Konsisten 1–10 di semua layer; tidak memakai 0 untuk menghindari cabang validasi. UX: tetap 1 sebagai “kontak” meski tidak hadir |
|5| **Wishes load on viewport + fallback 2s** | Sesuai ARCH opsi “ketika section masuk viewport”; fallback timer memastikan tetap load jika observer tidak trigger |
|6| **No optimistic wishes** | Hanya tampil setelah 201 agar tidak menampilkan data gagal simpan |
|7| **Asset mapping terdokumentasi di eventConfig.ts** | background.jpg → cover, 1.png portrait hero, 5–10.png landscape gallery; pakai `object-position` per gambar + `alt` deskriptif |

---

## 8. Visual Direction

- Fonts: Cormorant Garamond (display) + DM Sans (body) via Google Fonts, `font-display:swap`.
- Tokens: `--color-ink #1b1b1b`, `--color-paper #f3f0eb`, `--color-accent #b28a62`, spacing section `clamp(72px,12vw,160px)`, container `min(100%-32px,1120px)`.
- Cover: full-bleed background.jpg + overlay gelap, CTA “Buka Undangan” sebagai focal point, entrance `fadeUp` 500–900ms `cubic-bezier(0.22,1,0.36,1)`.
- Reveal: `opacity+translateY(20px)` via IntersectionObserver, hormati `prefers-reduced-motion`.
- Gallery: 12-col grid desktop, 2-col mobile, lazy `loading="lazy"`, explicit `aspect-ratio`.

---

## 9. Testing Strategy (manual + smoke)

- Unit (validator, countdown formatter, error mapper) — zod schema tested via API negative case.
- Component: loading/error/success, countdown past, reduced-motion.
- Integration: POST RSVP invalid tidak tersimpan, GET/POST wishes persistency diverifikasi via curl + refresh.
- Smoke/E2E: buka cover → scroll → submit RSVP → submit wishes → refresh → wishes tetap ada.
- Responsive: diuji 320, 375, 768, 1024, 1440 — tidak boleh overflow horizontal.

---

## 10. Disclosure AI Tools

Implementasi dibantu oleh **Muse Spark (opencode/muse-spark-1.2)** sebagai coding agent untuk scaffolding, komponen, API, dan dokumentasi. Seluruh output ditinjau, di-build, dan diuji manual (curl, `npm run build`, production serve) sebelum diserahkan. Asset pack hanya dipakai untuk assessment dan tidak dipublikasikan ulang.

---

## 11. Lisensi Asset

Asset `assets/` hanya untuk assessment/hometask seleksi Invitato dan tidak untuk publikasi ulang di luar konteks tersebut.
