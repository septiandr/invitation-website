import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { eventConfig } from "../../app/eventConfig";
import { getGuestName, getLang, t } from "../../lib/i18n";

type Props = {
  isOpened: boolean;
  onOpen: () => void;
};

export function Cover({ onOpen }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const lang = getLang();
  const guestName = getGuestName(eventConfig.greetingName || "Keluarga & Teman-teman");

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set(".cover-anim", { opacity: 1, y: 0, filter: "blur(0px)" });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set(".cover-anim", { opacity: 0, y: 28, filter: "blur(6px)" });
      gsap.set(".cover-bg", { scale: 1.08 });
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".cover-bg", { scale: 1, duration: 1.8, ease: "power2.out" }, 0)
        .to(".cover-anim", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85, stagger: 0.09 }, 0.18)
        .to(".cover-line", { scaleX: 1, duration: 0.6, ease: "power2.out" }, 0.62)
        .to(".cover-scroll-cue", { opacity: 1, y: 0, duration: 0.6 }, 1.15);
      gsap.to(".cover-cta", { y: -6, duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.6 });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-label="Cover undangan"
      style={{
        position: "relative",
        height: "100svh",
        minHeight: "100svh",
        display: "flex",
        overflow: "hidden",
        background: "#D5DADE",
      }}
    >
      <img
        className="cover-bg"
        src="/assets/background.jpg"
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "50% 30%",
          willChange: "transform",
        }}
      />
      {/* dark overlay rgb(50 48 48 / 20%) like original */}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "rgba(50,48,48,0.28)" }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(44,63,78,0.10), rgba(50,48,48,0.45))" }} />

      {/* decorative curves */}
      <svg className="curve-deco" viewBox="0 0 400 120" aria-hidden style={{ top: "-4%", opacity: 0.57 }}>
        <path d="M0,60 C100,120 300,0 400,60" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M0,80 C120,140 280,20 400,80" fill="none" stroke="currentColor" strokeWidth="1" opacity=".6" />
      </svg>
      <svg className="curve-deco" viewBox="0 0 400 120" aria-hidden style={{ bottom: "-6%", opacity: 0.53 }}>
        <path d="M0,60 C100,0 300,120 400,60" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(100% - 48px, 430px)",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          color: "white",
          padding: "56px 0 40px",
        }}
      >
        <p className="cover-anim kicker" style={{ color: "rgba(255,255,255,0.92)", margin: 0, letterSpacing: "0.28em", fontSize: "10px" }}>
          {t(lang, "The Wedding of", "The Wedding of")}
        </p>

        {/* signature lockup: 30px Marcellus + Boheme Floral "and" */}
        <div className="cover-anim" style={{ marginTop: "17dvh", lineHeight: 1.1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 30, letterSpacing: "0.06em", color: "#FEFEFE" }}>
            Ricky
          </div>
          <div style={{ fontFamily: "var(--font-script)", fontSize: 66, fontWeight: 300, margin: "-8px 0", color: "#FEFEFE" }}>
            and
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 30, letterSpacing: "0.06em", color: "#FEFEFE" }}>
            Fellycia
          </div>
        </div>

        <p className="cover-anim" style={{ margin: "14px 0 0", fontFamily: "var(--font-body)", fontSize: 19, color: "#FEFEFE" }}>
          #RickyFelly
        </p>

        <div className="cover-anim" style={{ marginTop: 26, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 12, padding: "12px 20px", backdropFilter: "blur(6px)" }}>
          <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: 17, color: "#FEFEFE" }}>
            {t(lang, "Kepada Bapak/Ibu/Saudara/i,", "Dear Mr/Mrs/Ms,")}
          </p>
          <p style={{ margin: "4px 0 0", fontFamily: "var(--font-display)", fontSize: 22, color: "#fff" }}>{guestName}</p>
        </div>

        <button onClick={onOpen} className="cover-anim cover-cta btn btn-ghost animation-up-and-down" style={{ marginTop: 24, minWidth: 220, minHeight: 38, fontSize: 12, letterSpacing: "0.14em", borderRadius: 25 }} aria-label="Buka undangan">
          {t(lang, "Buka Undangan", "Let's Begin")} ↓
        </button>
        <div className="cover-scroll-cue cover-anim" aria-hidden style={{ marginTop: 18, opacity: 0 }}>
          <small style={{ fontFamily: "var(--font-ui)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>
            20 • 12 • 2026 — Jakarta
          </small>
        </div>
      </div>
    </section>
  );
}
