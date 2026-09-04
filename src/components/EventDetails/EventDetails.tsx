import { eventConfig } from "../../app/eventConfig";

export function EventDetails() {
  return (
    <section className="section-pad" style={{ background: "var(--color-paper-alt)" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <p className="kicker">Our special day</p>
          <h2 className="display" style={{ fontSize: "var(--text-h2)", margin: "8px 0 0", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Rangkaian Acara
          </h2>
        </div>
        <div className="stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
          {eventConfig.events.map((ev) => (
            <div key={ev.title} style={{ background: "var(--color-paper)", border: "1px solid var(--color-line)", padding: 28, borderRadius: 16, transition: "transform 300ms cubic-bezier(0.22,1,0.36,1), box-shadow 300ms ease" }}
              onMouseEnter={(e) => { const t = e.currentTarget as HTMLDivElement; t.style.transform = "translateY(-4px)"; t.style.boxShadow = "0 10px 28px rgba(44,63,78,0.12)"; }}
              onMouseLeave={(e) => { const t = e.currentTarget as HTMLDivElement; t.style.transform = "translateY(0)"; t.style.boxShadow = "none"; }}>
              <p className="kicker" style={{ color: "var(--color-muted)" }}>{ev.date}</p>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, margin: "8px 0 8px", lineHeight: 1.1, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-ink)" }}>{ev.title}</h3>
              <p style={{ margin: 0, fontFamily: "var(--font-ui)", fontWeight: 400, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-ink)" }}>{ev.startTime} {ev.endTime ? `- ${ev.endTime}` : ""}</p>
              <p style={{ margin: "6px 0 0", color: "var(--color-muted)", fontFamily: "var(--font-body)", fontSize: 14, fontStyle: "italic" }}>{ev.location}</p>
              <div className="divider" style={{ margin: "16px 0" }} />
              <p style={{ margin: 0, color: "var(--color-ink)", fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.75 }}>{ev.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
