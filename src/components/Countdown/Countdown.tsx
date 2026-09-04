import { useCountdown } from "../../hooks/useCountdown";
import { eventConfig } from "../../app/eventConfig";
import { getLang, t } from "../../lib/i18n";

export function Countdown() {
  const lang = getLang();
  const { days, hours, minutes, seconds, isPast } = useCountdown(eventConfig.eventDate);
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Wedding of Ricky & Fellycia by Invitato.net`)}&dates=20261220T020000Z/20261220T040000Z&location=${encodeURIComponent(eventConfig.venue.name)}&details=${encodeURIComponent("Save the date")}`;

  const Cell = ({ v, label }: { v: number; label: string }) => (
    <div style={{ textAlign: "center", minWidth: 64 }}>
      <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 54, lineHeight: 1, color: "#FEFEFE" }}>{String(v).padStart(2, "0")}</div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 17, color: "#FEFEFE", marginTop: 4 }}>{label}</div>
    </div>
  );
  const Colon = () => <div style={{ fontSize: 26, color: "#FEFEFE", transform: "translateY(-18px)" }}>:</div>;

  return (
    <section id="countdown" style={{ background: "#323030", position: "relative", overflow: "hidden" }}>
      {/* bg layer grayscale 41% */}
      <div style={{ maxHeight: 400, overflow: "hidden" }}>
        <img src="/assets/6.png" alt="" aria-hidden loading="lazy"
          style={{ width: "100%", height: 315, objectFit: "cover", opacity: 0.41, filter: "grayscale(100%)" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 20, color: "#FEFEFE", margin: 0 }}>
          Counting the Days!
        </h2>
        {isPast ? (
          <p style={{ color: "#FEFEFE", fontFamily: "var(--font-body)", fontSize: 19 }}>Acara telah berlangsung — terima kasih.</p>
        ) : (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 16 }}>
            <Cell v={days} label={t(lang, "Hari", "Days")} /><Colon />
            <Cell v={hours} label={t(lang, "Jam", "Hours")} /><Colon />
            <Cell v={minutes} label={t(lang, "Menit", "Minutes")} /><Colon />
            <Cell v={seconds} label={t(lang, "Detik", "Seconds")} />
          </div>
        )}
        <a href={calendarUrl} target="_blank" rel="noreferrer"
          style={{ marginTop: 20, background: "#2C3F4E", color: "#FEFEFE", borderRadius: 25, padding: "10px 28px", fontFamily: "var(--font-ui)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", display: "inline-block" }}>
          {t(lang, "Ingatkan Acara", "Remind Me")}
        </a>
      </div>
    </section>
  );
}
