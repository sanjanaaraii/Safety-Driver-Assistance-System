import "../styles/howitworks.css";

const steps = [
  {
    num: "01",
    icon: "📱",
    title: "Open the App",
    desc: "Launch SDAC from your browser. No app download needed — it works entirely on the web, any time you need it.",
  },
  {
    num: "02",
    icon: "📍",
    title: "Set Your Pickup & Destination",
    desc: "Enter where you are and where you need to go. Our map-centric interface makes it quick and familiar.",
  },
  {
    num: "03",
    icon: "🔍",
    title: "We Find a Verified Driver",
    desc: "SDAC matches you with a nearby certified driver. Every driver is background-checked and trained for safe driving.",
  },
  {
    num: "04",
    icon: "🚗",
    title: "Driver Comes to You",
    desc: "Your matched driver arrives at your location and gets behind the wheel of your own car — you stay in the passenger seat.",
  },
  {
    num: "05",
    icon: "🏠",
    title: "Arrive Home Safely",
    desc: "The driver takes you to your destination. Your trip is logged and your emergency contact is notified when you arrive.",
  },
  {
    num: "06",
    icon: "⭐",
    title: "Rate Your Experience",
    desc: "After every trip, rate your driver to help maintain quality and safety standards across the platform.",
  },
];

const useCases = [
  { icon: "🍺", label: "After a night out" },
  { icon: "😴", label: "Too fatigued to drive" },
  { icon: "🤒", label: "Feeling unwell" },
  { icon: "😰", label: "Stressed or anxious" },
  { icon: "💊", label: "On medication" },
  { icon: "🌙", label: "Late night travel" },
];

export default function HowItWorks() {
  return (
    <div className="hiw-page">
      <div className="hiw-body">

        {/* ── Hero ── */}
        <div className="hiw-hero">
          <div className="hiw-tag">
            <span className="hiw-tag-dot" />
            How It Works
          </div>
          <h1 className="hiw-title">
            Your car. <span>Our driver.</span><br />You, safe.
          </h1>
          <p className="hiw-subtitle">
            SDAC lets you keep your personal vehicle while putting a professional
            driver behind the wheel — so you never have to choose between safety
            and convenience.
          </p>
        </div>

        {/* ── Steps ── */}
        <div className="hiw-steps">
          {steps.map((s, i) => (
            <div className="hiw-step" key={s.num} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="hiw-step-left">
                <div className="hiw-step-num">{s.num}</div>
                {i < steps.length - 1 && <div className="hiw-step-line" />}
              </div>
              <div className="hiw-step-content">
                <span className="hiw-step-icon">{s.icon}</span>
                <div>
                  <div className="hiw-step-title">{s.title}</div>
                  <p className="hiw-step-desc">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Use Cases ── */}
        <div className="hiw-usecases">
          <div className="hiw-section-label">When to use SDAC</div>
          <div className="hiw-usecase-grid">
            {useCases.map((u) => (
              <div className="hiw-usecase-chip" key={u.label}>
                <span>{u.icon}</span>
                {u.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="hiw-cta">
          <p className="hiw-cta-text">Ready to ride safe?</p>
          <button className="hiw-cta-btn">Book a Driver</button>
        </div>

      </div>
    </div>
  );
}