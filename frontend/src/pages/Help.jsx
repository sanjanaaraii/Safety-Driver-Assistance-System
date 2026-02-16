import Navbar from "../components/Navbar";
import "../styles/help.css";

export default function Help() {
  return (
    <>
      <Navbar />

      <div className="help-page">
        <section className="help-hero">
          <h1>How SDAC Works</h1>
          <p>Book a verified driver for your own vehicle in minutes.</p>
        </section>

        <section className="help-steps">
          <div className="step-card blue">
            <h3>1. Enter Trip Details</h3>
            <p>
              Provide your pickup and drop-off location on the home screen.
              You can explore without logging in.
            </p>
          </div>

          <div className="step-card green">
            <h3>2. Login Securely</h3>
            <p>
              If you're not logged in, you'll be redirected to authentication.
              Supabase handles secure login and account creation.
            </p>
          </div>

          <div className="step-card purple">
            <h3>3. Driver Assignment</h3>
            <p>
              Once booked, the system assigns a verified driver.
              Booking status updates in real-time.
            </p>
          </div>

          <div className="step-card orange">
            <h3>4. Trip Tracking</h3>
            <p>
              Your trip is digitally tracked. Safety and accountability are ensured.
            </p>
          </div>

          <div className="step-card red">
            <h3>5. Payment & Feedback</h3>
            <p>
              Complete payment and rate your driver.
              Trip history is saved for future reference.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
