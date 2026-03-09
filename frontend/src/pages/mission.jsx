import "../styles/mission.css";

const objectives = [
  {
    icon: "🛡️",
    title: "Reduce Unsafe Driving",
    desc: "Provide on-demand driver assistance for personal vehicles, eliminating the risk of driving unfit.",
  },
  {
    icon: "🚗",
    title: "Keep Your Vehicle",
    desc: "Unlike ride-hailing apps, SDAC lets you retain your personal car — no leaving it behind.",
  },
  {
    icon: "✅",
    title: "Verified Drivers Only",
    desc: "Every driver is background-checked and accountable, ensuring trips are safe and trustworthy.",
  },
  {
    icon: "🗺️",
    title: "Familiar Booking Experience",
    desc: "A map-centric, booking-first interface inspired by platforms like Uber — easy from the first tap.",
  },
  {
    icon: "📈",
    title: "Built to Scale",
    desc: "Modular architecture allows future features like real-time tracking and scheduled bookings.",
  },
  {
    icon: "🤝",
    title: "Fair for Drivers Too",
    desc: "Pricing accounts for driver return travel, ensuring sustainable and balanced earnings.",
  },
];

const techStack = [
  { name: "React.js", role: "Frontend UI", color: "#61dafb" },
  { name: "FastAPI",  role: "Backend API", color: "#009688" },
  { name: "Supabase", role: "Auth & Database", color: "#3ecf8e" },
  { name: "PostgreSQL", role: "Data Storage", color: "#336791" },
];

export default function OurMission() {
  return (
    <div className="mission-page">
      <div className="mission-body">

        {/* ── Hero ── */}
        <div className="mission-hero">
          <div className="mission-tag">
            <span className="mission-tag-dot" />
            Our Mission
          </div>
          <h1 className="mission-title">
            Driving safety<br />
            <span>should never be optional.</span>
          </h1>
          <p className="mission-subtitle">
            Road accidents caused by impaired, fatigued, or unfit drivers claim thousands of lives every year.
            SDAC was built with one purpose — to make it easier to choose safety over risk, every single time.
          </p>
        </div>

        {/* ── Problem ── */}
        <div className="mission-problem">
          <div className="mission-section-label">The Problem We're Solving</div>
          <div className="mission-problem-text">
            <p>
              Existing ride-hailing services solve transportation — but they don't help when you already have a car.
              People drive drunk, exhausted, or sick because they don't want to leave their vehicle behind.
              There was no middle ground between "drive yourself" and "abandon your car."
            </p>
            <p>
              SDAC fills that gap. We send a professional driver to you, they drive your car, and you arrive home safely —
              without leaving anything behind.
            </p>
          </div>
        </div>

        {/* ── Objectives ── */}
        <div className="mission-objectives-section">
          <div className="mission-section-label">Our Objectives</div>
          <div className="mission-objectives-grid">
            {objectives.map((o) => (
              <div className="mission-obj-card" key={o.title}>
                <span className="mission-obj-icon">{o.icon}</span>
                <div className="mission-obj-title">{o.title}</div>
                <p className="mission-obj-desc">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tech Stack ── */}
        <div className="mission-tech-section">
          <div className="mission-section-label">Built With</div>
          <div className="mission-tech-grid">
            {techStack.map((t) => (
              <div className="mission-tech-card" key={t.name}>
                <div className="mission-tech-dot" style={{ background: t.color }} />
                <div className="mission-tech-name">{t.name}</div>
                <div className="mission-tech-role">{t.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Vision ── */}
        <div className="mission-vision">
          <div className="mission-vision-quote">
            "A world where no one has to choose between getting home and staying safe."
          </div>
          <p className="mission-vision-sub">
            SDAC is more than an app — it's a commitment to responsible travel and community safety.
          </p>
        </div>

      </div>
    </div>
  );
}