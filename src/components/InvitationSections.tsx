import { useState } from "react";
import { eventConfig } from "../app/eventConfig";
import { getLang, t } from "../lib/i18n";

function SectionHeading({ eyebrow, title, dark }: { eyebrow: string; title: string; dark?: boolean }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 24 }}>
      <p className="kicker" style={{ color: dark ? "rgba(255,255,255,.7)" : undefined }}>{eyebrow}</p>
      <h2 className="display" style={{ fontSize: 28, margin: "8px 0 0", textTransform: "uppercase", letterSpacing: "0.06em", color: dark ? "#fff" : undefined }}>{title}</h2>
    </div>
  );
}

/** Pita teks berjalan dekoratif (CSS keyframes, tanpa JS per frame). */
export function MarqueeStrip() {
  const seq = "Ricky & Fellycia  ✦  20 • 12 • 2026  ✦  ";
  const line = seq.repeat(1);
  return (
    <section aria-hidden className="marquee-strip">
      <div className="marquee-track">
        <span>{line}</span>
        <span>{line}</span>
      </div>
    </section>
  );
}

export function OpeningQuote() {  const lang = getLang();
  return (
    <section style={{ background: "#323030", color: "white", textAlign: "center", padding: "56px 24px" }}>
      <div style={{ maxWidth: 430, margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-script)", fontSize: 56, margin: 0, lineHeight: 1 }}>“</p>
        <blockquote style={{ maxWidth: 340, margin: "-10px auto 18px", fontFamily: "var(--font-body)", fontSize: 19, lineHeight: 1.65, fontStyle: "italic" }}>
          {eventConfig.quote.text}
        </blockquote>
        <cite style={{ fontFamily: "var(--font-ui)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontStyle: "normal", opacity: 0.7 }}>— {eventConfig.quote.source}</cite>
        <p style={{ margin: "24px auto 0", maxWidth: "40ch", fontFamily: "var(--font-body)", fontSize: 17, opacity: 0.82 }}>
          {t(lang, "Dengan penuh sukacita, kami menyambut Anda di halaman kisah cinta kami.", "With joyful hearts, we welcome you to our love story.")}
        </p>
      </div>
    </section>
  );
}

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function PersonCard({ data, align = "center" }: { data: typeof eventConfig.groom; align?: "center" }) {
  const lang = getLang();
  const igUrl = `https://instagram.com/${data.instagram.replace(/^@/, "")}`;
  return (
    <article className="stagger" style={{ textAlign: align, width: "100%", maxWidth: 320, margin: "24px auto 32px" }}>
      {/* foto arch + layer grayscale/color ala Invitato */}
      <div style={{ position: "relative", width: "min(100%, 260px)", margin: "0 auto" }}>
        <figure className="img-hover" style={{ margin: 0, width: "100%", aspectRatio: "3 / 4", overflow: "hidden", borderRadius: "160px 160px 16px 16px", border: "1px solid rgba(44,63,78,.2)", background: "#eee" }}>
          <img src={data.image} alt={`Portrait ${data.fullName}`} loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%" }} />
        </figure>
        <span aria-hidden style={{ position: "absolute", inset: -10, border: "1px solid rgba(44,63,78,.18)", borderRadius: "170px 170px 20px 20px", pointerEvents: "none" }} />
      </div>

      <p className="kicker" style={{ marginTop: 20 }}>{t(lang, data.role, data.roleEn)}</p>
      <p style={{ fontFamily: "var(--font-script)", fontSize: 34, margin: "4px 0 0", color: "#2C3F4E", lineHeight: 1 }}>{data.nickname}</p>
      <h3 className="display" style={{ fontSize: 28, margin: "6px 0 0", lineHeight: 1.2, letterSpacing: "0.04em", textTransform: "uppercase" }}>{data.fullName}</h3>
      <p style={{ margin: "12px auto 0", maxWidth: "30ch", color: "#737373", fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: 16, lineHeight: 1.6 }}>{data.parents}</p>
      <p style={{ margin: "10px auto 0", maxWidth: "34ch", color: "#2C3F4E", fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.65 }}>{data.bio}</p>

      <a href={igUrl} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${data.fullName} @${data.instagram}`}
        style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8, background: "#2C3F4E", color: "#fff", borderRadius: 25, padding: "10px 22px", fontSize: 12, fontFamily: "var(--font-ui)", letterSpacing: "0.08em", textTransform: "none", textDecoration: "none", boxShadow: "0 6px 18px rgba(44,63,78,.25)" }}>
        <InstagramIcon />
        <span>@{data.instagram.replace(/^@/, "")}</span>
      </a>
    </article>
  );
}

export function CoupleProfile() {
  const lang = getLang();
  return (
    <section id="couple" style={{ background: "#D5DADE", padding: "46px 0 24px" }}>
      <div style={{ maxWidth: 430, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center" }}>
          <p className="kicker">{t(lang, "Assalamu’alaikum / Salam sejahtera", "With love")}</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#2C3F4E", margin: "8px 0 0", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {t(lang, "Sang Mempelai", "The Groom & Bride")}
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: 16, color: "#737373", margin: "10px auto 0", maxWidth: "38ch" }}>
            {t(lang, "Dengan bangga kami memperkenalkan kedua mempelai.", "Proudly introducing our groom & bride.")}
          </p>
        </div>
        <PersonCard data={eventConfig.groom} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px auto 8px", maxWidth: 280 }} aria-hidden>
          <div style={{ flex: 1, height: 1, background: "rgba(44,63,78,.2)" }} />
          <span className="script" style={{ fontSize: 44, color: "#2C3F4E", lineHeight: 1 }}>&</span>
          <div style={{ flex: 1, height: 1, background: "rgba(44,63,78,.2)" }} />
        </div>
        <PersonCard data={eventConfig.bride} />
      </div>
    </section>
  );
}

export function LoveStory() {
  const lang = getLang();
  return (
    <section style={{ background: "#fff", padding: "56px 24px" }}>
      <div style={{ maxWidth: 430, margin: "0 auto" }}>
        <SectionHeading eyebrow={t(lang, "Perjalanan Kami", "Our Journey")} title="Love Story" />
        <div style={{ display: "grid", gap: 28 }}>
          {eventConfig.loveStory.map((item) => (
            <article key={item.year} style={{ display: "grid", gridTemplateColumns: "70px 1fr", gap: 16, alignItems: "start", textAlign: "left" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "#2C3F4E", borderRight: "1px solid var(--color-line)", minHeight: 90 }}>{item.year}</div>
              <div>
                <h3 className="display" style={{ fontSize: 22, margin: 0, textTransform: "uppercase" }}>{item.title}</h3>
                <p style={{ margin: "8px 0 0", fontFamily: "var(--font-body)", color: "var(--color-muted)", fontSize: 16 }}>{item.description}</p>
                {item.image && <img src={item.image} alt="" loading="lazy" style={{ width: 120, height: 90, objectFit: "cover", borderRadius: 8, marginTop: 10 }} />}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WeddingGift() {
  const lang = getLang();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState("");
  const copy = async (text: string, key: string) => {
    try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
    setCopied(key);
    setTimeout(() => setCopied(""), 1800);
  };
  return (
    <section id="gift" style={{ background: "#D5DADE", padding: "32px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 24px", maxWidth: 430, margin: "0 auto" }}>
        <div style={{ flex: 1, height: 50, background: "#2C3F4E", borderRadius: "0 25px 25px 0" }} />
        <span style={{ fontSize: 28 }}>🎁</span>
        <div style={{ flex: 1, height: 50, background: "#2C3F4E", borderRadius: "25px 0 0 25px" }} />
      </div>
      <div style={{ width: "80%", maxWidth: 380, margin: "24px auto 0", background: "#fff", borderRadius: 24, padding: "32px 20px", textAlign: "center" }}>
        <SectionHeading eyebrow={t(lang, "Tanda Kasih", "Wedding Gift")} title={t(lang, "Tanda Kasih", "Wedding Gift")} />
        <p style={{ fontFamily: "var(--font-body)", fontSize: 17, color: "#2C3F4E", margin: "16px 0", padding: "0 12px" }}>
          {t(lang, "Bagi yang ingin memberikan tanda kasih, silakan ketuk tombol di bawah ini.", "For beloved ones who wish to give a gift, please tap the button below.")}
        </p>
        <button onClick={() => setOpen(true)}
          style={{ background: "#2C3F4E", color: "#fff", borderRadius: 25, padding: "12px 32px", border: "none", fontFamily: "var(--font-ui)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", margin: "16px 0 8px" }}>
          {t(lang, "Kirim Hadiah", "Send Gift")}
        </button>
      </div>
      {open && (
        <div role="dialog" aria-modal="true" onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 80, display: "grid", placeItems: "center", padding: 20 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, maxWidth: 400, width: "100%", padding: 24, textAlign: "left" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, margin: 0 }}>Bank Transfer</h3>
            <div style={{ marginTop: 16, border: "1px solid var(--color-line)", borderRadius: 12, padding: 16 }}>
              <p style={{ margin: 0, fontFamily: "var(--font-ui)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#737373" }}>{eventConfig.gift.bankName}</p>
              <p style={{ margin: "8px 0", fontFamily: "var(--font-display)", fontSize: 26, letterSpacing: "0.06em" }}>{eventConfig.gift.accountNumber}</p>
              <p style={{ margin: 0, fontSize: 12, fontFamily: "var(--font-ui)", textTransform: "uppercase", letterSpacing: "0.1em" }}>a.n. {eventConfig.gift.accountName}</p>
              <button onClick={() => copy(eventConfig.gift.accountNumber, "rek")}
                style={{ marginTop: 12, width: "100%", background: "#2C3F4E", color: "#fff", border: "none", borderRadius: 25, padding: "10px", fontSize: 12, cursor: "pointer" }}>
                {copied === "rek" ? t(lang, "Berhasil disalin ✓", "Copied ✓") : t(lang, "Salin Nomor Rekening", "Copy Account Number")}
              </button>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginTop: 16, width: "100%", background: "transparent", border: "1px solid #2C3F4E", color: "#2C3F4E", borderRadius: 25, padding: "10px", cursor: "pointer" }}>
              {t(lang, "Tutup", "Close")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export function GuestQr() {
  const lang = getLang();
  const params = new URLSearchParams(window.location.search);
  const guest = params.get("guest") || params.get("code") || "guest";
  if (!eventConfig.guestQrEnabled) return null;
  const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(`${window.location.origin}${window.location.pathname}?guest=${guest}`)}&size=220`;
  return (
    <section style={{ background: "#fff", textAlign: "center", padding: "56px 24px" }}>
      <div style={{ maxWidth: 430, margin: "0 auto" }}>
        <SectionHeading eyebrow={t(lang, "Untuk Kedatanganmu", "For Your Arrival")} title={t(lang, "Kartu Akses", "Access Card")} />
        <p style={{ color: "var(--color-muted)", fontFamily: "var(--font-body)", fontSize: 17 }}>
          {t(lang, "Tunjukkan kode personal ini kepada penerima tamu saat tiba di venue.", "Show this personal code to our reception team upon arrival.")}
        </p>
        <img src={qrUrl} alt={`QR check-in untuk ${guest}`} width={180} height={180} loading="lazy" style={{ margin: "24px auto 14px", background: "white", padding: 10, border: "1px solid var(--color-line)" }} />
        <p className="kicker">Guest: {guest}</p>
      </div>
    </section>
  );
}

export function Closing() {
  const lang = getLang();
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: "#D5DADE" }}>
      <div style={{ position: "relative", height: "90vh", minHeight: 560, maxHeight: 750, overflow: "hidden" }}>
        <img src="/assets/10.png" alt="Footer" loading="lazy" data-parallax="7" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "bottom" }} />
        <div style={{ position: "absolute", inset: 0, background: "#323030", opacity: 0.6 }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24 }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 24, color: "#FEFEFE", margin: 0 }}>{t(lang, "Terima kasih,", "Thank you,")}</p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "#FEFEFE", margin: "10px 0 0" }}>Ricky & Fellycia</p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 20, color: "#FEFEFE", margin: "8px 0 0" }}>#RickyFelly</p>
          <p style={{ maxWidth: "42ch", margin: "16px auto 0", color: "rgba(255,255,255,.85)", fontFamily: "var(--font-body)", fontSize: 17 }}>
            {t(lang, "Terima kasih atas doa, cinta, dan kehadiran Anda dalam hari bahagia kami.", "Thank you for your prayers, love, and presence on our happy day.")}
          </p>
        </div>
      </div>
      <div style={{ background: "#737373", padding: "12px 24px", textAlign: "center" }}>
        <p style={{ margin: 0, color: "#FEFEFE", fontFamily: "var(--font-ui)", fontSize: 12, letterSpacing: "0.06em" }}>Created with love by Invitato</p>
        <p style={{ margin: "4px 0 0", color: "#FEFEFE", fontFamily: "var(--font-ui)", fontSize: 14 }}>© {year} Ricky & Fellycia. All Right Reserved</p>
      </div>
    </footer>
  );
}
