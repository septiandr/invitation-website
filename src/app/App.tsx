import { useState, useEffect } from "react";
import { Cover } from "../components/Cover/Cover";
import { Hero } from "../components/Hero/Hero";
import { Countdown } from "../components/Countdown/Countdown";
import { EventDetails } from "../components/EventDetails/EventDetails";
import { Gallery } from "../components/Gallery/Gallery";
import { Location } from "../components/Location/Location";
import { RsvpForm } from "../components/RsvpForm/RsvpForm";
import { Wishes } from "../components/Wishes/Wishes";
import { MusicControl } from "../components/MusicControl/MusicControl";
import { eventConfig } from "./eventConfig";

export default function App() {
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    if (isOpened) {
      document.body.style.overflow = "auto";
      // scroll to hero smoothly
      setTimeout(() => {
        document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [isOpened]);

  return (
    <div>
      {!isOpened && <Cover isOpened={isOpened} onOpen={() => setIsOpened(true)} />}

      <div
        aria-hidden={!isOpened}
        style={{
          display: isOpened ? "block" : "none",
          opacity: isOpened ? 1 : 0,
          transition: "opacity 600ms ease",
        }}
      >
        {/* sticky nav minimal */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            background: "rgb(255 255 255 / 92%)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid var(--color-line)",
          }}
        >
          <nav className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", gap: 12 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 15, letterSpacing: "0.12em", textTransform: "uppercase" }}>{eventConfig.coupleNames}</span>
            <div style={{ display: "flex", gap: 16, fontFamily: "var(--font-ui)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 400 }}>
              <a href="#rsvp" style={{ textDecoration: "none" }}>RSVP</a>
              <a href="#wishes" style={{ textDecoration: "none" }}>Wishes</a>
              <a href="#location" style={{ textDecoration: "none" }}>Maps</a>
            </div>
          </nav>
        </header>

        <Hero />
        <Countdown />
        <EventDetails />
        <Gallery />
        <Location />
        <RsvpForm />
        <Wishes />

        <footer style={{ background: "#2C3F4E", color: "white", padding: "44px 0", textAlign: "center" }}>
          <div className="container">
            <p style={{ fontFamily: "var(--font-display)", fontSize: 26, margin: 0, letterSpacing: "0.06em", textTransform: "uppercase" }}>{eventConfig.coupleNames}</p>
            <p className="script" style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.85)", fontSize: 22 }}>
              Thank you for being part of our love story
            </p>
            <p style={{ margin: "18px 0 0", fontFamily: "var(--font-ui)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
              © 2026 Ricky & Felly. Crafted with love.
            </p>
          </div>
        </footer>
      </div>

      <MusicControl isOpened={isOpened} />
    </div>
  );
}
