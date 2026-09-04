import { useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Cover } from "../components/Cover/Cover";
import { Hero } from "../components/Hero/Hero";
import { DesktopBanner } from "../components/DesktopBanner/DesktopBanner";
import { Countdown } from "../components/Countdown/Countdown";
import { EventDetails } from "../components/EventDetails/EventDetails";
import { Gallery } from "../components/Gallery/Gallery";
import { PreWedding } from "../components/PreWedding/PreWedding";
import { Location } from "../components/Location/Location";
import { RsvpForm } from "../components/RsvpForm/RsvpForm";
import { Wishes } from "../components/Wishes/Wishes";
import { MusicControl } from "../components/MusicControl/MusicControl";
import { OpeningQuote, CoupleProfile, LoveStory, WeddingGift, GuestQr, Closing } from "../components/InvitationSections";
import { getLang, setLang, t } from "../lib/i18n";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const NAV = [
  { id: "couple", idLabel: "Mempelai", enLabel: "Couple" },
  { id: "details", idLabel: "Detail Acara", enLabel: "Details" },
  { id: "countdown", idLabel: "Hitung Mundur", enLabel: "Countdown" },
  { id: "gallery", idLabel: "Galeri", enLabel: "Gallery" },
  { id: "prewedding", idLabel: "Pre Wedding & Live", enLabel: "Pre Wedding & Live" },
  { id: "location", idLabel: "Lokasi", enLabel: "Location" },
  { id: "rsvp", idLabel: "RSVP", enLabel: "RSVP" },
  { id: "wishes", idLabel: "Ucapan", enLabel: "Wishes" },
  { id: "gift", idLabel: "Tanda Kasih", enLabel: "Gift" },
];

function FloatingChrome() {
  const lang = getLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const go = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <>
      {/* hamburger bottom-left */}
      <button onClick={() => setMenuOpen((v) => !v)} aria-label="Menu"
        style={{ position: "fixed", left: 12, bottom: 12, zIndex: 70, width: 44, height: 44, borderRadius: "50%", border: "none", background: "#2C3F4E", color: "#fff", fontSize: 20, cursor: "pointer", boxShadow: "0 6px 20px rgba(0,0,0,.3)" }}>
        {menuOpen ? "✕" : "☰"}
      </button>
      {menuOpen && (
        <div role="dialog" aria-label="Navigasi"
          style={{ position: "fixed", inset: 0, zIndex: 69, background: "rgba(0,0,0,.45)" }} onClick={() => setMenuOpen(false)}>
          <nav onClick={(e) => e.stopPropagation()}
            style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "min(85vw, 300px)", background: "#2C3F4E", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
            <p style={{ fontFamily: "var(--font-display)", color: "#FEFEFE", fontSize: 22, margin: "0 0 8px", textAlign: "right" }}>Ricky & Fellycia</p>
            {NAV.map((n) => (
              <button key={n.id} onClick={() => go(n.id)}
                style={{ background: "none", border: "none", color: "#FEFEFE", textAlign: "right", fontFamily: "var(--font-ui)", fontSize: 13, letterSpacing: 3, textTransform: "uppercase", padding: "10px 4px", cursor: "pointer" }}>
                {t(lang, n.idLabel, n.enLabel)}
              </button>
            ))}
            <div style={{ height: 2, background: "rgba(255,255,255,.4)", margin: "12px 0", opacity: 0.4 }} />
            <p style={{ color: "rgba(255,255,255,.8)", fontSize: 12, textAlign: "right", margin: 0 }}>Created with Love by Invitato</p>
          </nav>
        </div>
      )}
      {/* language bottom-right */}
      <button onClick={() => setLang(lang === "id" ? "en" : "id")} aria-label="Ganti bahasa"
        style={{ position: "fixed", right: 72, bottom: 16, zIndex: 60, height: 36, borderRadius: 18, border: "1px solid var(--color-line)", background: "#fff", padding: "0 14px", fontFamily: "var(--font-ui)", fontSize: 12, letterSpacing: "0.08em", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,.15)" }}>
        🌐 {lang.toUpperCase()}
      </button>
    </>
  );
}

export default function App() {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpen = useCallback(() => {
    // IMPORTANT: call .play() synchronously inside the click gesture.
    // iOS Safari / Chrome mobile reject play() when deferred via setTimeout/useEffect.
    const audio = document.getElementById("bg-music") as HTMLAudioElement | null;
    if (audio) {
      audio.volume = 0.6;
      audio.play().catch((err) => {
        // Retry once after a tick (media may still be loading) + unlock on next touch
        console.warn("[music] initial play() failed, will retry on interaction:", err);
        const retry = () => {
          audio.play().then(() => {
            document.removeEventListener("touchend", retry);
            document.removeEventListener("click", retry);
          }).catch(() => {});
        };
        document.addEventListener("touchend", retry, { once: true });
        document.addEventListener("click", retry, { once: true });
        setTimeout(retry, 500);
      });
    }
    setIsOpened(true);
    // Scroll halus ke konten undangan ditangani di useEffect([isOpened])
    // agar cover tetap menempati alur dokumen saat scroll berlangsung.
  }, []);

  // Sebelum dibuka: kunci scroll agar cover menjadi “layar pertama” penuh.
  // Setelah klik, scroll dilepas dan halaman benar-benar digulir ke konten.
  useEffect(() => {
    document.body.style.overflow = isOpened ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpened]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduceMotion) return;
      // Hanya animasikan anak .stagger (bukan article pembungkusnya) agar tidak double-hidden.
      // immediateRender:false agar konten tetap terlihat kalau trigger belum aktif / gagal refresh.
      gsap.utils.toArray<HTMLElement>(".page-content section").forEach((section) => {
        const heading = section.querySelectorAll(".kicker, h2, h3");
        const media = section.querySelectorAll("img, iframe");
        const cards = section.querySelectorAll(".stagger > *, form");
        if (heading.length) {
          gsap.fromTo(heading, { opacity: 0, y: 35, filter: "blur(6px)" }, {
            opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.1, immediateRender: false,
            scrollTrigger: { trigger: section, start: "top 88%", once: true },
          });
        }
        if (media.length) {
          gsap.fromTo(media, { opacity: 0, scale: 1.06, y: 24 }, {
            opacity: 1, scale: 1, y: 0, duration: 1.1, ease: "power3.out", stagger: 0.1, immediateRender: false,
            scrollTrigger: { trigger: section, start: "top 85%", once: true },
          });
        }
        if (cards.length) {
          gsap.fromTo(cards, { opacity: 0, y: 28 }, {
            opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, immediateRender: false,
            scrollTrigger: { trigger: section, start: "top 85%", once: true },
          });
        }
      });
    });
    // Refresh posisi trigger setelah font/gambar/cover berubah agar section tidak stuck opacity:0
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = setTimeout(refresh, 800);
    return () => { window.removeEventListener("load", refresh); clearTimeout(t); ctx.revert(); };
  }, []);

  useEffect(() => {
    if (!isOpened) return;
    // Alur buka: cover adalah “layar pertama” dalam alur dokumen (100svh).
    // Klik → halaman benar-benar di-scroll halus ke bawah ke konten undangan
    // (scrollbar bergerak) via GSAP ScrollToPlugin — tween per-frame jadi
    // mulus di semua browser, tidak bergantung dukungan smooth-scroll asli.
    const coverEl = document.querySelector<HTMLElement>(".cover-layer");
    const hero = document.getElementById("hero");
    if (!coverEl || !hero) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = hero.getBoundingClientRect().top + window.scrollY;
    let finished = false;

    const html = document.documentElement;
    const prevScrollBehavior = html.style.scrollBehavior;

    const hideCover = () => {
      if (finished) return;
      finished = true;
      gsap.set(".cover-layer", { display: "none" });
      // Penghapusan cover menggeser konten naik setinggi cover; kompensasi
      // langsung di frame yang sama agar tampilan tidak berubah mendadak.
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      html.style.scrollBehavior = prevScrollBehavior;
      ScrollTrigger.refresh();
    };

    // Matikan sementara CSS scroll-behavior:smooth agar tween per-frame 1:1
    // (kalau tetap smooth, setiap langkah malah memicu scroll asli yang tertunda).
    // Pengguna dengan prefers-reduced-motion tetap mendapat scroll (permintaan
    // klien), hanya lebih pendek & sederhana agar geraknya tidak berlebihan.
    html.style.scrollBehavior = "auto";
    gsap.to(window, {
      scrollTo: { y: target, autoKill: true },
      duration: reduce ? 0.6 : 1.15,
      ease: reduce ? "power1.inOut" : "power2.inOut",
      onComplete: hideCover,
      // Pengguna menyela scroll → hentikan & langsung selesaikan tanpa macet.
      onInterrupt: hideCover,
    });
  }, [isOpened]);

  return (
    <div className="invite-shell">
      {/* cover = gerbang penuh layar di alur dokumen; setelah dibuka halaman
          benar-benar di-scroll turun ke konten, lalu cover disembunyikan */}
      <div className="cover-layer">
        <Cover isOpened={isOpened} onOpen={handleOpen} />
      </div>

      {/* banner 3/4 (desktop, kiri, sticky) + undangan digital 1/4 (kanan) */}
      <DesktopBanner />

      {/* order mirrors invitato: welcome/hero, quote, couple, countdown, details, gallery, location, rsvp, wishes, gift, qr, footer */}
      <div className="page-content">
        <Hero />
        <OpeningQuote />
        <CoupleProfile />
        <Countdown />
        <EventDetails />
        <Gallery />
        <PreWedding />
        <Location />
        <RsvpForm />
        <Wishes />
        <WeddingGift />
        <GuestQr />
        <Closing />
      </div>

      <MusicControl isOpened={isOpened} />
      <FloatingChrome />
    </div>
  );
}
