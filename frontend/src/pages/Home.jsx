import MapView from "../components/MapView";
import BookingCard from "../components/BookingCard";
import "../styles/home.css";

export default function Home() {
  return (
    <div className="home">
      <MapView />
      <BookingCard />
    </div>
  );
}
