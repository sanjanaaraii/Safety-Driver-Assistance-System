import { useState } from "react";
import "../styles/safety.css";

const protocols = [
  {
    step: "Step 01",
    icon: "🍺",
    title: "Recognize You're Unfit",
    desc: "If you've had too much to drink, put the keys down. Open SafeDrive before leaving the venue.",
  },
  {
    step: "Step 02",
    icon: "📍",
    title: "Share Your Location",
    desc: "Your live GPS is instantly shared with your emergency contact the moment you press SOS.",
  },
  {
    step: "Step 03",
    icon: "🚗",
    title: "Driver Takes the Wheel",
    desc: "A verified SafeDrive driver arrives and drives your own car — you stay safe in the passenger seat.",
  },
  {
    step: "Step 04",
    icon: "🏠",
    title: "Arrive Home Safely",
    desc: "Your contact tracks you the whole journey. Location sharing ends automatically once you're home.",
  },
];

export default function Safety() {
  const [triggered, setTriggered] = useState(false);

  const handleSOS = () => {
    if (triggered) return;
    setTriggered(true);
  };

  return (
    // No <nav> here — your existing Navbar component handles that
    <div className="safety-page">
      <div className="safety-body">

        {/* ── Emergency badge ── */}
        <div className="emergency-badge">
          <span className="blink" />
          Emergency Protocol
        </div>

        {/* ── SOS button ── */}
        <div className="sos-area">
          <div className="sos-ring-outer">
            <div className="sos-ring-inner">
              <button
                className={`sos-button ${triggered ? "triggered" : ""}`}
                onClick={handleSOS}
              >
                SOS
              </button>
            </div>
          </div>

          <p className="sos-description">
            After pressing the SOS button, we will contact the nearest
            hospital or police station and share your live location with
            your emergency contact.
          </p>

          {triggered && (
            <div className="success-alert">
              <span className="alert-icon">🚨</span>
              <div>
                <div className="alert-title">Emergency Alert Sent</div>
                <div className="alert-sub">
                  Live location shared · Nearest services notified
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="section-divider">How it works</div>

        {/* ── Protocol cards ── */}
        <div className="protocol-grid">
          {protocols.map((p) => (
            <div className="protocol-card" key={p.step}>
              <div className="card-step">{p.step}</div>
              <span className="card-icon">{p.icon}</span>
              <div className="card-title">{p.title}</div>
              <p className="card-desc">{p.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}