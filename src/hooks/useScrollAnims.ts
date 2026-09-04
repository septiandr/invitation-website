import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { collectSection, inViewport, staggerFor } from "../lib/anim";

gsap.registerPlugin(ScrollTrigger);

const ROOTS_SELECTOR = ".page-content section, .page-content footer, .desktop-banner";
const EASE = "power3.out";

type AnimsApi = {
  /** Pasang semua trigger (sekali saja). Panggil selagi viewport tertutup cover. */
  setupAnims: () => void;
  /** Buat trigger untuk nodes antrean + refresh (panggil setelah transisi). */
  flushAnims: () => void;
  /** Tandai auto-scroll pembuka sedang berjalan (tunda trigger/refresh baru). */
  setScrolling: (v: boolean) => void;
};

/**
 * Sistem animasi scroll: teks (blur + rise), media (zoom-in), kartu (tilt 3D
 * per item). Setup dijalankan imperatif via `setupAnims` — bukan saat mount —
 * supaya auto-scroll "Buka Undangan" tetap mulus dan posisi trigger final.
 */
export function useScrollAnims(): AnimsApi {
  const setupRef = useRef<(() => void) | null>(null);
  const flushRef = useRef<(() => void) | null>(null);
  const scrollingRef = useRef(false);
  const openedRef = useRef(false);
  const pendingRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    let ctx: gsap.Context | null = null;
    let mo: MutationObserver | null = null;
    const onLoad = () => {
      if (openedRef.current) ScrollTrigger.refresh();
    };
    window.addEventListener("load", onLoad);

    const animateNew = (els: HTMLElement[]) => {
      // Diabaikan bila setup utama belum jalan — collect() saat setup
      // mencakup nodes ini sekalian (mencegah animasi ganda).
      if (!els.length || !ctx) return;
      const visible = els.filter((e) => inViewport(e, 0.9));
      const below = els.filter((e) => !inViewport(e, 0.9));
      if (visible.length) {
        gsap.fromTo(
          visible,
          { y: 28, opacity: 0, filter: "blur(5px)" },
          {
            y: 0, opacity: 1, filter: "blur(0px)",
            duration: 0.7, ease: EASE,
            stagger: Math.min(0.08, 0.5 / visible.length),
            overwrite: true, clearProps: "transform,filter",
          }
        );
      }
      if (scrollingRef.current) {
        // Antrekan; trigger dibuat + refresh sekali saat transisi selesai.
        below.forEach((el) => {
          if (!pendingRef.current.includes(el)) pendingRef.current.push(el);
        });
        return;
      }
      below.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 28, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, ease: EASE,
            overwrite: true, clearProps: "transform",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
          }
        );
      });
      if (openedRef.current) ScrollTrigger.refresh();
    };

    const flushPending = () => {
      const queued = pendingRef.current.splice(0);
      queued.forEach((el) => {
        if (!el.isConnected) return;
        gsap.fromTo(
          el,
          { y: 28, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, ease: EASE,
            overwrite: true, clearProps: "transform",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
          }
        );
      });
    };

    const setup = () => {
      if (ctx) return; // sekali saja
      openedRef.current = true;
      ctx = gsap.context(() => {
        const roots = gsap.utils.toArray<HTMLElement>(ROOTS_SELECTOR);
        roots.forEach((root) => {
          const { textEls, mediaEls, groups, mediaInGroup } = collectSection(root);
          if (textEls.length) {
            gsap.fromTo(
              textEls,
              { y: 36, opacity: 0, filter: "blur(6px)" },
              {
                y: 0, opacity: 1, filter: "blur(0px)",
                duration: 0.9, ease: EASE,
                stagger: staggerFor(textEls.length, 0.08, 0.7),
                scrollTrigger: { trigger: root, start: "top 80%", toggleActions: "play none none reverse" },
              }
            );
          }
          if (mediaEls.length) {
            gsap.fromTo(
              mediaEls,
              { y: 30, scale: 1.08, opacity: 0 },
              {
                y: 0, opacity: 1,
                duration: 1.1, ease: EASE,
                stagger: staggerFor(mediaEls.length, 0.12, 0.6),
                scrollTrigger: { trigger: root, start: "top 74%", toggleActions: "play none none reverse" },
              }
            );
          }
          // Kartu dianimasikan PER ITEM dengan trigger kartunya sendiri.
          groups.forEach((g) => {
            gsap.fromTo(
              g.els,
              { y: 30, rotateX: 5, transformPerspective: 600, opacity: 0 },
              {
                y: 0, rotateX: 0, opacity: 1,
                duration: 0.85, ease: EASE,
                stagger: staggerFor(g.els.length, 0.1, 0.6),
                scrollTrigger: { trigger: g.trigger, start: "top 82%", toggleActions: "play none none reverse" },
              }
            );
            const gm = mediaInGroup.get(g.trigger);
            if (gm?.length) {
              gsap.fromTo(
                gm,
                { y: 30, scale: 1.08, opacity: 0 },
                {
                  y: 0, scale: 1, opacity: 1,
                  duration: 1.1, ease: EASE,
                  stagger: staggerFor(gm.length, 0.12, 0.6),
                  scrollTrigger: { trigger: g.trigger, start: "top 80%", toggleActions: "play none none reverse" },
                }
              );
            }
          });
        });

        // Konten dinamis (daftar wishes hasil fetch/submit) belum ada saat
        // setup — pantau dan animasikan saat nodes baru masuk.
        const page = document.querySelector(".page-content");
        const seen = new WeakSet<Element>();
        mo = new MutationObserver((mutations) => {
          const fresh: HTMLElement[] = [];
          mutations.forEach((m) => {
            m.addedNodes.forEach((n) => {
              if (!(n instanceof HTMLElement)) return;
              const candidates: HTMLElement[] =
                n.tagName === "ARTICLE" || n.tagName === "FORM" || n.tagName === "IMG" || n.tagName === "IFRAME"
                  ? [n]
                  : Array.from(n.querySelectorAll<HTMLElement>("article, img, iframe"));
              candidates.forEach((c) => {
                if (seen.has(c)) return;
                // Gambar gallery dianimasikan oleh Gallery itu sendiri.
                if (c.tagName === "IMG" && c.closest("#gallery")) return;
                seen.add(c);
                fresh.push(c);
              });
            });
          });
          if (fresh.length) animateNew(fresh);
        });
        if (page) mo.observe(page, { childList: true, subtree: true });
      });
      ScrollTrigger.refresh();
    };

    setupRef.current = setup;
    flushRef.current = flushPending;
    return () => {
      window.removeEventListener("load", onLoad);
      mo?.disconnect();
      ctx?.revert();
      ctx = null;
      setupRef.current = null;
      flushRef.current = null;
    };
  }, []);

  const setupAnims = useCallback(() => setupRef.current?.(), []);
  const flushAnims = useCallback(() => flushRef.current?.(), []);
  const setScrolling = useCallback((v: boolean) => {
    scrollingRef.current = v;
  }, []);

  return { setupAnims, flushAnims, setScrolling };
}
