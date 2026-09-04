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
          <nav className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", gap: 12 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18 }}>{eventConfig.coupleNames}</span>
            <div style={{ display: "flex", gap: 16, fontSize: 13, fontWeight: 500 }}>
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

        <footer style={{ background: "#111", color: "white", padding: "40px 0", textAlign: "center" }}>
          <div className="container">
            <p style={{ fontFamily: "var(--font-display)", fontSize: 28, margin: 0 }}>{eventConfig.coupleNames}</p>
            <p style={{ margin: "8px 0 0", color: "rgb(255 255 255 / 70%)", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Thank you for being part of our love story
            </p>
            <p style={{ margin: "18px 0 0", fontSize: 12, color: "rgb(255 255 255 / 50%)" }}>
              © 2026 Ricky & Felly. Crafted with love.
            </p>
          </div>
        </footer>
      </div>

      <MusicControl isOpened={isOpened} />
    </div>
  );
}
