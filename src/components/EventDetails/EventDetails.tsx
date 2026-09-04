import { eventConfig } from "../../app/eventConfig";
import { getLang, t } from "../../lib/i18n";

export function EventDetails() {
  const lang = getLang();
  const cal = (title: string) =>
    `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=20261220T020000Z/20261220T040000Z&location=${encodeURIComponent(eventConfig.venue.name)}`;
  return (
    <section id="details" style={{ background: "#D5DADE", padding: "48px 24px", textAlign: "center" }}>
      <div style={{ maxWidth: 430, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#2C3F4E", margin: 0 }}>
          {t(lang, "Waktu & Tempat", "Place & Time")}
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 19, color: "#2C3F4E", margin: "12px 0 0" }}>
          {t(lang, "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara kami.", "Together with joyful hearts, we cordially invite you to our wedding celebration.")}
        </p>
        <div style={{ width: 2.5, height: 80, background: "#737373", borderRadius: 3, margin: "24px auto" }} />
        <p style={{ fontFamily: "var(--font-body)", fontSize: 17, color: "#737373", margin: 0 }}>{t(lang, "Tanggal:", "Date:")}</p>
        <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 33, color: "#2C3F4E", margin: "6px 0 0" }}>
          Sabtu, 20 Desember 2026
        </p>

        {eventConfig.events.map((ev, i) => (
          // <article> = grup kartu per item: tiap agenda (Akad & Resepsi)
          // animasi sendiri saat masuk viewport (sama seperti kartu mempelai).
          <article key={ev.title} style={{ marginTop: 32 }}>
            <div style={{ fontSize: 50, color: "#737373" }} aria-hidden>{i === 0 ? "💍" : "🥂"}</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#2C3F4E", margin: "8px 0" }}>
              {i === 0 ? t(lang, "Holy Matrimony:", "Holy Matrimony:") : t(lang, "Resepsi Pernikahan:", "Reception:")} {ev.title}
            </h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 19, color: "#2C3F4E", margin: 0 }}>{ev.startTime}{ev.endTime ? ` – ${ev.endTime}` : ""}</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 19, color: "#2C3F4E", margin: "6px 0 0", fontWeight: 600 }}>{ev.location}</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 17, color: "#737373", margin: "8px 0 0" }}>{ev.description}</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
              <a href={eventConfig.venue.mapsUrl} target="_blank" rel="noreferrer"
                style={{ background: "#2C3F4E", color: "#FEFEFE", borderRadius: 25, padding: "10px 24px", fontSize: 12, fontFamily: "var(--font-ui)", textTransform: "uppercase", letterSpacing: "0.08em", textDecoration: "none" }}>
                {t(lang, "Lihat Lokasi", "See Location")}
              </a>
              <a href={cal(`Wedding of Ricky & Fellycia — ${ev.title}`)} target="_blank" rel="noreferrer"
                style={{ background: "transparent", color: "#2C3F4E", border: "1px solid #2C3F4E", borderRadius: 25, padding: "10px 24px", fontSize: 12, fontFamily: "var(--font-ui)", textTransform: "uppercase", letterSpacing: "0.08em", textDecoration: "none" }}>
                {t(lang, "Ingatkan Acara", "Remind Me")}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
