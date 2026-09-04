import { useEffect, useRef, useState } from "react";
import { eventConfig } from "../../app/eventConfig";
import { getLang, t } from "../../lib/i18n";

const AUTOPLAY_MS = 3500;

export function Gallery() {
  const lang = getLang();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const imgs = eventConfig.gallery.slice(0, 5);

  // auto swipe — jeda saat hover/sentuh/tab hidden
  useEffect(() => {
    if (paused || document.hidden) return;
    const id = setInterval(() => setActive((a) => (a + 1) % imgs.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, imgs.length]);

  useEffect(() => {
    const handle = () => { if (!document.hidden) setPaused(false); };
    document.addEventListener("visibilitychange", handle);
    return () => document.removeEventListener("visibilitychange", handle);
  }, []);
  return (
    <section id="gallery" style={{ background: "#D5DADE", padding: "64px 24px 46px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <svg viewBox="0 0 400 120" aria-hidden style={{ position: "absolute", top: "-2%", left: "6%", width: "130%", opacity: 0.66, color: "#fff", pointerEvents: "none" }}>
        <path d="M0,60 C100,120 300,0 400,60" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <div style={{ maxWidth: 430, margin: "0 auto", position: "relative" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: 19, color: "#2C3F4E", margin: 0 }}>A PORTRAIT OF</p>
        <h2 style={{ margin: "6px 0 0", lineHeight: 1.1, fontWeight: 400 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "#2C3F4E" }}>Ricky</span>{" "}
          <span style={{ fontFamily: "var(--font-script)", fontSize: 40, color: "#2C3F4E" }}>and</span>{" "}
          <span style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "#2C3F4E" }}>Fellycia</span>
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 19, color: "#2C3F4E", margin: "12px 0 0" }}>
          “{t(lang, "Setiap momen bersamamu adalah anugerah.", "Every moment with you is a blessing.")}”
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 17, color: "#2C3F4E", margin: "6px 0 0" }}>#RickyFelly</p>

        <div style={{ width: "100%", margin: "26px auto 0" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={(e) => { setPaused(true); touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const start = touchX.current;
            touchX.current = null;
            setPaused(false);
            if (start == null) return;
            const dx = e.changedTouches[0].clientX - start;
            if (Math.abs(dx) < 30) return;
            setActive((a) => (dx < 0 ? (a + 1) % imgs.length : (a - 1 + imgs.length) % imgs.length));
          }}
        >
          <div style={{ position: "relative", borderRadius: 16, overflow: "hidden" }}>
            {/* Tanpa key agar node <img> stabil: GSAP tetap bisa menganimasikan
                elemen yang sama meski src berganti tiap slide (auto swipe). */}
            <img src={imgs[active].src} alt={imgs[active].alt}
              style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: 16, display: "block" }} />
            <button onClick={() => setActive((a) => (a - 1 + imgs.length) % imgs.length)} aria-label="Sebelumnya"
              style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", border: "none", background: "rgba(0,0,0,.45)", color: "#fff", fontSize: 18, cursor: "pointer" }}>‹</button>
            <button onClick={() => setActive((a) => (a + 1) % imgs.length)} aria-label="Berikutnya"
              style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", border: "none", background: "rgba(0,0,0,.45)", color: "#fff", fontSize: 18, cursor: "pointer" }}>›</button>
          </div>
          {/* progress dots */}
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 10 }}>
            {imgs.map((g, i) => (
              <span key={g.src} style={{ width: i === active ? 20 : 8, height: 8, borderRadius: 999, background: i === active ? "#2C3F4E" : "rgba(44,63,78,.25)", transition: "width .3s" }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}>
            {imgs.map((g, i) => (
              <button key={g.src} onClick={() => setActive(i)} aria-label={`Foto ${i + 1}`}
                style={{ border: i === active ? "3px solid #2C3F4E" : "3px solid transparent", borderRadius: 8, padding: 0, cursor: "pointer", background: "none" }}>
                <img src={g.src} alt="" loading="lazy" style={{ width: 75, height: 50, objectFit: "cover", borderRadius: 8, display: "block" }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
