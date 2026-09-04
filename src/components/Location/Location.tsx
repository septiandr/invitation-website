import { eventConfig } from "../../app/eventConfig";
import { getLang, t } from "../../lib/i18n";
export function Location() {
  const lang = getLang();
  return (
    <section id="location" style={{ background: "#fff" }}>
      <div className="container section-pad" style={{ maxWidth: 430 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <p className="kicker">{t(lang, "Lokasi", "Location")}</p>
          <h2 className="display" style={{ fontSize: 28, margin: "8px 0 0", letterSpacing: "0.06em", textTransform: "uppercase" }}>{t(lang, "Temukan Kami", "Find Us")}</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18, alignItems: "start" }}>
          <div style={{ background: "var(--color-paper)", border: "1px solid var(--color-line)", padding: 28, borderRadius: 16 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, margin: "0 0 8px", letterSpacing: "0.04em", textTransform: "uppercase" }}>{eventConfig.venue.name}</h3>
            <p style={{ margin: 0, color: "var(--color-ink)", fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.7 }}>{eventConfig.venue.address}</p>
            <div className="divider" style={{ margin: "18px 0" }} />
            <a href={eventConfig.venue.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ textDecoration: "none" }}>Buka di Google Maps</a>
            <p style={{ margin: "10px 0 0", fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--color-muted)" }}>Pin lokasi mengarah ke drop-point venue. Parkir tersedia di basement.</p>
          </div>
          <div style={{ border: "1px solid var(--color-line)", overflow: "hidden", borderRadius: 16, background: "#e9e9e9", aspectRatio: "4 / 3", minHeight: 320 }}>
            {eventConfig.venue.embedUrl ? (
              <iframe title="Peta lokasi" src={eventConfig.venue.embedUrl} width="100%" height="100%" style={{ border: 0, minHeight: 320 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            ) : (
              <div style={{ display: "grid", placeItems: "center", height: "100%", padding: 20, textAlign: "center" }}><p style={{ color: "var(--color-muted)" }}>Embed peta tidak tersedia -- gunakan tombol Google Maps.</p></div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
