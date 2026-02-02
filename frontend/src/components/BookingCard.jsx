import "../styles/BookingCard.css";

export default function BookingCard() {
  return (
    <div className="booking-card">
      <h3>Get a driver</h3>

      <input type="text" placeholder="Pickup location" />
      <input type="text" placeholder="Drop-off location" />

      <button className="book-btn">Book</button>
    </div>
  );
}
