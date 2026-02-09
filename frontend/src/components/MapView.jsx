export default function MapView() {
  return (
    <div className="map-container">
      {/* Static map placeholder — real map SDK later */}
      <iframe
        title="map"
        src="https://www.google.com/maps?q=Delhi&output=embed"
        loading="lazy"
      />
    </div>
  );
}
