import { useEffect, useRef, useState, useCallback } from "react";
import { wishClientSchema } from "../../lib/validation";
import { apiClient, getApiErrorFields, getApiErrorMessage } from "../../lib/apiClient";
import type { Wish } from "../../types";
import { useReveal } from "../../hooks/useReveal";

type LoadStatus = "idle" | "loading" | "success" | "error";

export function Wishes() {
  const { ref: revealRef, visible } = useReveal<HTMLDivElement>(0.1);
  const [items, setItems] = useState<Wish[]>([]);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>("idle");
  const [loadError, setLoadError] = useState("");

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<LoadStatus>("idle");
  const [submitMsg, setSubmitMsg] = useState("");

  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchWishes = useCallback(async () => {
    setLoadStatus("loading");
    try {
      const data = await apiClient.getWishes();
      setItems(data.items);
      setLoadStatus("success");
    } catch (err: unknown) {
      setLoadStatus("error");
      setLoadError(getApiErrorMessage(err, "Gagal memuat wishes."));
    }
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && loadStatus === "idle") fetchWishes();
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [fetchWishes, loadStatus]);

  // fallback fetch on mount if sentinel not triggered
  useEffect(() => {
    const t = setTimeout(() => {
      if (loadStatus === "idle") fetchWishes();
    }, 2000);
    return () => clearTimeout(t);
  }, [loadStatus, fetchWishes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitMsg("");
    const parsed = wishClientSchema.safeParse({ name, message });
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.errors.forEach((er) => (fe[er.path[0] as string] = er.message));
      setErrors(fe);
      return;
    }
    if (submitStatus === "loading") return;
    setSubmitStatus("loading");
    try {
      const created = await apiClient.postWish(parsed.data);
      setItems((prev) => [created, ...prev]);
      setSubmitStatus("success");
      setSubmitMsg("Terima kasih atas ucapannya!");
      setName("");
      setMessage("");
    } catch (err: unknown) {
      setSubmitStatus("error");
      const fields = getApiErrorFields(err);
      if (fields) setErrors(fields);
      setSubmitMsg(getApiErrorMessage(err, "Gagal mengirim wishes."));
    } finally {
      setSubmitStatus((s) => (s === "loading" ? "idle" : s));
      // keep success briefly then idle
      setTimeout(() => setSubmitStatus("idle"), 2000);
    }
  };

  return (
    <section ref={revealRef} id="wishes" className={visible ? "reveal in" : "reveal"} style={{ background: "var(--color-paper)" }}>
      <div className="container section-pad">
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <p className="kicker">Wishes</p>
          <h2 className="display" style={{ fontSize: "var(--text-h2)", margin: "8px 0 0" }}>
            Ucapan & Doa
          </h2>
          <p style={{ margin: "10px auto 0", maxWidth: "56ch", color: "var(--color-muted)", fontSize: 14 }}>
            Tinggalkan pesan hangat untuk kedua mempelai. Ucapan Anda akan tampil setelah terkirim.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, alignItems: "start" }}>
          <form onSubmit={handleSubmit} noValidate style={{ background: "white", border: "1px solid var(--color-line)", padding: 24, borderRadius: 4, display: "grid", gap: 14 }}>
            <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 22 }}>Kirim Ucapan</h3>
            {submitStatus === "success" && <div className="success-box" role="status">{submitMsg}</div>}
            {submitStatus === "error" && <div className="error-box" role="alert">{submitMsg}</div>}

            <div className="field">
              <label htmlFor="w-name">Nama</label>
              <input id="w-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Anda" aria-describedby={errors.name ? "err-w-name" : undefined} />
              {errors.name && <span id="err-w-name" className="error-text">{errors.name}</span>}
            </div>
            <div className="field">
              <label htmlFor="w-msg">Pesan</label>
              <textarea id="w-msg" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Selamat menempuh hidup baru!" maxLength={500} aria-describedby={errors.message ? "err-w-msg" : undefined} />
              <span style={{ fontSize: 11, color: "var(--color-muted)", textAlign: "right" }}>{message.length}/500</span>
              {errors.message && <span id="err-w-msg" className="error-text">{errors.message}</span>}
            </div>
            <button type="submit" disabled={submitStatus === "loading"} className="btn btn-primary">
              {submitStatus === "loading" ? "Mengirim..." : "Kirim Ucapan"}
            </button>
          </form>

          <div style={{ display: "grid", gap: 12 }}>
            <div ref={sentinelRef} aria-hidden style={{ height: 1 }} />
            {loadStatus === "loading" && <div style={{ background: "white", border: "1px solid var(--color-line)", padding: 14, borderRadius: 4 }}>Memuat ucapan...</div>}
            {loadStatus === "error" && (
              <div className="error-box">
                {loadError} <button onClick={fetchWishes} className="btn btn-primary" style={{ marginLeft: 8, minHeight: 32, padding: "6px 12px" }}>Coba lagi</button>
              </div>
            )}
            {loadStatus === "success" && items.length === 0 && (
              <div style={{ background: "white", border: "1px solid var(--color-line)", padding: 24, borderRadius: 4, textAlign: "center", color: "var(--color-muted)" }}>
                Belum ada ucapan. Jadilah yang pertama mengirim doa!
              </div>
            )}
            {items.map((w) => (
              <article key={w.id} style={{ background: "white", border: "1px solid var(--color-line)", padding: 18, borderRadius: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                  <strong style={{ fontSize: 15 }}>{w.name}</strong>
                  <time style={{ fontSize: 11, color: "var(--color-muted)", whiteSpace: "nowrap" }}>
                    {new Date(w.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </time>
                </div>
                <p style={{ margin: "8px 0 0", color: "#2b2b2b", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{w.message}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


