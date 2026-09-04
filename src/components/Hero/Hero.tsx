import { getGuestName, getLang, t } from "../../lib/i18n";
import { eventConfig } from "../../app/eventConfig";

export function Hero() {
  const lang = getLang();
  const guest = getGuestName(t(lang, "Keluarga & Teman-teman", "Family & Friends"));
  return (
    <section id="hero" style={{ background: "#D5DADE", padding: "54px 24px 30px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 430, margin: "0 auto", minHeight: 820 }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 19, color: "#2C3F4E", margin: 0 }}>
          {t(lang, "Kepada Bapak/Ibu/Saudara/i,", "Dear Mr/Mrs/Ms,")}
        </p>
        <p style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "#2C3F4E", margin: "8px 0 0" }}>{guest}</p>

        <div style={{ marginTop: 28, lineHeight: 1.1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "#2C3F4E" }}>Ricky</div>
          <div style={{ fontFamily: "var(--font-script)", fontSize: 66, fontWeight: 300, margin: "-6px 0", color: "#2C3F4E" }}>and</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "#2C3F4E" }}>Fellycia</div>
        </div>

        <blockquote style={{ maxWidth: 340, margin: "22px auto 0", fontFamily: "var(--font-body)", fontSize: 19, lineHeight: 1.6, color: "#2C3F4E" }}>
          “{eventConfig.quote.text}”
        </blockquote>
        <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, textTransform: "uppercase", fontSize: 15, marginTop: 20, color: "#2C3F4E" }}>— {eventConfig.quote.source}</p>

        {/* layered welcome visual: wide bg + portrait overlay */}
        <div style={{ position: "relative", marginTop: "30%" }}>
          <img src="/assets/5.png" alt="Welcome background" loading="lazy"
            style={{ width: "100%", height: 440, maxWidth: 500, objectFit: "cover", objectPosition: "center", margin: "0 auto", display: "block" }} />
          <img src="/assets/1.png" alt="Ricky and Fellycia" loading="eager"
            style={{ position: "absolute", top: "-18%", left: "50%", transform: "translateX(-50%)", width: 273, height: 420, maxWidth: "70%", objectFit: "cover", objectPosition: "50% 20%", zIndex: 2, border: "6px solid #fff", boxShadow: "0 12px 32px rgba(44,63,78,.2)" }} />
        </div>
        <p style={{ marginTop: 18, fontFamily: "var(--font-body)", fontSize: 17, color: "#737373" }}>
          {t(lang, "Dengan penuh sukacita, kami menyambut Anda di halaman kisah cinta kami.", "Together with joyful hearts, we welcome you to our love story.")}
        </p>
      </div>
    </section>
  );
}
