# Panduan Animasi GSAP — Ricky & Felly Wedding

> Stack: `gsap ^3.15.0` + `ScrollTrigger` — semua animasi via GSAP, **CSS hanya untuk style statis**. `prefers-reduced-motion` ditangani via `gsap.set()`. Orkestrasi pusat di `src/app/App.tsx:21`, Cover punya timeline sendiri di `src/components/Cover/Cover.tsx:14`.

## Arsitektur

- **Cover** (pre-open): timeline GSAP on mount (`useLayoutEffect` + `gsap.context`).
- **Page (.page-content)**: `ScrollTrigger` per `section` setelah `isOpened === true`. Tidak lagi pakai `useReveal` / `IntersectionObserver` — semua `fromTo` di `App.tsx:37`.
- **Parallax image**: `quickTo` pada `.img-hover img` (`App.tsx:62`) + scale 1.06 on hover.
- **Reduced motion**: `matchMedia("(prefers-reduced-motion: reduce)")` → `gsap.set(..., {opacity:1, y:0})` tanpa tween.

```
Cover (fixed .cover-layer)
  └─ page-content (opacity 0 → intro timeline → scroll sections → footer fade)
       ├─ Hero
       ├─ OpeningQuote
       ├─ CoupleProfile
       ├─ EventDetails
       ├─ Countdown
       ├─ LoveStory
       ├─ Gallery
       ├─ Location
       ├─ RsvpForm
       ├─ Wishes
       ├─ WeddingGift
       ├─ GuestQr
       └─ Closing (footer)
MusicControl (fixed pill, di luar page-content)
```

---

## 1) Cover — `src/components/Cover/Cover.tsx:14`

| Elemen | Selector | GSAP | Durasi / Easing | Deskripsi |
|---|---|---|---|---|
| Background foto | `.cover-bg` | `from scale 1.08 → 1` | 1.8s `power2.out` | Ken Burns masuk, menggantikan CSS `kenburns` |
| Teks stack (kicker, Ricky & Felly, tanggal, tamu) | `.cover-anim` | `set y:28, blur 6px → y:0, blur 0, opacity 1` | 0.85s `power3.out`, stagger 0.09, delay 0.18 | Muncul berurutan |
| Garis dekor | `.cover-line` | `scaleX 0 → 1` | 0.6s `power2.out`, at 0.62 | Expand horizontal |
| Light sweep | `.cover-light-sweep` | `xPercent -35 → 140, opacity` | 0.9s `power2.inOut` at 0.7 | Kilau editorial |
| Orbit ring | `.cover-orbit` | `opacity 0 → 1` + `rotation 360` loop | 1s in + 24s/36s infinite `none` | Ring berputar |
| Grain | `.cover-grain` | `x/y jitter` | 0.35s `steps(2)` yoyo infinite | Texture hidup |
| Scroll cue | `.cover-scroll-cue` | `opacity + y` | 0.6s at 1.15 | Indikator scroll |
| CTA pill | `.cover-cta` | `y -6` yoyo | 1.4s `sine.inOut` delay 1.6 repeat -1 | Floating ajakan |
| Transisi buka | `.cover-layer` (di `App.tsx:33`) | `yPercent 0 → -100` | 1.2s `power4.inOut` | Slide up saat `Buka Undangan` |

**Customize**: ubah `stagger`, `scale`, atau hapus `lightSweep` di `Cover.tsx:22`.

## 2) Intro Page — `src/app/App.tsx:31`

```js
gsap.timeline()
  .to(".cover-layer", { yPercent: -100, duration: 1.2 })            // cover keluar
  .fromTo(".page-content", {y:80, scale:0.96}, {y:0, scale:1}, "-=0.72")
  .fromTo("section:first-of-type", {y:45}, {y:0}, "-=0.55")
```

Overlap `-=` membuat transisi terasa premium. Reduce-motion → `set` opacity 1 langsung.

## 3) Scroll per Section — `src/app/App.tsx:37`

Setiap `section` di `.page-content` (skip index 0 = Hero) dapat 3 tween paralel:

| Target | From | To | ScrollTrigger |
|---|---|---|---|
| `section` bg | `bgPos 50% 0%` | `50% 12%` | `scrub:1`, `start top bottom → end bottom top` |
| Headings `(.kicker,h2,h3)` | `y 35, blur 6px, opacity 0` | `y 0, blur 0, opacity 1` | `start top 78%`, `toggleActions play none none reverse`, stagger 0.1, 0.9s |
| Media `img,iframe` | `scale 1.08, y 28, opacity 0` | `scale 1, y 0, opacity 1` | `start top 72%`, stagger 0.12, 1.2s `power3.out` |
| Cards `(.stagger > *, form, article)` | `y 30, rotateX 5, opacity 0` | `y 0, rotateX 0, opacity 1` | `start top 68%`, stagger 0.1, 0.8s |

**Efek**: headings blur-in, gambar zoom-out, kartu 3D tilt subtle.

**Scroll-linked text parallax**: selain entrance, teks di setiap `section` mendapat tween `yPercent` dengan `scrub: 1` (`trigger: section, start "top bottom", end "bottom top"`). Judul (`h1-h6`, `.kicker`, `.display`, `.script`, `strong`, `blockquote`, `cite`) bergerak lebih cepat: `yPercent -18 → 18`; paragraf/body lebih lambat: `-9 → 9` — agar terasa berlapis. `yPercent` berkomposisi dengan `y` entrance (komponen transform terpisah), jadi teks terus bergeser halus selama halaman digulir — tanpa konflik tween. Dikecualikan: `.desktop-banner` (fixed, selalu di viewport).

> **Catatan implementasi**: target dihitung per `section` di `App.tsx` — teks (elemen yang punya text node, `a`, `button`), media (`img/iframe/video`), dan kartu (`form`, `article`, `.stagger > *`) yang beranimasi sebagai satu unit (isi kartu tidak dianimasi terpisah). Stagger menyesuaikan jumlah target (`Math.min(base, 0.7/n)`) agar daftar panjang (mis. wishes) tetap ringkas. Tidak ada lagi `IntersectionObserver`/class CSS `scroll-reveal` — semua `fromTo` via `ScrollTrigger` dengan `toggleActions: "play none none reverse"`, jadi entrance **terulang setiap kali** section masuk kembali ke viewport (bukan sekali).

### Peta ke Section:

- **Hero** (`src/components/Hero/Hero.tsx:1`) — kicker + `Ricky & Felly` (display), paragraf, `figure.img-hover` portrait `2.png`. Media tween → portrait scale-in.
- **OpeningQuote** (`InvitationSections.tsx:6`) — scripture `font-script “`, `blockquote`, `cite`. Kena heading tween (kicker/h2 tidak ada, tapi blockquote ikut media? Tidak — masuk cards? Quotes tidak anim cards, hanya opacity via heading; bisa tambah `.stagger` jika mau).
- **CoupleProfile** — 2 kolom `Groom & Bride` dengan `figure img-hover borderRadius 160`. `img` kena media tween, nama `h3` kena heading tween.
- **EventDetails** (`EventDetails.tsx:1`) — `.stagger` grid 2 kartu Holy Matrimony/Reception. Kartu kena cards tween + hover `translateY -4px` via CSS (tetap, bukan GSAP).
- **Countdown** (`Countdown.tsx:1`) — 4 `Box` Hari/Jam/Menit/Detik + Add-to-Calendar. Box adalah `stagger > *` → stagger 0.1.
- **LoveStory** — timeline `year | title+desc | thumb`. `year`/`h3` kena heading, `article` kena cards tween.
- **Gallery** (`Gallery.tsx:1`) — `.stagger` grid 12-col: feature 16:9, 2 portrait 3/4, 3 landscape 4/3, tall+landscape. `figure img-hover` kena media tween + mouse parallax.
- **Location** (`Location.tsx:1`) — venue card + `iframe` embed. Iframe kena media tween.
- **RsvpForm** (`RsvpForm.tsx:1`) — `form` kena cards tween (`form` selector). Field validasi `Zod`, submit `POST /api/rsvps`.
- **Wishes** (`Wishes.tsx:1`) — `form` + `article` per wish. `article` kena cards tween. Lazy load via `sentinelRef` + timeout fallback 2s.
- **WeddingGift** — bank card `accountNumber` 30px display. Kena heading+cards tween.
- **GuestQr** — `quickchart.io/qr` personal per `?guest=` param. Kena media tween.
- **Closing footer** — `Thank you` script + `RICKY & FELLY`. `gsap.to footer { opacity 0.55, scrub:true }` (`App.tsx:79`) saat footer masuk viewport.

## 4) Image Parallax Hover — `src/app/App.tsx:62`

```js
gsap.quickTo(img, "x", {duration:0.6})
gsap.quickTo(img, "y", {duration:0.6})
mouseenter → gsap.to(img, {scale:1.06})
mousemove → x = (clientX - centerX)*0.035, y = (clientY - centerY)*0.035
mouseleave → reset scale 1, x/y 0
```

Berlaku untuk semua `.img-hover` (Hero, CoupleProfile, Gallery). Lebih halus dari CSS `:hover scale 1.04`.

## 5) Footer — `src/app/App.tsx:79`

```js
gsap.to("footer", { opacity: 0.55, scrollTrigger: { scrub:true, start:"top bottom", end:"bottom bottom" } })
```

Memudar saat discroll ke ujung.

## 6) MusicControl — `src/components/MusicControl/MusicControl.tsx:1`

- `isOpened === false` → `return null` (tidak mount, tidak autoplay).
- Setelah `isOpened` → `setTimeout 350ms` → `audio.play()` (gesture valid karena klik Buka Undangan).
- State `isPlaying` sinkron dengan `play/pause/error` events.
- Toggle pill fixed `right:16 bottom:16`, `pulse` ring `1.8s ease-out infinite` saat playing.
- `src` dari `eventConfig.backgroundAudio` (`src/app/eventConfig.ts:81`) = `https://invitato.net/.../bg-sound-....mp3`.

## Token & Easing

- Easing utama: `power3.out` (entrance), `power4.inOut` (cover exit), `power2.out` (ken burns), `sine.inOut` (float), `none` (scrub).
- Stagger global: headings 0.1, media 0.12, cards 0.1.
- Viewport trigger: `top 78% / 72% / 68%` (heading/media/cards) agar berurutan.
- `toggleActions: "play none none reverse"` → entrance terulang tiap section masuk viewport, reverse saat keluar (bukan sekali).

## Menambah / Edit Animasi

1. **Tambah section baru**: letakkan `section` di `.page-content` di `App.tsx:114` — otomatis terdaftar oleh `gsap.utils.toArray("section")`. Tambah `className="stagger"` pada grid-cards agar kena cards tween.
2. **Ubah trigger**: edit `start: "top 78%"` di `App.tsx:50`.
3. **Parallax lebih kuat**: naikkan `*0.035` → `0.06` di `App.tsx:71`.
4. **Nonaktifkan section tertentu**: `ScrollTrigger.getAll().forEach(s=>s.kill())` atau filter `if(section.id==="rsvp") return`.

## Verifikasi

```bash
npx tsc --noEmit && vite build   # GSAP bundle ~356kb (116kb gzip)
npm run build:server && node dist-server/server/app.js
curl localhost:3000/api/health
```

Fungsi `POST /api/rsvps`, `GET/POST /api/wishes` tidak terpengaruh GSAP — pure React `fetch` via `src/lib/apiClient.ts`.

## Reduced Motion

Semua `useLayoutEffect` + `App useEffect` cek `prefers-reduced-motion: reduce` dahulu. Jika aktif → `gsap.set(... {opacity:1, y:0, scale:1})` tanpa delay/durasi. CSS fallback di `src/styles/global.css:146` juga `animation-duration: 0.01ms`.
