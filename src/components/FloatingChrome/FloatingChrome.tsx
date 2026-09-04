import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { getLang, setLang, t } from "../../lib/i18n";

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

type Props = {
  /** Slot tombol musik (dari MusicControl) di antara spacer dan bahasa. */
  music: ReactNode;
};

/**
 * Chrome melayang: drawer navigasi + satu bar bawah
 * (menu | spacer | musik | bahasa) yang proporsional di semua resolusi.
 */
export function FloatingChrome({ music }: Props) {
  const lang = getLang();
  const [menuOpen, setMenuOpen] = useState(false);
  // Bar disembunyikan saat pengguna mencapai ujung bawah agar footer terlihat.
  const [atEnd, setAtEnd] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = endRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setAtEnd(e.isIntersecting), {
      threshold: 0,
      // Anggap "sampai ujung" 100px sebelum mentok agar bar sudah pergi
      // saat strip footer masuk.
      rootMargin: "0px 0px 100px 0px",
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const go = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigasi"
          className="chrome-overlay"
          onClick={() => setMenuOpen(false)}
        >
          <nav onClick={(e) => e.stopPropagation()} className="chrome-drawer">
            <div className="chrome-drawer-head">
              <p className="chrome-drawer-title">Ricky & Fellycia</p>
              <button
                className="chrome-drawer-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Tutup menu"
              >
                ✕
              </button>
            </div>
            {NAV.map((n) => (
              <button key={n.id} onClick={() => go(n.id)} className="chrome-drawer-item">
                {t(lang, n.idLabel, n.enLabel)}
              </button>
            ))}
            <div
              style={{ height: 2, background: "rgba(255,255,255,.4)", margin: "12px 0", opacity: 0.4 }}
            />
            <p
              style={{ color: "rgba(255,255,255,.8)", fontSize: 12, textAlign: "right", margin: 0 }}
            >
              Created with Love by Invitato
            </p>
          </nav>
        </div>
      )}
      <div className="chrome-bar" data-hidden={atEnd}>
        <button
          className="chrome-circle"
          onClick={() => setMenuOpen(true)}
          aria-label="Buka menu navigasi"
          aria-expanded={menuOpen}
        >
          ☰
        </button>
        <div className="chrome-spacer" aria-hidden />
        {music}
        <button
          className="chrome-pill chrome-lang"
          onClick={() => setLang(lang === "id" ? "en" : "id")}
          aria-label="Ganti bahasa"
        >
          <span aria-hidden>🌐</span> {lang.toUpperCase()}
        </button>
      </div>
      {/* penanda ujung halaman untuk menyembunyikan bar di atas footer */}
      <div ref={endRef} aria-hidden style={{ height: 1 }} />
    </>
  );
}
