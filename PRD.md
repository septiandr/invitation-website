# Product Requirements Document (PRD)

## 1. Informasi Dokumen

| Item | Detail |
| --- | --- |
| Produk | Website Invitation Publik |
| Versi | 1.0 |
| Status | Draft implementable |
| Target delivery | 1–2 hari sejak brief diterima |
| Referensi visual | [Template Ricky + Felly](https://invitato.net/template-rickyfelly/?code=D3EC9693640) |

## 2. Latar Belakang

Produk ini adalah website undangan pernikahan publik yang memungkinkan tamu memperoleh
informasi acara, menikmati pengalaman visual yang modern-futuristik, mengonfirmasi
kehadiran, dan mengirim ucapan. RSVP serta wishes harus tersimpan secara persisten
melalui backend API dan database.

Asset pack Invitato hanya digunakan untuk kebutuhan assessment/hometask dan tidak
boleh dipublikasikan atau digunakan kembali di luar proses seleksi.

## 3. Tujuan Produk

### Tujuan utama

1. Menyediakan pengalaman undangan digital yang elegan, cepat, responsif, dan mudah
   digunakan di mobile maupun desktop.
2. Memungkinkan tamu mengirim RSVP dengan data yang tervalidasi.
3. Memungkinkan tamu mengirim dan membaca wishes yang tersimpan secara persisten.
4. Mendemonstrasikan product slice end-to-end: frontend, API, database, validasi,
   error handling, dan deployment.

### Indikator keberhasilan

- Pengunjung dapat membuka cover dan masuk ke undangan tanpa error.
- Seluruh section wajib dapat diakses pada viewport mobile dan desktop.
- RSVP valid tersimpan dan dapat diverifikasi melalui API/database.
- Wishes valid tersimpan dan muncul pada daftar wishes tanpa reload penuh.
- Input invalid menghasilkan pesan error yang jelas dan tidak membuat aplikasi crash.
- Audio, countdown, maps, dan animasi tersedia sebagai bagian dari flow utama.

## 4. Target Pengguna

### Tamu undangan

Tamu yang membuka link undangan dari ponsel atau desktop. Mereka membutuhkan informasi
acara yang ringkas, lokasi yang mudah ditemukan, serta cara cepat untuk mengonfirmasi
kehadiran dan mengirim ucapan.

### Pasangan/pemilik undangan

Pemilik acara membutuhkan halaman yang merepresentasikan mood visual acara dan
menyimpan respons tamu serta wishes tanpa perlu dashboard admin pada versi ini.

## 5. Prinsip Pengalaman

- **Visual-first:** gunakan asset pack, tipografi, warna, dan komposisi yang terinspirasi
  referensi tanpa menyalin secara pixel-perfect.
- **Mobile-first:** konten dan CTA utama nyaman digunakan dengan satu tangan.
- **Progressive disclosure:** cover menjadi entry point; detail ditampilkan bertahap
  melalui scroll.
- **Clear feedback:** setiap submit memiliki state loading, sukses, dan gagal.
- **Accessible by default:** kontras memadai, focus state terlihat, label form jelas,
  dan animasi menghormati `prefers-reduced-motion`.

## 6. Ruang Lingkup MVP

### 6.1 Opening/Cover

- Menampilkan nama pasangan, nama tamu opsional, dan tanggal acara.
- CTA “Buka Undangan”.
- Saat CTA ditekan, undangan utama terbuka dan musik dapat dimulai setelah interaksi
  pengguna (mengikuti aturan autoplay browser).
- Transisi pembuka terasa halus dan tidak menghalangi navigasi.

### 6.2 Hero dan informasi pasangan

- Nama pasangan dan copy singkat.
- Foto/visual utama dari asset pack.
- Informasi tanggal/hari acara.

### 6.3 Countdown

- Menampilkan hitung mundur hari, jam, menit, dan detik menuju waktu acara.
- Ketika waktu acara terlewati, tampilkan status yang bermakna, misalnya “Acara sedang
  berlangsung” atau “Acara telah berlangsung”.
- Perhitungan menggunakan timezone yang ditentukan konfigurasi acara.

### 6.4 Informasi acara

- Minimal mendukung satu atau beberapa agenda acara.
- Setiap agenda menampilkan nama acara, tanggal, waktu, dan deskripsi singkat.
- Data acara dikonfigurasi dari sumber konfigurasi aplikasi, bukan hard-coded berulang
  di banyak komponen.

### 6.5 Gallery/visual section

- Menampilkan asset pack dalam layout responsif.
- Mendukung tampilan grid atau carousel sederhana.
- Gambar memiliki alt text dan tidak menyebabkan layout shift yang signifikan.

### 6.6 Lokasi dan maps

- Menampilkan nama lokasi, alamat, dan informasi pendukung.
- Menyediakan tombol “Buka di Google Maps” menggunakan URL konfigurasi.
- Jika embed peta digunakan, tampilkan fallback link ketika embed gagal atau tidak
  tersedia.

### 6.7 RSVP/Guest Confirmation

Field wajib:

| Field | Tipe | Aturan |
| --- | --- | --- |
| Nama tamu | string | Wajib, trim whitespace, panjang 2–100 karakter |
| Status kehadiran | enum | Wajib: `HADIR` atau `TIDAK_HADIR` |
| Jumlah orang | integer | Wajib, 1–10; untuk `TIDAK_HADIR` tetap tervalidasi dan default dapat 0/1 sesuai keputusan UX |

Perilaku:

- Tombol submit nonaktif atau menampilkan loading selama request berlangsung.
- Sukses menampilkan konfirmasi yang mudah dipahami.
- Gagal menampilkan pesan error dan mempertahankan input pengguna.
- Mencegah submit ganda akibat klik berulang.

### 6.8 Wishes

Field wajib:

| Field | Tipe | Aturan |
| --- | --- | --- |
| Nama | string | Wajib, trim whitespace, panjang 2–100 karakter |
| Pesan | string | Wajib, panjang 1–500 karakter |

Perilaku:

- Daftar wishes dimuat saat section dibuka atau halaman selesai dimuat.
- Pengunjung dapat mengirim wishes baru.
- Wishes baru tampil setelah submit berhasil tanpa reload penuh.
- Tampilkan empty state jika belum ada wishes.
- Urutan default terbaru ke terlama.
- Konten wishes dirender sebagai teks aman, bukan HTML mentah.

### 6.9 Musik latar

- Kontrol play/pause selalu dapat ditemukan setelah undangan dibuka.
- Audio tidak boleh diputar paksa sebelum interaksi pengguna.
- Sediakan label/tooltip yang jelas serta dukungan keyboard.
- Jika audio gagal dimuat, halaman tetap berfungsi dan error tidak memblokir flow.

### 6.10 Animasi dan transisi

- Reveal animation pada section saat masuk viewport.
- Transisi cover ke konten utama.
- Animasi tidak boleh menghalangi interaksi atau menyebabkan konten tidak terbaca.
- Nonaktifkan atau sederhanakan animasi untuk `prefers-reduced-motion: reduce`.

## 7. Di Luar Ruang Lingkup MVP

- Admin dashboard, autentikasi, dan manajemen guest list.
- Edit/hapus RSVP atau wishes oleh pengguna.
- Notifikasi email/WhatsApp.
- Pembatasan akses berdasarkan kode undangan.
- Multi-event management.
- Moderasi wishes otomatis.

## 8. Alur Pengguna

### Alur membuka undangan

1. Tamu membuka URL publik.
2. Sistem menampilkan cover dan CTA.
3. Tamu menekan “Buka Undangan”.
4. Sistem menampilkan konten utama, memulai countdown, dan mengaktifkan kontrol musik.
5. Tamu menavigasi section melalui scroll.

### Alur RSVP

1. Tamu membuka form RSVP.
2. Tamu mengisi nama, status kehadiran, dan jumlah orang.
3. Frontend memvalidasi input.
4. Frontend mengirim `POST /api/rsvps`.
5. Backend memvalidasi ulang dan menyimpan data.
6. UI menampilkan sukses atau error yang dapat ditindaklanjuti.

### Alur wishes

1. Tamu membuka section wishes.
2. Sistem mengambil data melalui `GET /api/wishes`.
3. Tamu mengisi nama dan pesan.
4. Frontend memvalidasi input.
5. Frontend mengirim `POST /api/wishes`.
6. Backend memvalidasi dan menyimpan data.
7. UI menambahkan wishes baru ke daftar setelah response sukses.

## 9. Persyaratan Backend dan API

### Endpoint RSVP

`POST /api/rsvps`

Request:

```json
{
  "guestName": "Nama Tamu",
  "attendance": "HADIR",
  "guestCount": 2
}
```

Response sukses: HTTP `201`

```json
{
  "id": "uuid",
  "guestName": "Nama Tamu",
  "attendance": "HADIR",
  "guestCount": 2,
  "createdAt": "2026-09-04T00:00:00.000Z"
}
```

### Endpoint wishes

`GET /api/wishes`

- Response HTTP `200`.
- Mengembalikan array wishes terbaru lebih dahulu.
- Jangan mengembalikan field sensitif atau metadata database yang tidak diperlukan.

`POST /api/wishes`

Request:

```json
{
  "name": "Nama Pengirim",
  "message": "Selamat menempuh hidup baru!"
}
```

Response sukses: HTTP `201`.

### Error contract

Gunakan struktur konsisten, misalnya:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Periksa kembali input Anda.",
    "fields": {
      "guestName": "Nama wajib diisi."
    }
  }
}
```

Backend wajib melakukan validasi ulang, membatasi panjang payload, dan mengembalikan
status HTTP yang tepat untuk validation error, server error, dan rate limit bila ada.

## 10. Model Data Minimum

### `rsvps`

- `id` (UUID/string, primary key)
- `guest_name` (string, required)
- `attendance` (enum: `HADIR`, `TIDAK_HADIR`)
- `guest_count` (integer, required)
- `created_at` (timestamp)
- `updated_at` (timestamp, optional)

### `wishes`

- `id` (UUID/string, primary key)
- `name` (string, required)
- `message` (string, required)
- `created_at` (timestamp)

Database harus menggunakan migration/schema yang dapat direproduksi saat setup lokal
dan deployment.

## 11. Persyaratan Non-Fungsional

- **Responsif:** layout usable pada lebar sekitar 320px hingga desktop besar.
- **Performance:** optimalkan ukuran gambar/audio, gunakan lazy loading untuk media
  non-kritis, dan hindari request berulang yang tidak perlu.
- **Reliability:** kegagalan API tidak boleh membuat seluruh halaman tidak dapat dibaca.
- **Security:** validasi input di client dan server, sanitasi/escape output, gunakan
  environment variable untuk secret, dan jangan commit credential.
- **Accessibility:** semantic HTML, label form, keyboard navigation, alt text, focus
  state, dan reduced motion.
- **SEO/shareability:** title, description, favicon, dan Open Graph metadata dasar.
- **Observability minimum:** logging error backend tanpa menyimpan data sensitif secara
  berlebihan.

## 12. Acceptance Criteria

### Frontend dan visual

- [ ] Cover, hero, informasi acara, gallery, countdown, maps, RSVP, wishes, musik, dan
  animasi tersedia.
- [ ] Tampilan diuji pada mobile dan desktop tanpa overflow horizontal.
- [ ] Asset pack digunakan sesuai batasan assessment.
- [ ] Loading, empty, success, dan error state terlihat pada flow interaktif.

### RSVP

- [ ] RSVP valid menghasilkan response `201` dan tersimpan di database.
- [ ] Semua field wajib tervalidasi di frontend dan backend.
- [ ] RSVP invalid tidak tersimpan.
- [ ] Submit ganda ditangani dengan aman.

### Wishes

- [ ] Wishes valid menghasilkan response `201` dan tersimpan di database.
- [ ] `GET /api/wishes` mengembalikan wishes tersimpan.
- [ ] Wishes baru muncul di UI setelah submit sukses.
- [ ] Pesan dirender sebagai plain text yang aman.

### Delivery

- [ ] README menjelaskan cara menjalankan lokal, arsitektur, environment, database,
  deployment, dan disclosure AI tools/agents.
- [ ] Live deployment URL dapat dibuka publik.
- [ ] Repository GitHub berisi source code dan konfigurasi yang diperlukan tanpa secret.

## 13. Rencana Implementasi

### Hari 1

1. Inisialisasi frontend, backend, dan database.
2. Siapkan konfigurasi event, asset, layout global, cover, hero, dan section informasi.
3. Implementasikan countdown, musik, maps, dan gallery.
4. Buat schema/migration serta endpoint RSVP dan wishes.

### Hari 2

1. Implementasikan form RSVP dan wishes beserta seluruh state.
2. Integrasikan API dan validasi server.
3. Tambahkan responsive polish, animasi, accessibility, dan SEO metadata.
4. Uji alur utama, deploy, tulis README, dan verifikasi live URL.

## 14. Risiko dan Mitigasi

| Risiko | Mitigasi |
| --- | --- |
| Autoplay audio diblokir browser | Mulai audio setelah CTA cover ditekan dan sediakan kontrol manual |
| Asset terlalu besar | Kompresi, ukuran responsif, dan lazy loading media |
| API/database deployment tidak stabil | Gunakan provider sederhana dengan migration dan health check |
| Spam RSVP/wishes | Rate limiting dasar, batas payload, dan validasi server |
| Animasi mengganggu aksesibilitas | Dukung `prefers-reduced-motion` dan jangan sembunyikan konten penting |
| Waktu pengerjaan terbatas | Prioritaskan acceptance criteria MVP sebelum fitur tambahan |

## 15. Keputusan Teknis yang Diharapkan

Implementasi bebas memilih stack. React.js + TypeScript direkomendasikan untuk frontend.
Backend dan database harus memiliki API contract yang jelas, validasi terpusat atau
konsisten, serta setup lokal yang mudah direproduksi. Keputusan final, trade-off,
provider deployment, dan penggunaan AI tools/agents wajib dijelaskan di README.
