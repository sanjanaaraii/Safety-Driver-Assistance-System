import Navbar from "../components/Navbar";
import MapView from "../components/MapView";
import BookingCard from "../components/BookingCard";
import "../styles/home.css";
import "../styles/Navbar.css";

export default function Home() {
  return (
    <div className="home">
      <Navbar />
      <MapView />
      <BookingCard />
    </div>
  );
}
