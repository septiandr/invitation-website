import { eventConfig } from "../../app/eventConfig";

type Props = {
  isOpened: boolean;
  onOpen: () => void;
};

export function Cover({ isOpened, onOpen }: Props) {
  return (
    <section
      aria-label="Cover undangan"
      style={{
        position: isOpened ? "absolute" : "relative",
        inset: isOpened ? undefined : 0,
        height: "100svh",
        minHeight: "100svh",
        display: isOpened ? "none" : "flex",
        overflow: "hidden",
        background: "#2C3F4E",
      }}
    >
      <img
        src="/assets/background.jpg"
        alt=""
        aria-hidden
        fetchPriority="high"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "50% 30%",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(44,63,78,0.18), rgba(50,48,48,0.52))",
        }}
      />
      {/* subtle vignette */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.28) 100%)",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(100% - 32px, 1120px)",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          color: "white",
          padding: "32px 0",
        }}
      >
        <p
          className="kicker"
          style={{
            color: "rgba(255,255,255,0.92)",
            margin: 0,
            fontFamily: "var(--font-ui)",
            letterSpacing: "0.28em",
            fontSize: "10px",
            opacity: 0,
            animation: "fadeUp 700ms cubic-bezier(0.22,1,0.36,1) 100ms forwards",
          }}
        >
          The Wedding of
        </p>

        <div
          style={{
            marginTop: 18,
            lineHeight: 0.9,
            opacity: 0,
            animation: "fadeUp 700ms cubic-bezier(0.22,1,0.36,1) 220ms forwards",
          }}
        >
          <div
            className="display"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.8rem, 10vw, 5.8rem)",
              letterSpacing: "0.14em",
              fontWeight: 400,
              textTransform: "uppercase",
              color: "white",
            }}
          >
            Ricky
          </div>
          <div
            className="script"
            style={{
              fontFamily: "var(--font-script)",
              fontSize: "clamp(3.2rem, 14vw, 5.2rem)",
              margin: "-6px 0 -10px",
              color: "white",
              fontWeight: 400,
              transform: "rotate(-4deg)",
            }}
          >
            &
          </div>
          <div
            className="display"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.8rem, 10vw, 5.8rem)",
              letterSpacing: "0.14em",
              fontWeight: 400,
              textTransform: "uppercase",
              color: "white",
            }}
          >
            Felly
          </div>
        </div>

        <p
          style={{
            margin: "22px 0 0",
            fontFamily: "var(--font-ui)",
            fontSize: "11px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.9)",
            opacity: 0,
            animation: "fadeUp 700ms cubic-bezier(0.22,1,0.36,1) 340ms forwards",
          }}
        >
          20 • 12 • 2026 — Jakarta
        </p>

        <div
          style={{
            marginTop: 24,
            height: 1,
            width: 56,
            background: "rgba(255,255,255,0.55)",
            opacity: 0,
            animation: "fadeUp 700ms cubic-bezier(0.22,1,0.36,1) 440ms forwards",
          }}
        />

        <p
          style={{
            margin: "18px 0 0",
            fontFamily: "var(--font-body)",
            fontSize: 15,
            fontStyle: "italic",
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "0.02em",
          }}
        >
          Kepada Yth. {eventConfig.greetingName}
        </p>
        <p
          style={{
            margin: "4px 0 0",
            fontFamily: "var(--font-ui)",
            fontSize: 10,
            letterSpacing: "0.06em",
            color: "rgba(255,255,255,0.65)",
          }}
        >
          * Mohon maaf apabila ada kesalahan penulisan nama/gelar
        </p>

        <button
          onClick={onOpen}
          className="btn btn-ghost"
          style={{
            marginTop: 28,
            minWidth: 200,
            fontFamily: "var(--font-ui)",
            fontSize: 11,
            letterSpacing: "0.18em",
            padding: "13px 28px",
            opacity: 0,
            animation: "fadeUp 700ms cubic-bezier(0.22,1,0.36,1) 560ms forwards",
          }}
          aria-label="Buka undangan"
        >
          Buka Undangan
        </button>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
