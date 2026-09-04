import { eventConfig } from "../../app/eventConfig";
import { useReveal } from "../../hooks/useReveal";

export function Gallery() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.1);
  return (
    <section ref={ref} className={visible ? "reveal in" : "reveal"} style={{ background: "var(--color-paper)" }}>
      <div className="container section-pad">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p className="kicker">Gallery</p>
          <h2 className="display" style={{ fontSize: "var(--text-h2)", margin: "8px 0 0", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Our Moments
          </h2>
          <p style={{ margin: "10px auto 0", maxWidth: "56ch", color: "var(--color-muted)", fontFamily: "var(--font-body)", fontSize: 15 }}>
            A glimpse of our journey — intimate, warm, and timeless, captured in editorial light.
          </p>
        </div>

        <div
          className={`stagger ${visible ? "in" : ""}`}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 12,
          }}
        >
          {/* feature - invitato radius 16 */}
          <figure className="img-hover" style={{ margin: 0, gridColumn: "span 12", aspectRatio: "16 / 9", overflow: "hidden", borderRadius: 16, border: "1px solid var(--color-line)" }}>
            <img
              src={eventConfig.gallery[4].src}
              alt={eventConfig.gallery[4].alt}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </figure>

          {/* 2-col portrait */}
          {eventConfig.gallery.slice(0, 2).map((g) => (
            <figure className="img-hover"
              key={g.src}
              style={{
                margin: 0,
                gridColumn: "span 6",
                aspectRatio: "3 / 4",
                overflow: "hidden",
                borderRadius: 16,
                background: "#eee",
                border: "1px solid var(--color-line)",
              }}
            >
              <img src={g.src} alt={g.alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: g.objectPosition }} />
            </figure>
          ))}

          {/* landscape strip - 3 */}
          {eventConfig.gallery.slice(5, 8).map((g) => (
            <figure className="img-hover"
              key={g.src}
              style={{
                margin: 0,
                gridColumn: "span 4",
                aspectRatio: "4 / 3",
                overflow: "hidden",
                borderRadius: 16,
                border: "1px solid var(--color-line)",
              }}
            >
              <img src={g.src} alt={g.alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </figure>
          ))}

          {/* tall + landscape */}
          <figure className="img-hover" style={{ margin: 0, gridColumn: "span 5", aspectRatio: "3 / 4", overflow: "hidden", borderRadius: 16, border: "1px solid var(--color-line)" }}>
            <img src={eventConfig.gallery[3].src} alt={eventConfig.gallery[3].alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </figure>
          <figure className="img-hover" style={{ margin: 0, gridColumn: "span 7", aspectRatio: "4 / 3", overflow: "hidden", borderRadius: 16, border: "1px solid var(--color-line)" }}>
            <img src={eventConfig.gallery[8].src} alt={eventConfig.gallery[8].alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </figure>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          div[style*="gridTemplateColumns: repeat(12"] figure { grid-column: span 12 !important; }
          div[style*="gridTemplateColumns: repeat(12"] figure:nth-child(n+2) { grid-column: span 6 !important; }
        }
        @media (max-width: 480px) {
          div[style*="gridTemplateColumns: repeat(12"] figure { grid-column: span 12 !important; }
        }
      `}</style>
    </section>
  );
}
