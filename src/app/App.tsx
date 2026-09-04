import { useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cover } from "../components/Cover/Cover";
import { Hero } from "../components/Hero/Hero";
import { Countdown } from "../components/Countdown/Countdown";
import { EventDetails } from "../components/EventDetails/EventDetails";
import { Gallery } from "../components/Gallery/Gallery";
import { Location } from "../components/Location/Location";
import { RsvpForm } from "../components/RsvpForm/RsvpForm";
import { Wishes } from "../components/Wishes/Wishes";
import { MusicControl } from "../components/MusicControl/MusicControl";
import { OpeningQuote, CoupleProfile, LoveStory, WeddingGift, GuestQr, Closing } from "../components/InvitationSections";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpened(true);
    // smooth scroll ke hero, jadi scroll + buka sama-sama bisa
    setTimeout(() => {
      document.getElementById("hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }, []);

  // Scroll & look selalu aktif — tidak terkunci body. isOpened hanya untuk musik + efek cover keluar
  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

  // GSAP ScrollTrigger untuk semua section — jalan sejak mount, tidak nunggu isOpened
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(".page-content section, .page-content footer", { opacity: 1, y: 0, filter: "none" });
        gsap.set(".img-hover img", { scale: 1 });
        return;
      }
      // section entrance (kecuali cover)
      gsap.utils.toArray<HTMLElement>(".page-content section").forEach((section) => {
        const heading = section.querySelectorAll(".kicker, h2, h3");
        const media = section.querySelectorAll("img, iframe");
        const cards = section.querySelectorAll(".stagger > *, form, article");

        gsap.fromTo(section, { backgroundPosition: "50% 0%" }, {
          backgroundPosition: "50% 12%",
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 },
        });
        if (heading.length) {
          gsap.fromTo(heading, { opacity: 0, y: 35, filter: "blur(6px)" }, {
            opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.1,
            scrollTrigger: { trigger: section, start: "top 82%", once: true },
          });
        }
        if (media.length) {
          gsap.fromTo(media, { opacity: 0, scale: 1.08, y: 28 }, {
            opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out", stagger: 0.12,
            scrollTrigger: { trigger: section, start: "top 78%", once: true },
          });
        }
        if (cards.length) {
          gsap.fromTo(cards, { opacity: 0, y: 30, rotateX: 5 }, {
            opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: "power3.out", stagger: 0.1,
            scrollTrigger: { trigger: section, start: "top 74%", once: true },
          });
        }
      });

      gsap.utils.toArray<HTMLElement>(".img-hover").forEach((figure) => {
        const image = figure.querySelector("img");
        if (!image) return;
        const moveX = gsap.quickTo(image, "x", { duration: 0.6, ease: "power3.out" });
        const moveY = gsap.quickTo(image, "y", { duration: 0.6, ease: "power3.out" });
        const enter = () => gsap.to(image, { scale: 1.06, duration: 0.8, ease: "power3.out" });
        const leave = () => { gsap.to(image, { scale: 1, duration: 0.8, ease: "power3.out" }); moveX(0); moveY(0); };
        const move = (event: MouseEvent) => {
          const rect = figure.getBoundingClientRect();
          moveX((event.clientX - rect.left - rect.width / 2) * 0.035);
          moveY((event.clientY - rect.top - rect.height / 2) * 0.035);
        };
        figure.addEventListener("mouseenter", enter);
        figure.addEventListener("mouseleave", leave);
        figure.addEventListener("mousemove", move);
      });

      gsap.to(".page-content footer", {
        opacity: 0.55,
        scrollTrigger: { trigger: ".page-content footer", start: "top bottom", end: "bottom bottom", scrub: true },
      });
    });
    return () => ctx.revert();
  }, []);

  // Cover keluar dengan GSAP saat isOpened true (tanpa mengunci scroll)
  useEffect(() => {
    if (!isOpened) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set(".cover-layer", { display: "none" });
      return;
    }
    gsap.to(".cover-layer", {
      yPercent: -100,
      duration: 1.1,
      ease: "power4.inOut",
      overwrite: true,
      onComplete: () => gsap.set(".cover-layer", { display: "none" }),
    });
  }, [isOpened]);

  return (
    <div>
      {/* Cover = section pertama scrollable + overlay yang slide-out saat dibuka */}
      <div className="cover-layer" style={{ position: "relative", zIndex: 1 }} aria-hidden={isOpened && true}>
        <Cover isOpened={isOpened} onOpen={handleOpen} />
        {/* helper hint scroll tetap terlihat sebelum dibuka */}
      </div>

      <div className="page-content">
        <Hero />
        <OpeningQuote />
        <CoupleProfile />
        <EventDetails />
        <Countdown />
        <LoveStory />
        <Gallery />
        <Location />
        <RsvpForm />
        <Wishes />
        <WeddingGift />
        <GuestQr />
        <Closing />
      </div>

      <MusicControl isOpened={isOpened} />
    </div>
  );
}
