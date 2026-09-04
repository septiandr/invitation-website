import { useCountdown } from "../../hooks/useCountdown";
import { eventConfig } from "../../app/eventConfig";
import { useReveal } from "../../hooks/useReveal";

function Box({ value, label }: { value: number; label: string }) {
  return (
    <div
      style={{
        minWidth: 86,
        padding: "18px 10px",
        background: "white",
        border: "1px solid var(--color-line)",
        textAlign: "center",
        borderRadius: 4,
      }}
    >
      <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1, fontWeight: 600 }}>
        {String(value).padStart(2, "0")}
      </div>
      <div style={{ marginTop: 6, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-muted)", fontWeight: 600 }}>
        {label}
      </div>
    </div>
  );
}

export function Countdown() {
  const { days, hours, minutes, seconds, isPast } = useCountdown(eventConfig.eventDate);
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section
      ref={ref}
      className={visible ? "reveal in" : "reveal"}
      style={{ background: "#fff", borderBlock: "1px solid var(--color-line)" }}
    >
      <div className="container" style={{ padding: "48px 0", textAlign: "center" }}>
        <p className="kicker">Save the date</p>
        <h2 className="display" style={{ fontSize: "var(--text-h2)", margin: "8px 0 6px" }}>
          Menuju Hari Bahagia
        </h2>
        <p style={{ margin: 0, color: "var(--color-muted)", fontSize: 14 }}>20 December 2026 • Jakarta • 09:00 WIB</p>

        {isPast ? (
          <div style={{ marginTop: 28, padding: 20, background: "var(--color-paper)", borderRadius: 4 }}>
            <p style={{ margin: 0, fontWeight: 600 }}>Acara telah berlangsung — terima kasih atas doa dan restunya.</p>
          </div>
        ) : (
          <div style={{ marginTop: 28, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Box value={days} label="Hari" />
            <Box value={hours} label="Jam" />
            <Box value={minutes} label="Menit" />
            <Box value={seconds} label="Detik" />
          </div>
        )}
      </div>
    </section>
  );
}
