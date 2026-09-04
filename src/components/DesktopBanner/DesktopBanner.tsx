import { eventConfig } from "../../app/eventConfig";
import { getLang, t } from "../../lib/i18n";

/**
 * Banner desktop (3/4 kiri). Hanya tampil saat viewport lebar (lihat CSS `.desktop-banner`).
 * Foto + overlay nama pasangan; posisi foto bisa diatur lewat eventConfig.desktopBanner.
 */
export function DesktopBanner() {
  const lang = getLang();
  const banner = eventConfig.desktopBanner ?? { image: "/assets/9.png", objectPosition: "50% 42%" };

  return (
    <aside className="desktop-banner" aria-label="Banner undangan Ricky & Fellycia">
      <img
        src={banner.image}
        alt=""
        aria-hidden
        loading="lazy"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: banner.objectPosition ?? "50% 42%",
        }}
      />
      {/* overlay supaya teks tetap terbaca */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(100deg, rgba(44,63,78,0.55) 0%, rgba(50,48,48,0.30) 45%, rgba(50,48,48,0.10) 100%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(50,48,48,0.55), transparent 42%)",
        }}
      />

      {/* komposisi nama */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#FEFEFE",
          padding: "0 clamp(20px, 4vw, 72px)",
        }}
      >
        <p
          className="kicker"
          style={{ color: "rgba(255,255,255,0.9)", margin: 0, letterSpacing: "0.34em", fontSize: 11 }}
        >
          {t(lang, "Undangan Pernikahan", "The Wedding of")}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(12px, 2vw, 34px)", marginTop: "clamp(10px, 2vh, 22px)", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(34px, 4.2vw, 88px)", lineHeight: 1, letterSpacing: "0.04em" }}>
            {eventConfig.groom.nickname}
          </span>
          <span className="script" style={{ fontSize: "clamp(40px, 4.6vw, 96px)", marginTop: "0.3em" }}>
            &amp;
          </span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(34px, 4.2vw, 88px)", lineHeight: 1, letterSpacing: "0.04em" }}>
            {eventConfig.bride.nickname}
          </span>
        </div>

        <div
          style={{
            marginTop: "clamp(16px, 3vh, 30px)",
            width: "min(220px, 40%)",
            height: 1,
            background: "linear-gradient(to right, transparent, rgba(255,255,255,0.7), transparent)",
          }}
        />
        <p style={{ margin: "clamp(14px, 2.5vh, 24px) 0 0", fontFamily: "var(--font-body)", fontSize: "clamp(16px, 1.4vw, 24px)", color: "#FEFEFE" }}>
          20 • 12 • 2026
        </p>
      </div>

      {/* petunjuk kecil pojok kanan-bawah banner */}
      <p
        style={{
          position: "absolute",
          right: 26,
          bottom: 22,
          margin: 0,
          fontFamily: "var(--font-ui)",
          fontSize: 10,
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.75)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {t(lang, "Undangan digital", "Scroll the invitation")}
        <span aria-hidden style={{ fontSize: 14 }}>→</span>
      </p>
    </aside>
  );
}
