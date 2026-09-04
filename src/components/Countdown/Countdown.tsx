import { useCountdown } from "../../hooks/useCountdown";
import { eventConfig } from "../../app/eventConfig";

function Box({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ minWidth: 84, padding: "16px 12px", background: "white", border: "1px solid var(--color-line)", textAlign: "center", borderRadius: 12, minHeight: 84 }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4vw, 34px)", lineHeight: 1, fontWeight: 400, color: "var(--color-ink)" }}>{String(value).padStart(2, "0")}</div>
      <div style={{ marginTop: 6, fontFamily: "var(--font-ui)", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-muted)", fontWeight: 400 }}>{label}</div>
    </div>
  );
}
export function Countdown() {
  const { days, hours, minutes, seconds, isPast } = useCountdown(eventConfig.eventDate);
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`The Wedding of ${eventConfig.coupleNames}`)}&dates=20261220T020000Z/20261220T070000Z&location=${encodeURIComponent(eventConfig.venue.name)}&details=${encodeURIComponent("Save the date and celebrate with us.")}`;
  return (
    <section style={{ background: "var(--color-paper)", borderBlock: "1px solid var(--color-line)" }}>
      <div className="container" style={{ padding: "52px 0", textAlign: "center" }}>
        <p className="kicker">Counting down to</p>
        <h2 className="display" style={{ fontSize: "var(--text-h2)", margin: "10px 0 6px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Menuju Hari Bahagia</h2>
        <p style={{ margin: 0, color: "var(--color-muted)", fontFamily: "var(--font-body)", fontSize: 16 }}>20 December 2026 - Jakarta - 09:00 WIB</p>
        {isPast ? (
          <div style={{ marginTop: 28, padding: 18, background: "white", border: "1px solid var(--color-line)", borderRadius: 12 }}>
            <p style={{ margin: 0, fontFamily: "var(--font-body)", fontWeight: 600 }}>Acara telah berlangsung -- terima kasih atas doa dan restunya.</p>
          </div>
        ) : (
          <div className="stagger" style={{ marginTop: 28, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Box value={days} label="Hari" /><Box value={hours} label="Jam" /><Box value={minutes} label="Menit" /><Box value={seconds} label="Detik" />
          </div>
        )}
        <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="btn btn-light" style={{ marginTop: 24, textDecoration: "none" }}>Add to Calendar</a>
      </div>
    </section>
  );
}
