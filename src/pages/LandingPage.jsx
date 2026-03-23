import { useNavigate } from 'react-router-dom'

const FEATURES = [
  { icon: '🛡️', title: 'Verified Drivers Only', desc: 'All drivers undergo background checks, license verification, and safety training before joining the platform.' },
  { icon: '🚗', title: 'Your Car, Our Driver', desc: 'Keep your vehicle with you. Our professional drivers operate your personal car to your destination safely.' },
  { icon: '📍', title: 'Real-Time Tracking', desc: 'Track your trip live on the map. Share your journey with trusted contacts for added peace of mind.' },
  { icon: '🌙', title: 'Available 24/7', desc: "Whether it's 2am after a long night or an early morning emergency, SDAC is always on call." },
  { icon: '⚡', title: 'Instant Booking', desc: 'Book a driver in under 60 seconds. Familiar ride-hailing interface you already know how to use.' },
  { icon: '📊', title: 'Trip Analytics', desc: 'Insights on your travel patterns, safety scores, and cost summaries through our analytics dashboard.' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-content fade-in">
          <div className="hero-pill">🛡️ Road Safety Reimagined</div>
          <h1 className="hero-title">
            Too tired to drive?<br />
            <span className="highlight">We've got the wheel.</span>
          </h1>
          <p className="hero-sub">
            SDAC sends a verified professional driver to operate <em>your personal vehicle</em> safely —
            whether you're fatigued, unwell, or simply need peace of mind.
          </p>
          <div className="hero-ctas">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/signup')}>Book a Driver →</button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>Sign In</button>
          </div>
        </div>
      </section>

      {/* Features */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem 4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="font-syne" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Why Choose SDAC?</h2>
          <p style={{ color: 'var(--text2)' }}>Everything you need when you can't be behind the wheel</p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card fade-in" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <div className="font-syne" style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</div>
              <div style={{ color: 'var(--text2)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', margin: '3rem 0', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem', textAlign: 'center' }}>
          {[['12,400+', 'Trips Completed'], ['98%', 'Safety Rating'], ['4.9★', 'Driver Average'], ['24/7', 'Support']].map(([v, l]) => (
            <div key={l}>
              <div className="font-syne" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent2)' }}>{v}</div>
              <div style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <h2 className="font-syne" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to drive safer?</h2>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/signup')}>Get Started — It's Free</button>
        </div>
      </div>
    </div>
  )
}
