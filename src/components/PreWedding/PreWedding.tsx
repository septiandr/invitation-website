import { eventConfig } from "../../app/eventConfig";
import { getLang, t } from "../../lib/i18n";

export function PreWedding() {
  const lang = getLang();
  const { prewedding, livestream } = eventConfig;
  return (
    <section id="prewedding" style={{ background: "#fff", padding: "56px 24px", textAlign: "center" }}>
      <div style={{ maxWidth: 430, margin: "0 auto" }}>
        <p className="kicker">{t(lang, "Video Kami", "Our Film")}</p>
        <h2 className="display" style={{ fontSize: 28, margin: "8px 0 0", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Pre Wedding
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: 16, color: "#737373", margin: "10px auto 0", maxWidth: "38ch" }}>
          {t(lang, "Saksikan kisah kami dalam film pendek berikut.", "Watch our story in the short film below.")}
        </p>

        {/* YT player 16:9 responsif */}
        <div style={{ marginTop: 22, borderRadius: 18, overflow: "hidden", border: "1px solid rgba(44,63,78,.15)", boxShadow: "0 16px 40px rgba(44,63,78,.18)", background: "#000" }}>
          <div style={{ position: "relative", paddingTop: "56.25%" }}>
            <iframe
              src={prewedding.youtubeEmbedUrl}
              title={prewedding.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
            />
          </div>
        </div>
        <a href={prewedding.youtubeWatchUrl} target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-block", marginTop: 12, fontFamily: "var(--font-ui)", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#2C3F4E", textDecoration: "underline" }}>
          {t(lang, "Tonton di YouTube", "Watch on YouTube")}
        </a>

        {/* livestreaming */}
        <div style={{ marginTop: 28, background: "#2C3F4E", borderRadius: 20, padding: "28px 22px", color: "#fff" }}>
          <p style={{ fontSize: 30, margin: 0 }} aria-hidden>🔴</p>
          <h3 className="display" style={{ fontSize: 24, margin: "8px 0 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {t(lang, "Siaran Langsung", "Live Streaming")}
          </h3>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 17, margin: "10px 0 0", opacity: 0.9 }}>
            {t(lang, livestream.schedule, livestream.scheduleEn)}
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 16, margin: "8px auto 0", maxWidth: "36ch", opacity: 0.8 }}>
            {t(lang, "Bagi yang berhalangan hadir, ikuti prosesi suci kami secara daring.", "For those who cannot attend, join our sacred ceremony online.")}
          </p>
          <a href={livestream.youtubeWatchUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 18, background: "#ff0000", color: "#fff", borderRadius: 25, padding: "12px 28px", fontFamily: "var(--font-ui)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", fontWeight: 600 }}>
            <span aria-hidden>▶</span> {t(lang, "Tonton Live", "Watch Live")}
          </a>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 11, margin: "12px 0 0", opacity: 0.65 }}>
            YouTube Live • {t(lang, "link aktif di hari-H", "link goes live on the day")}
          </p>
        </div>
      </div>
    </section>
  );
}
