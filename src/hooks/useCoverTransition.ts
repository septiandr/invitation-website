import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const OPEN_DELAY_MS = 250;
const OPEN_SCROLL_DURATION = 3.4;

type Args = {
  isOpened: boolean;
  setupAnims: () => void;
  flushAnims: () => void;
  setScrolling: (v: boolean) => void;
};

/**
 * Transisi "Buka Undangan": kunci scroll saat cover tampil, lalu auto-scroll
 * halus ke konten dan hapus cover dari layout.
 *
 * Urutan penting anti-blink:
 * 1) `setupAnims()` dulu selagi viewport tertutup cover opaque (hide tak terlihat),
 * 2) auto-scroll (hero ikut entrance saat dilewati),
 * 3) hapus cover + kompensasi tinggi cover AKTUAL + refresh (kalkulasi ulang saja).
 */
export function useCoverTransition({ isOpened, setupAnims, flushAnims, setScrolling }: Args) {
  // Sebelum dibuka: kunci scroll agar cover menjadi “layar pertama” penuh.
  useEffect(() => {
    document.body.style.overflow = isOpened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpened]);

  useEffect(() => {
    if (!isOpened) return;
    setupAnims();

    const coverEl = document.querySelector<HTMLElement>(".cover-layer");
    const hero = document.getElementById("hero");
    if (!coverEl || !hero) {
      ScrollTrigger.refresh();
      return;
    }

    let finished = false;
    const html = document.documentElement;
    const prevScrollBehavior = html.style.scrollBehavior;

    const hideCover = () => {
      if (finished) return;
      finished = true;
      setScrolling(false);
      // Kompensasi pakai tinggi cover aktual — kebal layout shift font/gambar.
      const coverH = coverEl.offsetHeight || window.innerHeight;
      coverEl.style.display = "none";
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, Math.max(0, window.scrollY - coverH));
      html.style.scrollBehavior = prevScrollBehavior;
      // Posisi trigger dihitung dengan cover — refresh + flush antrean.
      flushAnims();
      ScrollTrigger.refresh();
    };

    // Target diukur sesaat sebelum scroll (bukan saat klik) agar tidak basi.
    const startScroll = window.setTimeout(() => {
      html.style.scrollBehavior = "auto";
      setScrolling(true);
      const target = hero.getBoundingClientRect().top + window.scrollY;
      gsap.to(window, {
        scrollTo: { y: target, autoKill: true },
        duration: OPEN_SCROLL_DURATION,
        ease: "power2.inOut",
        onComplete: hideCover,
        // Pengguna menyela scroll → selesaikan tanpa macet.
        onInterrupt: hideCover,
      });
    }, OPEN_DELAY_MS);
    return () => window.clearTimeout(startScroll);
  }, [isOpened, setupAnims, flushAnims, setScrolling]);
}
