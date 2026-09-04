# Website Invitation — Ricky & Felly

Website undangan pernikahan publik dengan nuansa editorial, intimate & premium. Tamu dapat membuka cover, melihat countdown, detail acara, gallery, lokasi, mengirim RSVP dan wishes yang tersimpan persisten via API + SQLite.

Referensi visual: [Ricky + Felly Invitato](https://invitato.net/template-rickyfelly/?code=D3EC9693640) — dipakai untuk mood/art-direction, bukan pixel-perfect clone.

---

## 1. Teknologi

| Lapisan | Teknologi | Keterangan |
|---|---|---|
| Build/dev | **Vite 6** + `@vitejs/plugin-react` | Dev server + HMR, proxy `/api` → Express saat dev |
| Frontend | **React 18 + TypeScript** | Satu halaman long-scroll, state lokal per fitur |
| Animasi | **GSAP 3 + ScrollTrigger + ScrollToPlugin** | Entrance cover, reveal on-scroll, transisi buka undangan, fade slide gallery |
| Backend | **Express 4 + TypeScript** (`tsx` untuk dev/watch) | Satu service Node, serve `dist/` + API |
| Validasi | **Zod** (client + server, skema kembar) | Aturan identik di `src/lib/validation.ts` dan `server/routes/*` |
| Database | **SQLite via better-sqlite3** (WAL) | Zero-infra, file lokal, migration idempoten |
| ID | **uuid v4** | Primary key `rsvps`/`wishes` |
| Font | Google Fonts: **Marcellus** (display), **Cormorant Upright** (body), **Great Vibes** (script), **Jost** (UI) | `font-display: swap` |
| Concurrency dev | `concurrently` | `npm run dev` = Vite + Express sekaligus |

Alasan pemilihan: stack ini menyelesaikan slice end-to-end (frontend → API → DB) dalam 1–2 hari tanpa infra eksternal, sesuai rekomendasi PRD (React+TS) dan batasan assessment (asset pack lokal, tanpa layanan pihak ketiga wajib).

---

## 2. Cara Menjalankan Lokal

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
# server: http://localhost:3000  (diproduksi via proxy /api, lihat vite.config.ts)
```
- `npm run dev:client` — Vite saja
- `npm run dev:server` — Express watch via `tsx`

### Production build + serve
```bash
npm run build          # tsc --noEmit + vite build -> dist/
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

## 3. Arsitektur & Struktur Teknis

Single public web app — tanpa auth/dashboard di MVP.

```
Browser --HTTPS--> Frontend (React+TS)
                        --JSON/HTTPS--> Backend Express --> SQLite (rsvps, wishes)
```

**Repository:**
```
public/assets/        # aset statis yang di-serve (background, 1.png..10.png, bg-music)
src/
  app/App.tsx                 # komposisi + state isOpened (±70 baris, logika di hooks)
  app/eventConfig.ts          # single source of truth konten acara + pemetaan aset
  components/
    Cover/                    # gerbang 100svh + timeline entrance GSAP
    Hero/                     # sapaan + visual berlapis
    Countdown/                # hitung mundur client-side
    EventDetails/             # agenda + tombol maps/calendar
    Gallery/                  # carousel autoplay + swipe + fade per slide
    PreWedding/               # embed YouTube + kartu live streaming
    Location/                 # info venue + embed maps + fallback link
    RsvpForm/  Wishes/        # form + state loading/success/error
    MusicControl/             # <audio> persisten + tombol pill
    FloatingChrome/           # drawer nav + bottom bar (menu|musik|bahasa)
    DesktopBanner/            # banner foto kiri di layar ≥1200px
    InvitationSections.tsx    # OpeningQuote, CoupleProfile, WeddingGift, GuestQr, Closing (+LoveStory opsional)
  hooks/
    useCountdown.ts           # tick 1 detik dari eventDate
    useScrollAnims.ts         # sistem animasi scroll (setup imperatif + flush)
    useCoverTransition.ts     # kunci scroll + auto-scroll + hapus cover
  lib/
    anim.ts                   # helper DOM murni: ownsText/isMedia/isSkippable/isHeading,
                              # staggerFor/inViewport/collectSection
    audio.ts                  # unlockBackgroundMusic() sinkron dalam gesture klik
    apiClient.ts              # satu client fetch (timeout 10s) + parser error
    validation.ts             # skema zod client (cerminan server)
    formatters.ts             # getCountdown()
    i18n.ts                   # ?lang=id|en (reload), ?guest= untuk nama tamu
  styles/global.css           # design tokens + chrome-bar responsif
  types/                      # RsvpPayload, Wish, ApiError, ...
server/
  app.ts                      # express, JSON limit 16kb, rate-limit, static dist, SPA fallback, health
  routes/rsvps.ts, wishes.ts  # validasi zod → normalisasi trim → INSERT → 201/400/500
  middleware/rateLimit.ts      # in-memory per-IP (rsvps 30/menit, wishes POST 20/menit)
  middleware/errorHandler.ts  # NOT_FOUND + INTERNAL_ERROR konsisten
  db/client.ts, migrate.ts    # SQLite WAL + initDb idempoten
```

**Tanggung jawab:**
- Frontend: render cover tanpa menunggu API, countdown client-side, wishes dimuat saat section masuk viewport (fallback timer 2s), validasi cepat + cegah double-submit, render plain text (tanpa `dangerouslySetInnerHTML`).
- API: validasi zod ulang, normalisasi trim, map error → `{ error:{code,message,fields} }`, rate-limit POST, payload limit 16kb.
- DB: file SQLite mode WAL, migration idempoten, index `wishes(created_at DESC)`.

---

## 4. Teknis Animasi & Interaksi (GSAP)

### 4.1 Transisi cover → konten (`useCoverTransition`)
1. Sebelum dibuka, `body overflow: hidden` — cover 100svh menjadi layar pertama.
2. Saat klik **Buka Undangan**: musik diputar **sinkron** dalam gesture (`lib/audio.ts`, syarat iOS Safari), lalu `setupAnims()` dipasang **selagi viewport masih tertutup cover opaque** — me-hide hero di titik ini tidak terlihat, jadi tidak ada blink.
3. Auto-scroll 2.2s (`ScrollToPlugin`, `power2.inOut`) ke hero; target diukur sesaat sebelum scroll agar tidak basi oleh font/gambar yang telat load.
4. `hideCover`: hapus cover dari layout + kompensasi scroll dengan **tinggi cover aktual** (`scrollY - coverHeight`, kebal layout shift), lalu `flushAnims()` + `ScrollTrigger.refresh()` (murni kalkulasi ulang).

### 4.2 Sistem reveal on-scroll (`useScrollAnims` + `lib/anim`)
`collectSection(root)` mengklasifikasi tiap section menjadi:
- **teks** (judul/paragraf/label/tombol, termasuk isi form) → blur + rise `y:36`, stagger adaptif (total ≤ 0.7s),
- **media** (`img/iframe/video`, termasuk foto mempelai di dalam kartu & thumbnail gallery) → zoom `scale 1.08→1`,
- **grup kartu** → tilt 3D `rotateX` **per item dengan trigger sendiri**: kartu mempelai pria main saat masuk, mempelai wanita belakangan; tiap wishes juga trigger sendiri.

Trigger memakai `toggleActions: "play none none reverse"` (berulang tiap re-enter). Konten dinamis (wishes hasil fetch/submit) ditangani `MutationObserver`: yang terlihat langsung fade-in, yang di bawah lipatan dibuatkan trigger — dengan antrean (`pending`) + penundaan refresh selama auto-scroll pembuka agar scroll tetap mulus.

Tambahan: Cover punya timeline entrance sendiri (bg zoom `1.15→1` + teks stagger blur), Gallery fade + zoom tiap ganti slide.

### 4.3 Floating chrome (menu | musik | bahasa)
Satu `.chrome-bar` fixed: lingkaran menu 44px | spacer | pil musik | pil bahasa 44px. Tidak menelan tap konten (`pointer-events` hanya di tombol), aman dari home indicator (`env(safe-area-inset-bottom)`), hint musik disembunyikan di layar <420px, dan di desktop (≥1200px) bar dikunci selebar kolom undangan kanan. Drawer navigasi (`z:69`) selalu di atas bar dengan tombol tutup sendiri. Saat scroll mencapai ujung bawah, bar meluncur turun (sentinel + `IntersectionObserver`) agar strip footer tidak tertutup.

### 4.4 Detail lain
- **i18n**: `?lang=id|en` (ganti bahasa = reload URL), teks via helper `t(lang, id, en)`; nama tamu dari `?guest=`/`?code=`/`?to=`.
- **Countdown**: murni client-side dari `eventConfig.eventDate` (ISO + timezone), state bermakna bila lewat waktu.
- **Wishes**: tanpa optimistic update — item baru prepend hanya setelah 201; pesan dirender sebagai plain text.
- **Desktop**: layout 2 kolom (banner foto fixed kiri + kolom undangan kanan 340–480px) di ≥1200px, kolom tunggal terpusat di bawahnya.

---

## 5. Environment

| Variable | Contoh | Keterangan |
|---|---|---|
| `DATABASE_URL` | `./data.db` atau `file:./data.db` | Path SQLite file |
| `PORT` | `3000` | Port Express |
| `PUBLIC_APP_URL` | `https://...` | URL publik untuk OG/metadata |
| `EVENT_TIMEZONE` | `Asia/Jakarta` | Digunakan di eventConfig + countdown |

Secret tidak dicommit; hanya `.env.example`.

---

## 6. Database

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
- `guestCount` konsisten 1–10 untuk `HADIR` maupun `TIDAK_HADIR` (default 1 sebagai jumlah kontak standar; tidak memakai 0 agar form tetap sederhana).
- `created_at` ISO string, wishes di-order DESC (terbaru dulu, tie-break `rowid`).

Untuk ganti ke Postgres di production, cukup ganti `DATABASE_URL` + adapt `db/client.ts` (saat ini SQLite untuk kemudahan assessment tanpa infra eksternal).

---

## 7. API Contract

Base `/api`, JSON.

- `POST /api/rsvps` → 201 `{id, guestName, attendance, guestCount, createdAt}` — 400 VALIDATION_ERROR (+`fields`), 429 RATE_LIMITED
- `GET /api/wishes` → 200 `{items:[{id,name,message,createdAt}]}` order DESC
- `POST /api/wishes` → 201 item tunggal
- `GET /api/health` → 200 `{status:"ok"}`
- Error: `{ error:{code, message, fields?} }` — code: VALIDATION_ERROR, NOT_FOUND, RATE_LIMITED, INTERNAL_ERROR

Frontend memakai satu `apiClient` dengan timeout 10s; tidak melakukan optimistic update — wishes baru prepend hanya setelah 201.

---

## 8. Deployment

Pipeline minimum:
1. `npm ci` (lockfile)
2. `npm run build && npm run build:server`
3. `npm run migrate` (idempoten)
4. `npm start` (Express serve `dist` + SPA fallback)

Provider bebas (Vercel, Fly, Render, Railway, VPS). Pastikan `DATABASE_URL` persistent (volume mount untuk SQLite atau Postgres URL). Health check `GET /api/health`.

Untuk hosting terpisah (frontend CDN + API), set proxy `vite.config.ts` ke API URL production dan pastikan CORS.

---

## 9. Keputusan Teknis yang Dikunci

| # | Keputusan | Alasan |
|---|---|---|
|1| **Frontend Vite + React + TS** | Sesuai rekomendasi PRD, cepat untuk MVP 1–2 hari, HMR baik |
|2| **Backend Express + TS + Zod** | Sederhana, validasi terpusat, mudah di-deploy sebagai single Node service |
|3| **DB SQLite (better-sqlite3)** | Zero infra untuk assessment; file-based, WAL, migration mudah. Mudah swap ke Postgres via DATABASE_URL |
|4| **Animasi GSAP ScrollTrigger (bukan IO manual)** | Butuh orkestrasi stagger/tilt/scrub per grup + habits anti-blink pada transisi cover; satu sesi `gsap.context` mudah di-revert |
|5| **Setup trigger saat klik (di balik cover)** | Me-hide hero selagi tertutup = tanpa blink; hero ikut entrance saat auto-scroll lewat; posisi trigger final setelah cover hilang |
|6| **Trigger per kartu, bukan per section** | Kartu mempelai wanita & tiap wishes animasi saat masuk viewport, bukan sekaligus di awal section |
|7| **guestCount TIDAK_HADIR = 1–10 (default 1)** | Konsisten 1–10 di semua layer; tidak memakai 0 untuk menghindari cabang validasi |
|8| **Wishes load on viewport + fallback 2s, tanpa optimistic update** | Tetap load bila observer tak trigger; hanya tampil setelah 201 agar tak menampilkan data gagal simpan |
|9| **Single chrome-bar + sentinel footer** | Tiga tombol fixed manual terbukti tabrakan di 320px; satu flex bar + docking kolom desktop + auto-hide di ujung = proporsional & tak menutup footer |
|10| **Pemetaan aset di eventConfig.ts** | Cover `1.png`, countdown `7.png` + overlay hitam 45%, gallery `1–5.png`, footer `10.png`; `object-position` per gambar + `alt` deskriptif |

---

## 10. Visual Direction (aktual)

- Font via Google Fonts (`font-display: swap`): **Marcellus** (`--font-display`, nama & heading), **Cormorant Upright** (`--font-body`), **Great Vibes** (`--font-script`, aksen "and"), **Jost** (`--font-ui`, tombol/label).
- Token (`styles/global.css`): `--color-ink #2C3F4E`, `--color-paper #D5DADE`, `--color-muted #737373`, `--color-dark #323030`; radius 16px; kolom undangan `max-width: 500px` (mobile) / `clamp(340px,25vw,480px)` (desktop).
- Cover: full-bleed `1.png` + overlay gelap + gradient, CTA ghost "Buka Undangan" sebagai focal point, entrance bg zoom + teks blur-rise stagger.
- Reveal: teks blur+rise, media zoom, kartu tilt; easing `power3.out`, durasi 0.85–1.1s.
- Countdown: `7.png` grayscale + wrap hitam transparan `rgba(0,0,0,.45)` agar angka putih terbaca.
- Gallery: carousel autoplay 3.5s (jeda saat hover/sentuh/tab hidden) + swipe + dots + thumbnail, fade tiap ganti slide.

---

## 11. Testing Strategy (manual + smoke)

- Unit: skema zod (kasus invalid via API), `getCountdown` (termasuk lewat waktu).
- Component: state loading/error/success form, cegah double-submit, kontrol musik play/pause.
- Integration: POST RSVP invalid tidak tersimpan (400 + `fields`), GET/POST wishes persist (curl + refresh).
- Smoke/E2E: buka cover (scroll mulus, tanpa blink) → scroll tiap section (animasi per item) → submit RSVP → submit wishes → refresh → wishes tetap ada.
- Responsive/manual: 320, 375, 768, 1024, 1440 — tanpa overflow horizontal, tombol bar tidak tabrakan, footer tidak tertutup.
- Verifikasi rutin: `npm run build` (tsc + vite) dan `curl /api/health`.

---

## 12. Disclosure AI Tools

Implementasi dibantu oleh **Muse Spark** (coding agent, model `muse-spark-1.3`) untuk scaffolding, komponen, API, animasi GSAP, refactor hooks/helpers, dan dokumentasi. Seluruh output ditinjau, di-build (`npm run build`), dan diuji (smoke dev server: client 200 + `/api/health` OK, alur cover → RSVP → wishes manual) sebelum diserahkan. Asset pack hanya dipakai untuk assessment dan tidak dipublikasikan ulang.

---

## 13. Lisensi Asset

Asset `assets/` dan `public/assets/` hanya untuk assessment/hometask seleksi Invitato dan tidak untuk publikasi ulang di luar konteks tersebut.
