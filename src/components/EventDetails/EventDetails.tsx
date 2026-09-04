import { eventConfig } from "../../app/eventConfig";
import { useReveal } from "../../hooks/useReveal";

export function EventDetails() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section ref={ref} className={`section-pad ${visible ? "reveal in" : "reveal"}`} style={{ background: "var(--color-paper)" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p className="kicker">Our special day</p>
          <h2 className="display" style={{ fontSize: "var(--text-h2)", margin: "8px 0 0" }}>
            Rangkaian Acara
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {eventConfig.events.map((ev) => (
            <div
              key={ev.title}
              style={{
                background: "white",
                border: "1px solid var(--color-line)",
                padding: 28,
                borderRadius: 4,
              }}
            >
              <p className="kicker" style={{ color: "var(--color-accent)" }}>
                {ev.date}
              </p>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, margin: "8px 0 8px", lineHeight: 1 }}>
                {ev.title}
              </h3>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>
                {ev.startTime} {ev.endTime ? `— ${ev.endTime}` : ""}
              </p>
              <p style={{ margin: "4px 0 12px", color: "var(--color-muted)", fontSize: 13, letterSpacing: "0.04em" }}>
                {ev.location}
              </p>
              <div className="divider" style={{ margin: "14px 0" }} />
              <p style={{ margin: 0, color: "#4a4a4a", fontSize: 14, lineHeight: 1.7 }}>{ev.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
