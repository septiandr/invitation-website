import { useCallback, useState } from "react";
import { Cover } from "../components/Cover/Cover";
import { Hero } from "../components/Hero/Hero";
import { DesktopBanner } from "../components/DesktopBanner/DesktopBanner";
import { Countdown } from "../components/Countdown/Countdown";
import { EventDetails } from "../components/EventDetails/EventDetails";
import { Gallery } from "../components/Gallery/Gallery";
import { PreWedding } from "../components/PreWedding/PreWedding";
import { Location } from "../components/Location/Location";
import { RsvpForm } from "../components/RsvpForm/RsvpForm";
import { Wishes } from "../components/Wishes/Wishes";
import { MusicControl } from "../components/MusicControl/MusicControl";
import { FloatingChrome } from "../components/FloatingChrome/FloatingChrome";
import {
  OpeningQuote,
  CoupleProfile,
  WeddingGift,
  GuestQr,
  Closing,
  MarqueeStrip,
} from "../components/InvitationSections";
import { useScrollAnims } from "../hooks/useScrollAnims";
import { useCoverTransition } from "../hooks/useCoverTransition";
import { unlockBackgroundMusic } from "../lib/audio";

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const { setupAnims, flushAnims, setScrolling } = useScrollAnims();

  const handleOpen = useCallback(() => {
    unlockBackgroundMusic();
    setIsOpened(true);
  }, []);

  useCoverTransition({ isOpened, setupAnims, flushAnims, setScrolling });

  return (
    <div className="invite-shell">
      {/* cover = gerbang penuh layar di alur dokumen; setelah dibuka halaman
          benar-benar di-scroll turun ke konten, lalu cover disembunyikan */}
      <div className="cover-layer">
        <Cover onOpen={handleOpen} />
      </div>

      {/* banner 3/4 (desktop, kiri, sticky) + undangan digital 1/4 (kanan) */}
      <DesktopBanner />

      {/* order mirrors invitato: welcome/hero, quote, couple, countdown, details, gallery, location, rsvp, wishes, gift, qr, footer */}
      <div className="page-content">
        <Hero />
        <MarqueeStrip />
        <OpeningQuote />
        <CoupleProfile />
        <Countdown />
        <EventDetails />
        <Gallery />
        <PreWedding />
        <Location />
        <RsvpForm />
        <Wishes />
        <WeddingGift />
        <GuestQr />
        <MarqueeStrip />
        <Closing />
      </div>

      <FloatingChrome music={<MusicControl isOpened={isOpened} inBar />} />
    </div>
  );
}
