import { eventConfig } from "../../app/eventConfig";
import { useReveal } from "../../hooks/useReveal";

export function Hero() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.2);
  return (
    <section
      id="hero"
      ref={ref}
      className={`section-pad ${visible ? "reveal in" : "reveal"}`}
      style={{ background: "var(--color-paper-alt)" }}
    >
      <div className={`container stagger ${visible ? "in" : ""}`} style={{ textAlign: "center" }}>
        <p className="kicker" style={{ color: "var(--color-muted)" }}>We are getting married</p>
        <h2
          className="display"
          style={{ fontSize: "var(--text-h1)", margin: "12px 0 8px", letterSpacing: "0.06em", textTransform: "uppercase" }}
        >
          Ricky <span className="script" style={{ textTransform: "none", letterSpacing: 0, fontSize: "0.9em", color: "var(--color-ink)", margin: "0 6px" }}>&</span> Felly
        </h2>
        <p style={{ maxWidth: "58ch", margin: "0 auto", color: "var(--color-muted)", fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.8 }}>
          With joyful hearts, we invite you to witness and celebrate our sacred vows of love and commitment.
          Your presence will make our day truly unforgettable.
        </p>

        <div
          style={{
            marginTop: 36,
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 18,
            justifyItems: "center",
          }}
        >
          <figure
            className="img-hover"
            style={{
              margin: 0,
              width: "min(100%, 560px)",
              aspectRatio: "4 / 4.8",
              overflow: "hidden",
              background: "#ddd",
              borderRadius: 16,
              border: "1px solid var(--color-line)",
            }}
          >
            <img
              src="/assets/1.png"
              alt="Portrait of Ricky & Felly"
              loading="eager"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%" }}
            />
          </figure>
          <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", color: "var(--color-muted)", margin: 0, fontSize: 16, maxWidth: "48ch" }}>
            “Love is not about how much you say I love you, but how much you can prove it.”
          </p>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-muted)", margin: 0 }}>
            — Ricky & Felly
          </p>
        </div>
      </div>
    </section>
  );
}
