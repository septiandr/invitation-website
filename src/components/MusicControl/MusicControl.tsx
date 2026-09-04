import { useEffect, useRef, useState } from "react";

export function MusicControl({ isOpened }: { isOpened: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    if (!isOpened) return;
    const a = audioRef.current;
    if (!a) return;
    // try play after gesture; Cover click already is gesture
    const tryPlay = async () => {
      try {
        await a.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    };
    // slight delay to ensure interaction counted
    const t = setTimeout(tryPlay, 300);
    return () => clearTimeout(t);
  }, [isOpened]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) {
      a.pause();
      setIsPlaying(false);
    } else {
      try {
        await a.play();
        setIsPlaying(true);
      } catch {
        setIsAvailable(false);
      }
    }
  };

  if (!isOpened) return null;

  return (
    <>
      {/* audio element - using a placeholder soft audio via data url? Use no src until provided; fallback silently */}
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/download/audio/2022/03/24/audio_1c8c8f3a63.mp3?filename=romantic-wedding-background-music-112199.mp3"
        loop
        preload="none"
        onError={() => setIsAvailable(false)}
      />
      <button
        onClick={toggle}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        title={isPlaying ? "Pause music" : "Play music"}
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          zIndex: 50,
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "1px solid var(--color-line)",
          background: "white",
          display: "grid",
          placeItems: "center",
          cursor: "pointer",
          boxShadow: "0 4px 16px rgb(0 0 0 / 12%)",
          opacity: isAvailable ? 1 : 0.6,
        }}
      >
        <span aria-hidden style={{ fontSize: 16 }}>
          {isPlaying ? "⏸" : "♪"}
        </span>
      </button>
    </>
  );
}
