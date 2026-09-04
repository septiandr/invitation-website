# Architecture: Website Invitation Publik

## 1. Ringkasan

Arsitektur menggunakan pola **single public web app** dengan frontend React +
TypeScript, backend HTTP API, dan database relasional. Aplikasi tidak memiliki
autentikasi atau dashboard admin pada MVP.

```text
Browser
  |
  | HTTPS
  v
Frontend Web App (React + TypeScript)
  |-- static assets: images, fonts, audio
  |
  | JSON over HTTPS
  v
Backend API
  |-- validation
  |-- rate limiting
  |-- error mapping
  v
Relational Database
  |-- rsvps
  `-- wishes
```

Frontend dan backend dapat dideploy sebagai satu aplikasi full-stack atau sebagai
dua service terpisah. Kontrak API tetap sama agar deployment dapat diganti tanpa
perubahan pada domain fitur.

## 2. Sasaran Arsitektur

- Menyelesaikan seluruh acceptance criteria MVP dalam waktu 1–2 hari.
- Membuat 5–10 detik pertama terasa memorable melalui cover yang kuat, visual
  sinematik, dan transisi pembuka yang halus.
- Menjaga halaman undangan tetap dapat dibaca ketika API sedang gagal.
- Memastikan input divalidasi dua kali: di browser dan di server.
- Menyimpan RSVP dan wishes secara persisten serta aman.
- Memisahkan konten acara dari komponen UI agar mudah dikonfigurasi.
- Mengoptimalkan pengalaman mobile tanpa mengorbankan desktop.

## 2.1 Prinsip First Impression

Website ini terutama dinilai dari pengalaman pertama saat halaman dibuka. Karena itu,
prioritas teknis dan desain untuk initial viewport adalah:

1. **Immediate visual impact:** background utama, tipografi pasangan, dan komposisi
   cover harus tampil cepat tanpa menunggu request API.
2. **Clear focal point:** satu CTA “Buka Undangan” menjadi fokus utama; hindari elemen
   dekoratif yang bersaing dengan nama pasangan atau CTA.
3. **Premium motion:** gunakan entrance animation yang singkat, lembut, dan terarah
   untuk membangun rasa eksklusif tanpa menunda akses konten.
4. **Perceived performance:** preload hanya asset hero/background yang kritis,
   tetapkan dimensi gambar, dan tampilkan skeleton/fallback yang tetap estetik.
5. **Emotional continuity:** setelah cover dibuka, hero, countdown, dan section awal
   harus mempertahankan mood visual yang sama sebelum pengguna mencapai form.
6. **Graceful degradation:** bila audio, font, atau API gagal, layout tetap terlihat
   intentional dan tidak menampilkan broken state pada viewport pertama.

### Prioritas loading

```text
P0  HTML shell, background hero, font utama/fallback, nama pasangan, CTA
P1  hero image, opening transition, countdown, kontrol musik
P2  event details, gallery images, maps embed
P3  RSVP API dan wishes list/form saat section diperlukan
```

Asset P0 harus dikompres dan diuji pada jaringan mobile. Jangan menunda render cover
demi memuat wishes, maps, atau asset gallery.

## 2.2 Visual Direction yang Dikunci

Visual harus terasa editorial, intimate, dan premium; bukan template form biasa.
Referensi dipakai untuk mood dan kualitas art direction, bukan untuk menyalin identitas
atau layout secara pixel-perfect.

### Font system

Gunakan dua keluarga font berikut melalui `@font-face`/self-hosted asset atau provider
font resmi yang diizinkan:

| Token | Font | Penggunaan | Weight |
| --- | --- | --- | --- |
| `--font-display` | **Cormorant Garamond** | Nama pasangan, heading besar, angka countdown | 400, 500, 600 |
| `--font-body` | **DM Sans** | Body, label, tombol, metadata, form, wishes | 400, 500, 600, 700 |
| `--font-mono` | `ui-monospace` | Tidak digunakan pada UI publik; hanya debug | system |

Fallback harus menjaga bentuk dan metrik tetap wajar:
`"Cormorant Garamond", Georgia, serif` dan `"DM Sans", Arial, sans-serif`.
Jangan menggunakan lebih dari dua keluarga font pada UI. Load hanya weight yang
digunakan, gunakan `font-display: swap`, dan pastikan teks tetap terbaca sebelum font
selesai dimuat.

### Tipografi dan hierarchy

```css
:root {
  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-body: "DM Sans", Arial, sans-serif;
  --text-display: clamp(3.5rem, 13vw, 8rem);
  --text-h1: clamp(2.5rem, 7vw, 5rem);
  --text-h2: clamp(2rem, 5vw, 3.5rem);
  --text-body: 1rem;
  --text-caption: 0.75rem;
  --tracking-kicker: 0.18em;
}
```

- Nama pasangan memakai display font, line-height `0.85–0.95`, dan tracking normal.
- Kicker/eyebrow memakai body font uppercase, `letter-spacing: 0.18em`, dan ukuran
  `10–12px`.
- Body memakai line-height minimum `1.6`; jangan memakai all-caps untuk paragraf.
- CTA memakai body font medium/semibold, ukuran minimum `14px`, dan area sentuh
  minimum `44px`.
- Hindari lebih dari tiga level heading dalam satu viewport.

### Warna dan surface

Gunakan token agar mood konsisten dan mudah disesuaikan setelah inspeksi asset:

```css
:root {
  --color-ink: #1b1b1b;
  --color-paper: #f3f0eb;
  --color-muted: #9b958d;
  --color-accent: #b28a62;
  --color-accent-deep: #72543d;
  --color-overlay: rgb(18 18 18 / 45%);
  --color-line: rgb(27 27 27 / 16%);
}
```

Background utama memakai `background.jpg` dengan overlay gelap/transparan secukupnya
agar teks putih lolos kontras. Section terang memakai paper tone; gunakan surface
putih murni hanya untuk field/form bila diperlukan. Hindari gradient neon, shadow
berat, dan radius berlebihan karena akan mengurangi kesan editorial.

### Spacing, grid, dan bentuk

- Unit spacing dasar: `4px`; spacing section: `clamp(72px, 12vw, 160px)`.
- Container: `width: min(100% - 32px, 1120px)`; desktop dapat memakai padding 48px.
- Teks panjang maksimal `60–68ch`.
- Grid gallery desktop 12 kolom; mobile 2 kolom dengan satu feature image.
- Radius default `0–4px`; gunakan bentuk organik hanya bila mengikuti crop asset.
- Garis divider tipis boleh dipakai untuk memisahkan metadata, bukan sebagai ornamen
  di setiap section.

### Art direction cover

Cover adalah komposisi paling penting:

1. Gunakan `background.jpg` sebagai full-bleed layer (`cover`, posisi focal point
   dikonfigurasi per breakpoint).
2. Tambahkan overlay atau vignette agar nama pasangan menjadi focal point.
3. Susun kicker tanggal/lokasi, nama pasangan, dan CTA dalam satu vertical rhythm.
4. Gunakan animasi opacity/translate kecil; jangan memakai zoom atau parallax berat
   yang membuat gambar blur dan mengganggu first impression.
5. CTA menggunakan outline/light surface kontras tinggi dan state hover/focus yang
   terlihat.
6. Cover minimal setinggi `100svh`; gunakan `svh` agar aman terhadap browser mobile.

### Pemetaan asset awal

Karena nama file numerik tidak menjelaskan isi visual, lakukan inspeksi manual sebelum
coding dan dokumentasikan hasilnya di `eventConfig.ts`:

| Asset | Ukuran | Kandidat pemakaian |
| --- | ---: | --- |
| `background.jpg` | 1280×1280 | Cover/background utama |
| `1.png` | 1024×1536 | Portrait hero/gallery |
| `2.png` | 1024×1536 | Portrait gallery |
| `3.png` | 1024×1536 | Portrait gallery |
| `4.png` | 836×1881 | Portrait editorial/gallery |
| `5.png`–`10.png` | 1537×1023 | Landscape gallery/feature image |

Jangan menentukan crop hanya dari urutan filename. Gunakan `object-position` per gambar,
`aspect-ratio` yang eksplisit, dan `alt` yang mendeskripsikan isi sebenarnya.

## 3. Batasan dan Asumsi

- Satu pasangan/acara untuk satu deployment.
- Semua pengunjung dianggap publik dan tidak perlu login.
- Data undangan statis dikonfigurasi melalui environment atau file konfigurasi.
- Asset pack hanya untuk assessment dan tidak boleh digunakan di luar konteks tersebut.
- RSVP dan wishes bersifat append-only dari sisi pengguna.
- Database menyediakan timestamp dan migration yang dapat dijalankan ulang.

## 4. Struktur Repository yang Disarankan

```text
.
├── assets/
│   ├── background.jpg
│   ├── 1.png ... 10.png
│   └── # asset pack assessment
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── eventConfig.ts
│   ├── components/
│   │   ├── Cover/
│   │   ├── Hero/
│   │   ├── EventDetails/
│   │   ├── Countdown/
│   │   ├── Gallery/
│   │   ├── Location/
│   │   ├── RsvpForm/
│   │   ├── Wishes/
│   │   └── MusicControl/
│   ├── hooks/
│   ├── lib/
│   │   ├── apiClient.ts
│   │   ├── validation.ts
│   │   └── formatters.ts
│   ├── styles/
│   └── types/
├── server/
│   ├── routes/
│   │   ├── rsvps.*
│   │   └── wishes.*
│   ├── middleware/
│   │   ├── errorHandler.*
│   │   ├── rateLimit.*
│   │   └── validateRequest.*
│   ├── db/
│   │   ├── client.*
│   │   └── migrations/
│   └── app.*
├── .env.example
├── README.md
└── ARCHITECTURE.md
```

Nama ekstensi dan framework backend dapat disesuaikan dengan stack final. Batas
modul dan tanggung jawabnya sebaiknya dipertahankan.

### Asset handling

Asset pack saat ini berada di root `assets/` dan digunakan sebagai sumber visual
undangan. Frontend dapat mengaksesnya melalui import bundler atau menyalinnya ke
folder static/public saat build, sesuai konfigurasi framework yang dipilih.

- `background.jpg`: kandidat background utama atau section visual.
- `1.png`–`10.png`: kandidat image/gallery/decoration asset.
- Jangan mengubah nama atau memindahkan asset tanpa memperbarui referensi import.
- Optimalkan ukuran/format untuk production tanpa mengunggah asset ke repositori
  atau layanan publik di luar deployment assessment.

## 5. Tanggung Jawab Layer

### Frontend

- Merender cover, section visual, informasi acara, countdown, maps, musik, RSVP,
  dan wishes.
- Mengelola state UI: initial, loading, success, empty, dan error.
- Melakukan validasi cepat untuk feedback pengguna.
- Memanggil API melalui satu `apiClient`, bukan `fetch` tersebar di komponen.
- Merender nama/pesan sebagai plain text sehingga tidak mengeksekusi HTML.

### API server

- Menyediakan endpoint publik untuk RSVP dan wishes.
- Memvalidasi payload dari sumber yang tidak dipercaya.
- Menormalisasi input (`trim`, enum, integer) sebelum penyimpanan.
- Mengubah error internal menjadi error contract yang konsisten.
- Menerapkan batas ukuran request dan rate limit dasar.
- Tidak mengembalikan credential, query detail, atau metadata internal.

### Database

- Menjadi source of truth untuk RSVP dan wishes.
- Menyediakan migration untuk local dan production.
- Menjamin primary key, required fields, enum/check constraint, dan index timestamp.

## 6. Konfigurasi Event

Konten yang berubah antar undangan ditempatkan pada satu konfigurasi terstruktur:

```ts
type EventConfig = {
  coupleNames: string;
  coverTitle: string;
  eventTimezone: string;
  eventDate: string;
  events: Array<{
    title: string;
    date: string;
    startTime: string;
    endTime?: string;
    description?: string;
  }>;
  venue: {
    name: string;
    address: string;
    mapsUrl: string;
    embedUrl?: string;
  };
  gallery: Array<{
    src: string;
    alt: string;
  }>;
  backgroundAudio?: string;
};
```

Tanggal countdown disimpan dalam format ISO 8601 dengan timezone eksplisit.
URL maps dan asset diverifikasi saat build/deployment.

## 7. Alur Data Utama

### Membuka undangan

1. Browser mengunduh shell aplikasi dan asset kritis.
2. Cover ditampilkan tanpa menunggu API.
3. Klik “Buka Undangan” mengubah state `isOpened`.
4. Countdown mulai menghitung dari waktu client berdasarkan konfigurasi acara.
5. Audio dicoba setelah gesture pengguna; kegagalan audio hanya memengaruhi kontrol
   musik, bukan konten lainnya.
6. Section non-kritis memuat media secara lazy saat diperlukan.

Target pengalaman:

- Cover dapat menampilkan komposisi utamanya segera setelah shell tersedia.
- CTA tetap terlihat tanpa scroll pada mobile umum dan desktop.
- Transisi pembuka tidak lebih panjang dari yang diperlukan untuk menyampaikan
  perubahan state.
- Section pertama setelah cover memiliki visual hierarchy yang jelas dan tidak terasa
  seperti perpindahan ke halaman/form biasa.

### Mengirim RSVP

```text
RsvpForm
  -> client validation
  -> apiClient.post("/api/rsvps")
  -> server route
  -> request schema validation
  -> normalize
  -> INSERT rsvps
  -> 201 JSON
  -> success state
```

Jika validasi gagal, server mengembalikan `400` dengan `fields`. Jika terjadi
rate limit, server mengembalikan `429`. Error tak terduga dipetakan ke `500`
tanpa membocorkan detail internal.

### Memuat dan mengirim wishes

```text
WishesSection mount/enter viewport
  -> GET /api/wishes
  -> SELECT ... ORDER BY created_at DESC
  -> render list / empty state

WishesForm
  -> client validation
  -> POST /api/wishes
  -> validate + normalize
  -> INSERT wishes
  -> 201 JSON
  -> prepend returned item to local list
```

UI tidak melakukan optimistic update untuk menghindari wishes tampil ketika
penyimpanan sebenarnya gagal.

## 8. Kontrak API

Base path: `/api`. Semua request body dan response menggunakan `application/json`.

### `POST /api/rsvps`

Request:

```json
{
  "guestName": "Nama Tamu",
  "attendance": "HADIR",
  "guestCount": 2
}
```

Response `201`:

```json
{
  "id": "uuid",
  "guestName": "Nama Tamu",
  "attendance": "HADIR",
  "guestCount": 2,
  "createdAt": "2026-09-04T00:00:00.000Z"
}
```

### `GET /api/wishes`

Response `200`:

```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Nama Pengirim",
      "message": "Selamat menempuh hidup baru!",
      "createdAt": "2026-09-04T00:00:00.000Z"
    }
  ]
}
```

### `POST /api/wishes`

Request:

```json
{
  "name": "Nama Pengirim",
  "message": "Selamat menempuh hidup baru!"
}
```

Response `201` memakai bentuk item yang sama dengan `GET`.

### Error contract

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Periksa kembali input Anda.",
    "fields": {
      "name": "Nama wajib diisi."
    }
  }
}
```

Kode minimum:

| HTTP | Code | Penggunaan |
| --- | --- | --- |
| 400 | `VALIDATION_ERROR` | Payload kosong atau tidak sesuai aturan |
| 404 | `NOT_FOUND` | Route API tidak ditemukan |
| 429 | `RATE_LIMITED` | Terlalu banyak request dari client |
| 500 | `INTERNAL_ERROR` | Kegagalan server/database |

## 9. Model Database

Contoh schema relasional:

```sql
CREATE TABLE rsvps (
  id UUID PRIMARY KEY,
  guest_name VARCHAR(100) NOT NULL,
  attendance VARCHAR(20) NOT NULL
    CHECK (attendance IN ('HADIR', 'TIDAK_HADIR')),
  guest_count INTEGER NOT NULL CHECK (guest_count BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE wishes (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  message VARCHAR(500) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX wishes_created_at_idx
  ON wishes (created_at DESC);
```

Validasi `guestCount` untuk status `TIDAK_HADIR` harus konsisten antara frontend,
server, dan schema. Pilihan MVP yang disarankan adalah tetap menerima angka `1`
sebagai jumlah kontak/form standar, atau mengubah aturan menjadi `0` secara
eksplisit di seluruh layer sebelum implementasi.

## 10. State Management Frontend

Gunakan state lokal per fitur; global state hanya untuk status undangan yang memang
dipakai lintas section.

```text
App
├── invitationOpened: boolean
├── music: { isPlaying, isAvailable }
├── countdown: derived from eventDate
├── RSVP form: { values, errors, status }
└── Wishes:
    ├── items
    ├── loadStatus
    └── submitStatus
```

Status request:

- `idle`: belum ada aksi.
- `loading`: request berjalan; cegah submit ganda.
- `success`: tampilkan konfirmasi dan reset form bila sesuai.
- `error`: tampilkan pesan; pertahankan input.

## 11. Keamanan dan Reliability

- Gunakan schema validation server untuk semua body.
- Terapkan panjang maksimum payload dan content type check.
- Escape output pada framework; jangan gunakan `dangerouslySetInnerHTML` untuk
  nama/pesan wishes.
- Tambahkan rate limit khusus endpoint `POST`.
- Gunakan HTTPS pada deployment dan environment variable untuk `DATABASE_URL`
  maupun secret lain.
- Jangan mencatat payload wishes/RSVP lengkap dalam log production.
- Jika `GET /api/wishes` gagal, tampilkan error inline dan tetap tampilkan form.
- Jika database gagal saat submit, kembalikan `500` dan jangan memberi pesan sukses.
- Sediakan timeout request client agar UI tidak loading tanpa batas.

## 12. Performance dan Accessibility

- Gunakan format gambar modern jika tersedia, ukuran responsif, dan `loading="lazy"`
  untuk gallery.
- Tetapkan dimensi media agar layout tidak bergeser.
- Bundle hanya library yang diperlukan.
- Gunakan `IntersectionObserver` untuk reveal animation dan lazy section work.
- Hormati `prefers-reduced-motion`.
- Pastikan semua input memiliki label, error terhubung melalui `aria-describedby`,
  dan tombol memiliki focus state.
- Kontrol musik menggunakan button native dengan label yang berubah sesuai status.
- Pastikan kontras teks dan target sentuh memadai.

### Responsive behavior

Gunakan breakpoint berbasis kebutuhan layout, bukan device tertentu:

| Breakpoint | Behavior |
| --- | --- |
| `< 480px` | Cover single column, nama maksimal 2–3 baris, CTA full-width terbatas |
| `480–767px` | Gallery 2 kolom, event metadata ditumpuk, padding 24px |
| `768–1199px` | Dua kolom untuk detail acara, gallery mulai memakai feature grid |
| `≥ 1200px` | Container maksimal 1120px, whitespace lebih luas, typography memakai clamp maksimum |

Uji minimal pada lebar 320px, 375px, 768px, 1024px, dan 1440px. Tidak boleh ada
horizontal scroll, teks terpotong, CTA keluar viewport, atau background focal point
yang kehilangan subjek utama.

### Motion specification

Gunakan easing `cubic-bezier(0.22, 1, 0.36, 1)` untuk entrance dan durasi
`500–900ms`; stagger antar elemen cover maksimal `120ms`. Reveal section cukup
opacity + translateY `16–24px`. Semua animation harus memiliki:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

Jangan menganimasikan layout properties seperti `width`, `height`, atau `top` bila
transform/opacity cukup. Hormati `visibility` dan keyboard focus selama transisi.

## 13. Deployment

### Environment

```text
DATABASE_URL=...
PUBLIC_APP_URL=https://...
EVENT_TIMEZONE=Asia/Jakarta
```

Secret hanya disimpan di secret manager/provider environment settings. Commit
`.env.example` berisi nama variable tanpa nilai rahasia.

### Pipeline minimum

1. Install dependency secara reproducible dari lockfile.
2. Jalankan type-check/build frontend.
3. Jalankan migration database.
4. Start server/API.
5. Verifikasi health endpoint, halaman publik, `GET /api/wishes`, dan submit test
   pada environment non-production.

Health endpoint opsional yang disarankan: `GET /api/health`, mengembalikan `200`
hanya jika proses hidup dan dependency kritis dapat dijangkau.

## 14. Testing Strategy

- **Unit:** validator payload, formatter countdown, normalisasi input, error mapper.
- **Component:** state loading/error/success form, countdown setelah waktu lewat,
  music control, dan reduced-motion behavior.
- **Integration:** route POST RSVP, GET/POST wishes dengan database test.
- **Smoke/E2E:** buka cover, scroll section, submit RSVP, submit wishes, refresh,
  lalu pastikan data wishes tetap ada.
- **Responsive/manual:** viewport sekitar 320px, mobile umum, tablet, dan desktop.

Prioritas pengujian mengikuti risiko: persistence API/database, validasi, submit
ganda, lalu visual polish.

## 15. Observability dan Operasional

- Log startup, migration result, request method/path/status, latency, dan error id.
- Gunakan correlation/request id bila tersedia.
- Hindari logging nama tamu, pesan wishes, atau connection string.
- Frontend menampilkan error yang ramah pengguna; detail teknis hanya di console
  development.
- Pantau error rate endpoint POST dan kegagalan koneksi database setelah deployment.

## 16. Trade-off

| Keputusan | Alasan |
| --- | --- |
| Database relasional | Cocok untuk dua tabel sederhana, constraint, dan migration |
| Tanpa autentikasi | Sesuai scope MVP dan mengurangi kompleksitas delivery |
| Local state per fitur | Cukup untuk satu halaman dan menghindari global state berlebihan |
| No optimistic wishes update | Menjamin daftar hanya menampilkan data yang sudah tersimpan |
| Asset statis di web app/CDN | Sederhana dan cepat untuk undangan dengan konten tetap |
| API contract JSON eksplisit | Memudahkan frontend, testing, dan penggantian provider deployment |

## 17. Keputusan yang Harus Dikunci Sebelum Implementasi

1. Framework backend dan provider database/deployment.
2. Aturan jumlah orang ketika status `TIDAK_HADIR` (`0` atau `1`).
3. Apakah wishes dimuat saat page load atau ketika section masuk viewport.
4. Nama pasangan, tanggal/timezone acara, URL maps, dan asset final.
5. Retensi data dan batas rate limit production.

Keputusan final dan alasan pemilihannya wajib dicatat di `README.md`, termasuk
disclosure AI tools/agents yang digunakan selama implementasi.
