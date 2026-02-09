import { useState } from "react";
import { getAuthStatus } from "../api/auth";

export default function BookingCard() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    setLoading(true);

    try {
      const auth = await getAuthStatus();

      if (!auth.isLoggedIn) {
        window.location.href = "/login";
        return;
      }

      // Booking flow continues later
      alert("Proceed to booking flow");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-card">
      <input
        placeholder="Pickup location"
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
      />

      <input
        placeholder="Drop-off location"
        value={drop}
        onChange={(e) => setDrop(e.target.value)}
      />

      <button onClick={handleBook} disabled={loading}>
        {loading ? "Checking..." : "Book Driver"}
      </button>
    </div>
  );
}
