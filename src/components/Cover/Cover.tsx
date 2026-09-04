import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { eventConfig } from "../../app/eventConfig";

type Props = {
  isOpened: boolean;
  onOpen: () => void;
};

export function Cover({ onOpen }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const guestName = new URLSearchParams(window.location.search).get("guest") || eventConfig.greetingName;

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
        .to(".cover-light-sweep", { xPercent: 140, opacity: 0, duration: 0.9, ease: "power2.inOut" }, 0.7)
        .to(".cover-orbit", { opacity: 1, duration: 1 }, 0.45)
        .to(".cover-scroll-cue", { opacity: 1, y: 0, duration: 0.6 }, 1.15);
      gsap.to(".cover-orbit-one", { rotation: 360, duration: 24, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
      gsap.to(".cover-orbit-two", { rotation: -360, duration: 36, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
      gsap.to(".cover-cta", { y: -6, duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.6 });
      gsap.to(".cover-grain", { xPercent: 1, yPercent: -1, duration: 0.35, repeat: -1, yoyo: true, ease: "steps(2)" });
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
        background: "#2C3F4E",
      }}
    >
      <img
        className="cover-bg"
        src="/assets/1.png"
        alt=""
        aria-hidden
        fetchPriority="high"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          willChange: "transform",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(44,63,78,0.18), rgba(50,48,48,0.52))",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.28) 100%)",
        }}
      />
      <div className="cover-light-sweep" aria-hidden style={{ position: "absolute", inset: "-30% -80%", pointerEvents: "none", opacity: 0, background: "linear-gradient(105deg, transparent 42%, rgba(255,255,255,0.14) 50%, transparent 58%)", transform: "translateX(-35%) rotate(8deg)" }} />
      <div className="cover-orbit cover-orbit-one" aria-hidden style={{ position: "absolute", width: "min(72vw, 560px)", aspectRatio: "1", top: "50%", left: "50%", border: "1px solid rgba(255,255,255,0.28)", borderRadius: "50%", pointerEvents: "none", opacity: 0, transform: "translate(-50%, -50%)" }} />
      <div className="cover-orbit cover-orbit-two" aria-hidden style={{ position: "absolute", width: "min(88vw, 720px)", aspectRatio: "1", top: "50%", left: "50%", border: "1px dashed rgba(255,255,255,0.12)", borderRadius: "50%", pointerEvents: "none", opacity: 0, transform: "translate(-50%, -50%)" }} />
      <div className="cover-grain" aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.08, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E")`, mixBlendMode: "soft-light" as never }} />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(100% - 32px, 1120px)",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          color: "white",
          padding: "32px 0",
        }}
      >
        <p className="cover-anim kicker" style={{ color: "rgba(255,255,255,0.92)", margin: 0, fontFamily: "var(--font-ui)", letterSpacing: "0.28em", fontSize: "10px" }}>
          The Wedding of
        </p>

        <div className="cover-anim" style={{ marginTop: 18, lineHeight: 0.9 }}>
          <div className="display" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.8rem, 10vw, 5.8rem)", letterSpacing: "0.14em", fontWeight: 400, textTransform: "uppercase", color: "white" }}>
            Ricky
          </div>
          <div className="script" style={{ fontFamily: "var(--font-script)", fontSize: "clamp(3.2rem, 14vw, 5.2rem)", margin: "-6px 0 -10px", color: "white", fontWeight: 400, transform: "rotate(-4deg)" }}>
            &
          </div>
          <div className="display" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.8rem, 10vw, 5.8rem)", letterSpacing: "0.14em", fontWeight: 400, textTransform: "uppercase", color: "white" }}>
            Felly
          </div>
        </div>

        <p className="cover-anim" style={{ margin: "22px 0 0", fontFamily: "var(--font-ui)", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)" }}>
          20 • 12 • 2026 — Jakarta
        </p>

        <div className="cover-anim cover-line" style={{ marginTop: 24, height: 1, width: 56, background: "rgba(255,255,255,0.55)", transformOrigin: "center", transform: "scaleX(0)" }} />

        <p className="cover-anim" style={{ margin: "18px 0 0", fontFamily: "var(--font-body)", fontSize: 15, fontStyle: "italic", color: "rgba(255,255,255,0.92)", letterSpacing: "0.02em" }}>
          Kepada Yth. {guestName}
        </p>
        <p className="cover-anim" style={{ margin: "4px 0 0", fontFamily: "var(--font-ui)", fontSize: 10, letterSpacing: "0.06em", color: "rgba(255,255,255,0.65)" }}>
          * Mohon maaf apabila ada kesalahan penulisan nama/gelar
        </p>

        <button onClick={onOpen} className="cover-anim cover-cta btn btn-ghost" style={{ marginTop: 28, minWidth: 200, fontFamily: "var(--font-ui)", fontSize: 11, letterSpacing: "0.18em", padding: "13px 28px" }} aria-label="Buka undangan">
          Buka Undangan
        </button>
        <div className="cover-scroll-cue" aria-hidden style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginTop: 30, opacity: 0, transform: "translateY(8px)" }}>
          <span style={{ width: 1, height: 26, background: "rgba(255,255,255,0.75)", display: "block" }} />
          <small style={{ fontFamily: "var(--font-ui)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.68)" }}>Scroll to explore</small>
        </div>
      </div>
    </section>
  );
}
