import "../styles/MapView.css";

export default function MapView() {
  return (
    <div className="map-container">
      <iframe
        title="map"
        src="https://www.google.com/maps?q=Washington&z=10&output=embed"
        loading="lazy"
      ></iframe>
    </div>
  );
}
