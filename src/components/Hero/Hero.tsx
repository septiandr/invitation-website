import { eventConfig } from "../../app/eventConfig";
import { useReveal } from "../../hooks/useReveal";

export function Hero() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.2);
  return (
    <section
      id="hero"
      ref={ref}
      className={`section-pad ${visible ? "reveal in" : "reveal"}`}
      style={{ background: "var(--color-paper)" }}
    >
      <div className="container" style={{ textAlign: "center" }}>
        <p className="kicker">We are getting married</p>
        <h2
          className="display"
          style={{ fontSize: "var(--text-h1)", margin: "12px 0 12px", letterSpacing: "-0.02em" }}
        >
          {eventConfig.coupleNames}
        </h2>
        <p style={{ maxWidth: "60ch", margin: "0 auto", color: "#4a4a4a", fontSize: 16 }}>
          With joyful hearts, we invite you to witness and celebrate our sacred vows of love and commitment.
          Your presence will make our day truly unforgettable.
        </p>

        <div
          style={{
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 16,
            justifyItems: "center",
          }}
        >
          <figure
            style={{
              margin: 0,
              width: "min(100%, 520px)",
              aspectRatio: "4 / 5",
              overflow: "hidden",
              background: "#ddd",
              borderRadius: 4,
            }}
          >
            <img
              src="/assets/1.png"
              alt="Portrait of Ricky & Felly"
              loading="eager"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%" }}
            />
          </figure>
          <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--color-muted)", margin: 0 }}>
            “Love is not about how much you say I love you, but how much you can prove it.”
          </p>
        </div>
      </div>
    </section>
  );
}
