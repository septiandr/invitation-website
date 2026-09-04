/**
 * Memutar musik latar secara sinkron di dalam gesture pengguna.
 * WAJIB dipanggil langsung dari event handler klik (iOS Safari / Chrome
 * mobile menolak play() yang ditunda via setTimeout/useEffect).
 * Gagal play tidak melempar — dicoba ulang sekali + diunlock pada sentuhan berikutnya.
 */
export function unlockBackgroundMusic(audioId = "bg-music"): void {
  const audio = document.getElementById(audioId) as HTMLAudioElement | null;
  if (!audio) return;
  audio.volume = 0.6;
  audio.play().catch(() => {
    const retry = () => {
      audio
        .play()
        .then(() => {
          document.removeEventListener("touchend", retry);
          document.removeEventListener("click", retry);
        })
        .catch(() => {});
    };
    document.addEventListener("touchend", retry, { once: true });
    document.addEventListener("click", retry, { once: true });
    window.setTimeout(retry, 500);
  });
}
