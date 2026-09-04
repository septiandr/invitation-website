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
        background: "#111",
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
          objectPosition: "50% 35%",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgb(18 18 18 / 20%), rgb(18 18 18 / 55%))",
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
            color: "rgb(255 255 255 / 85%)",
            margin: 0,
            opacity: 0,
            animation: "fadeUp 700ms cubic-bezier(0.22,1,0.36,1) 100ms forwards",
          }}
        >
          The Wedding of
        </p>

        <h1
          className="display"
          style={{
            fontSize: "var(--text-display)",
            margin: "14px 0 10px",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            opacity: 0,
            animation: "fadeUp 700ms cubic-bezier(0.22,1,0.36,1) 220ms forwards",
            textWrap: "balance",
          }}
        >
          {eventConfig.coverTitle}
        </h1>

        <p
          style={{
            margin: "16px 0 0",
            fontSize: "12px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            opacity: 0,
            animation: "fadeUp 700ms cubic-bezier(0.22,1,0.36,1) 340ms forwards",
          }}
        >
          20 • 12 • 2026 — Jakarta
        </p>

        <div
          style={{
            marginTop: 28,
            height: 1,
            width: 56,
            background: "rgb(255 255 255 / 60%)",
            opacity: 0,
            animation: "fadeUp 700ms cubic-bezier(0.22,1,0.36,1) 440ms forwards",
          }}
        />

        <p
          style={{
            margin: "18px 0 0",
            fontSize: 13,
            letterSpacing: "0.06em",
            opacity: 0.9,
          }}
        >
          Kepada Yth. {eventConfig.greetingName}
        </p>

        <button
          onClick={onOpen}
          className="btn btn-ghost"
          style={{
            marginTop: 28,
            minWidth: 220,
            opacity: 0,
            animation: "fadeUp 700ms cubic-bezier(0.22,1,0.36,1) 560ms forwards",
          }}
          aria-label="Buka undangan"
        >
          Buka Undangan
          <span aria-hidden>→</span>
        </button>

        <p style={{ margin: "14px 0 0", fontSize: 11, opacity: 0.7, letterSpacing: "0.08em" }}>
          * Mohon maaf apabila ada kesalahan penulisan nama/gelar
        </p>
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
