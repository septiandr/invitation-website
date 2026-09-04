import { useEffect, useRef, useState } from "react";
import { eventConfig } from "../../app/eventConfig";

export function MusicControl({ isOpened }: { isOpened: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const fallbackTried = useRef(false);

  const FALLBACK_SRC =
    "https://invitato.net/template-rickyfelly/static/bg-sound-f26b8f4c5518b48f7ff52c53516f2b2b.mp3";

  // Preload early so bytes are already available when user clicks "Buka Undangan".
  // NOTE: <audio> must stay mounted BEFORE isOpened so the click handler in App
  // can call .play() synchronously inside the user gesture (required by iOS Safari).
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.6;
    try {
      a.load();
    } catch {
      /* ignore */
    }
  }, []);

  // sync state with audio events (attach once audio element exists)
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onPlay = () => {
      setIsPlaying(true);
      setHasInteracted(true);
    };
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      const err = a.error;
      console.warn("[music] audio error:", err?.code, err?.message, "src=", a.currentSrc || a.src);
      // Try remote fallback once before giving up
      if (!fallbackTried.current) {
        fallbackTried.current = true;
        a.src = FALLBACK_SRC;
        try {
          a.load();
          if (isOpened || hasInteracted) a.play().catch((e) => console.warn("[music] fallback play failed:", e));
        } catch {
          /* ignore */
        }
        return;
      }
      setIsAvailable(false);
      setIsPlaying(false);
    };
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("error", onError);
    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("error", onError);
    };
  }, [isOpened, hasInteracted]);

  // pause when tab hidden to be polite
  useEffect(() => {
    const onVis = () => {
      if (document.hidden && isPlaying) {
        // keep playing? policy: don't auto-pause, but user can toggle
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [isPlaying]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    setHasInteracted(true);
    if (isPlaying) {
      a.pause();
    } else {
      try {
        console.debug("[music] toggle play attempt, src=", a.currentSrc || a.src, "readyState=", a.readyState);
        await a.play();
      } catch (e) {
        // Don't permanently disable on autoplay-policy rejections (NotAllowedError/AbortError);
        // only mark unavailable when the media itself can't load.
        const name = (e as DOMException)?.name;
        console.warn("[music] toggle play() rejected:", name, e);
        if (name === "NotSupportedError" || a.error) {
          setIsAvailable(false);
        }
      }
    }
  };

  const src = eventConfig.backgroundAudio ?? "/assets/bg-music.mp3";

  // Keep <audio> mounted in the SAME tree position before & after open,
  // otherwise React remounts it on isOpened change and kills playback
  // that was just started synchronously in the click gesture.
  return (
    <>
      <audio
        id="bg-music"
        ref={audioRef}
        src={src}
        loop
        preload="auto"
        playsInline
      />
      {!isOpened ? null : (
      <>
      {/* Floating control — editorial pill */}
      <div
        style={{
          position: "fixed",
          left: 80,
          bottom: 16,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {!isAvailable ? (
          <span
            role="status"
            aria-live="polite"
            style={{
              background: "white",
              border: "1px solid var(--color-line)",
              padding: "8px 12px",
              borderRadius: 999,
              fontSize: 12,
              color: "var(--color-muted)",
              boxShadow: "0 4px 16px rgb(0 0 0 / 12%)",
            }}
          >
            Music unavailable
          </span>
        ) : (
          <button
            onClick={toggle}
            aria-label={isPlaying ? "Matikan musik" : "Nyalakan musik"}
            aria-pressed={isPlaying}
            title={isPlaying ? "Matikan musik (pause)" : "Nyalakan musik (play)"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              height: 44,
              padding: "0 14px 0 12px",
              borderRadius: 999,
              border: "1px solid var(--color-line)",
              background: isPlaying ? "var(--color-ink)" : "white",
              color: isPlaying ? "white" : "var(--color-ink)",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgb(0 0 0 / 14%)",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.04em",
              transition: "background 200ms, color 200ms, transform 150ms",
            }}
            onKeyDown={(e) => {
              if (e.key === " ") e.preventDefault();
            }}
          >
            <span
              aria-hidden
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background: isPlaying ? "white" : "var(--color-paper)",
                color: isPlaying ? "var(--color-ink)" : "var(--color-ink)",
                flexShrink: 0,
                position: "relative",
              }}
            >
              {/* icon */}
              {isPlaying ? (
                // pause icon
                <span style={{ display: "flex", gap: 3 }}>
                  <span style={{ width: 3, height: 12, background: "currentColor", borderRadius: 1 }} />
                  <span style={{ width: 3, height: 12, background: "currentColor", borderRadius: 1 }} />
                </span>
              ) : (
                // play icon
                <span
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "8px solid currentColor",
                    borderTop: "5px solid transparent",
                    borderBottom: "5px solid transparent",
                    marginLeft: 2,
                  }}
                />
              )}
              {/* pulse ring when playing */}
              {isPlaying && (
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: -4,
                    borderRadius: "50%",
                    border: "1px solid rgb(255 255 255 / 60%)",
                    animation: "pulse 1.8s ease-out infinite",
                  }}
                />
              )}
            </span>

            <span>{isPlaying ? "Music On" : "Music Off"}</span>

            {/* subtle divider + hint */}
            <span
              aria-hidden
              style={{
                width: 1,
                height: 18,
                background: isPlaying ? "rgb(255 255 255 / 20%)" : "var(--color-line)",
              }}
            />
            <span aria-hidden style={{ fontSize: 11, opacity: 0.7 }}>
              {isPlaying ? "Tap to pause" : "Tap to play"}
            </span>
          </button>
        )}
      </div>

      {/* screen-reader announcement */}
      <span aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", clipPath: "inset(50%)" }}>
        {hasInteracted ? (isPlaying ? "Musik diputar" : "Musik dijeda") : ""}
      </span>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          span[style*="animation: pulse"] { animation: none !important; }
        }
      `}</style>
      </>
      )}
    </>
  );
}
