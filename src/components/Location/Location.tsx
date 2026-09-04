import { eventConfig } from "../../app/eventConfig";
import { useReveal } from "../../hooks/useReveal";

export function Location() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section ref={ref} id="location" className={visible ? "reveal in" : "reveal"} style={{ background: "var(--color-paper)" }}>
      <div className="container section-pad">
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <p className="kicker">Location</p>
          <h2 className="display" style={{ fontSize: "var(--text-h2)", margin: "8px 0 0" }}>
            Find Us
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
            alignItems: "start",
          }}
        >
          <div style={{ background: "white", border: "1px solid var(--color-line)", padding: 28, borderRadius: 4 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, margin: "0 0 8px" }}>{eventConfig.venue.name}</h3>
            <p style={{ margin: 0, color: "#4a4a4a", fontSize: 14, lineHeight: 1.7 }}>{eventConfig.venue.address}</p>
            <div className="divider" style={{ margin: "18px 0" }} />
            <a
              href={eventConfig.venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ textDecoration: "none" }}
            >
              Buka di Google Maps
            </a>
            <p style={{ margin: "10px 0 0", fontSize: 12, color: "var(--color-muted)" }}>
              Pin lokasi mengarah ke drop-point venue. Parkir tersedia di basement.
            </p>
          </div>

          <div
            style={{
              border: "1px solid var(--color-line)",
              overflow: "hidden",
              borderRadius: 4,
              background: "#e9e9e9",
              aspectRatio: "4 / 3",
              minHeight: 320,
            }}
          >
            {eventConfig.venue.embedUrl ? (
              <iframe
                title="Peta lokasi"
                src={eventConfig.venue.embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 320 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div style={{ display: "grid", placeItems: "center", height: "100%", padding: 20, textAlign: "center" }}>
                <p style={{ color: "var(--color-muted)" }}>Embed peta tidak tersedia — gunakan tombol Google Maps.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
