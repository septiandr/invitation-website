import { useEffect, useRef, useState } from "react";
import { eventConfig } from "../../app/eventConfig";

export function MusicControl({ isOpened }: { isOpened: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  // auto-play after cover opened (counts as user gesture)
  useEffect(() => {
    if (!isOpened) return;
    const a = audioRef.current;
    if (!a) return;

    const tryPlay = async () => {
      try {
        a.volume = 0.6;
        await a.play();
        setIsPlaying(true);
        setHasInteracted(true);
      } catch {
        setIsPlaying(false);
      }
    };
    const t = setTimeout(tryPlay, 350);
    return () => clearTimeout(t);
  }, [isOpened]);

  // sync state with audio events
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => {
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
  }, []);

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
        await a.play();
      } catch {
        setIsAvailable(false);
      }
    }
  };

  if (!isOpened) return null;

  const src = eventConfig.backgroundAudio;

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="auto"
        crossOrigin="anonymous"
        onError={() => setIsAvailable(false)}
      />

      {/* Floating control — editorial pill */}
      <div
        style={{
          position: "fixed",
          right: 16,
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
  );
}
