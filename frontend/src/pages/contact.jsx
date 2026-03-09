import { useState } from "react";
import "../styles/contact.css";

const faqs = [
  {
    q: "Do I need to create an account to book a driver?",
    a: "Yes, a quick sign-up is required so we can verify your identity and keep your trip history secure.",
  },
  {
    q: "How are drivers verified?",
    a: "Every SDAC driver goes through a background check, license verification, and safety training before they can accept bookings.",
  },
  {
    q: "What if I need to cancel my booking?",
    a: "You can cancel anytime before the driver arrives. Cancellations after arrival may incur a small fee.",
  },
  {
    q: "Is SDAC available 24/7?",
    a: "We aim to provide round-the-clock availability. Driver availability may vary by location and time.",
  },
];

export default function Contact() {
  const [openFaq, setOpenFaq]     = useState(null);
  const [formData, setFormData]   = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1800);
  };

  return (
    <div className="contact-page">
      <div className="contact-body">

        {/* ── Hero ── */}
        <div className="contact-hero">
          <div className="contact-tag">
            <span className="contact-tag-dot" />
            Contact Us
          </div>
          <h1 className="contact-title">
            We're here<br />
            <span>whenever you need us.</span>
          </h1>
          <p className="contact-subtitle">
            Have a question, feedback, or an issue? Reach out and we'll get back to you promptly.
          </p>
        </div>

        {/* ── Two Column: Form + Info ── */}
        <div className="contact-grid">

          {/* Form */}
          <div className="contact-form-box">
            {!submitted ? (
              <>
                <div className="contact-form-title">Send us a message</div>
                <div className="contact-fields">
                  <div className="contact-field">
                    <label>Your Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="contact-field">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="john@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="contact-field">
                    <label>Message</label>
                    <textarea
                      rows={5}
                      placeholder="Tell us how we can help..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <button
                    className="contact-submit-btn"
                    onClick={handleSubmit}
                    disabled={loading || !formData.name || !formData.email || !formData.message}
                  >
                    {loading ? (
                      <><span className="contact-spinner" /> Sending...</>
                    ) : (
                      "Send Message →"
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="contact-success">
                <div className="contact-success-icon">✅</div>
                <div className="contact-success-title">Message Received!</div>
                <p className="contact-success-sub">
                  Thanks, {formData.name}. We'll reply to <strong>{formData.email}</strong> within 24 hours.
                </p>
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="contact-info">
            <div className="contact-info-item">
              <span className="contact-info-icon">📧</span>
              <div>
                <div className="contact-info-label">Email</div>
                <div className="contact-info-value">support@sdac.app</div>
              </div>
            </div>
            <div className="contact-info-item">
              <span className="contact-info-icon">📞</span>
              <div>
                <div className="contact-info-label">Phone</div>
                <div className="contact-info-value">+91 98765 43210</div>
              </div>
            </div>
            <div className="contact-info-item">
              <span className="contact-info-icon">🕐</span>
              <div>
                <div className="contact-info-label">Support Hours</div>
                <div className="contact-info-value">24 / 7 — Always available</div>
              </div>
            </div>
            <div className="contact-info-item">
              <span className="contact-info-icon">🚨</span>
              <div>
                <div className="contact-info-label">Emergency</div>
                <div className="contact-info-value">Use the SOS button in the Safety page</div>
              </div>
            </div>
          </div>

        </div>

        {/* ── FAQ ── */}
        <div className="contact-faq-section">
          <div className="contact-section-label">Frequently Asked Questions</div>
          <div className="contact-faq-list">
            {faqs.map((f, i) => (
              <div
                className={`contact-faq-item ${openFaq === i ? "open" : ""}`}
                key={i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="contact-faq-q">
                  <span>{f.q}</span>
                  <span className="contact-faq-chevron">{openFaq === i ? "−" : "+"}</span>
                </div>
                {openFaq === i && (
                  <div className="contact-faq-a">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}