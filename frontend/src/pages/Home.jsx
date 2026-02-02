import Navbar from "../components/Navbar";
import BookingCard from "../components/BookingCard";
import MapView from "../components/MapView";
import "../styles/Home.css";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="home">
        <BookingCard />
        <MapView />
      </div>
    </>
  );
}
