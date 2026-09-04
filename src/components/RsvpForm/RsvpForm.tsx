import { useState } from "react";
import { rsvpClientSchema } from "../../lib/validation";
import { apiClient, getApiErrorFields, getApiErrorMessage } from "../../lib/apiClient";
import { useReveal } from "../../hooks/useReveal";

type Status = "idle" | "loading" | "success" | "error";

export function RsvpForm() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [guestName, setGuestName] = useState("");
  const [attendance, setAttendance] = useState<"HADIR" | "TIDAK_HADIR">("HADIR");
  const [guestCount, setGuestCount] = useState(2);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const parsed = rsvpClientSchema.safeParse({ guestName, attendance, guestCount });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((er) => {
        const key = er.path[0] as string;
        fieldErrors[key] = er.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (status === "loading") return;
    setStatus("loading");
    try {
      await apiClient.postRsvp({
        guestName: parsed.data.guestName,
        attendance: parsed.data.attendance,
        guestCount: parsed.data.guestCount,
      });
      setStatus("success");
      setMessage("Terima kasih! Konfirmasi kehadiran Anda telah kami terima.");
      setGuestName("");
      setGuestCount(2);
      setAttendance("HADIR");
    } catch (err: unknown) {
      setStatus("error");
      const fields = getApiErrorFields(err);
      if (fields) setErrors(fields);
      setMessage(getApiErrorMessage(err, "Gagal mengirim RSVP. Coba lagi."));
    }
  };

  return (
    <section ref={ref} id="rsvp" className={visible ? "reveal in" : "reveal"} style={{ background: "var(--color-paper)" }}>
      <div className="container section-pad" style={{ maxWidth: 720 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <p className="kicker">RSVP</p>
          <h2 className="display" style={{ fontSize: "var(--text-h2)", margin: "8px 0 0", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Konfirmasi Kehadiran
          </h2>
          <p style={{ margin: "10px auto 0", maxWidth: "56ch", color: "var(--color-muted)", fontFamily: "var(--font-body)", fontSize: 15 }}>
            Mohon konfirmasi kehadiran Anda sebelum 18 Desember 2026. Kami menantikan kebersamaan Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate style={{ display: "grid", gap: 16, background: "white", padding: 24, borderRadius: 16, border: "1px solid var(--color-line)" }}>
          {status === "success" && <div className="success-box" role="status">{message}</div>}
          {status === "error" && <div className="error-box" role="alert">{message}</div>}

          <div className="field">
            <label htmlFor="guestName">Nama tamu</label>
            <input id="guestName" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Nama lengkap" aria-describedby={errors.guestName ? "err-guestName" : undefined} />
            {errors.guestName && <span id="err-guestName" className="error-text">{errors.guestName}</span>}
            {errors.guest_name && <span className="error-text">{errors.guest_name}</span>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="field">
              <label htmlFor="attendance">Status kehadiran</label>
              <select id="attendance" value={attendance} onChange={(e) => setAttendance(e.target.value as never)}>
                <option value="HADIR">HADIR</option>
                <option value="TIDAK_HADIR">TIDAK_HADIR</option>
              </select>
              {errors.attendance && <span className="error-text">{errors.attendance}</span>}
            </div>

            <div className="field">
              <label htmlFor="guestCount">Jumlah orang</label>
              <select id="guestCount" value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "orang" : "orang"}
                  </option>
                ))}
              </select>
              {errors.guestCount && <span className="error-text">{errors.guestCount}</span>}
              {errors.guest_count && <span className="error-text">{errors.guest_count}</span>}
            </div>
          </div>

          <button type="submit" disabled={status === "loading"} className="btn btn-primary" style={{ marginTop: 8 }}>
            {status === "loading" ? "Mengirim..." : "Kirim Konfirmasi"}
          </button>
        </form>
      </div>
    </section>
  );
}
