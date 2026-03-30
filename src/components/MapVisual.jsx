import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";

export default function MapVisual({ pickup, dropoff, showDriver }) {
  const pickupPos = pickup ? [28.6139, 77.2090] : null;   // Delhi (example)
  const dropoffPos = dropoff ? [28.5355, 77.3910] : null;

  return (
    <div className="map-container" style={{ height: '100%', minHeight: 320 }}>
      <div className="map-visual">

        {/* REAL MAP BACKGROUND */}
        <MapContainer
          center={pickupPos || [28.6139, 77.2090]}
          zoom={12}
          style={{ height: "100%", width: "100%", position: "absolute", inset: 0, zIndex: 0 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {pickupPos && <Marker position={pickupPos} />}
          {dropoffPos && <Marker position={dropoffPos} />}

          {pickupPos && dropoffPos && (
            <Polyline positions={[pickupPos, dropoffPos]} color="blue" />
          )}
        </MapContainer>

        {/* KEEP YOUR EXISTING UI OVERLAY */}
        <div style={{ position: "relative", zIndex: 10 }}>

          <div className="map-grid-lines" />

          {/* keep your SVG route, markers, legend, overlay etc exactly same */}

          {pickup && (
            <div className="map-overlay-info">
              <div style={{ color:'var(--text2)', fontSize:'0.75rem', marginBottom:'0.25rem' }}>
                Est. Journey
              </div>
              <div style={{ fontFamily:'Syne, sans-serif', fontWeight:700 }}>
                28 min · 14.2 km
              </div>
            </div>
          )}

          <div className="map-legend">
            {pickup && <div className="map-legend-item">Pickup</div>}
            {dropoff && <div className="map-legend-item">Destination</div>}
            {showDriver && <div className="map-legend-item">Driver</div>}
          </div>

        </div>
      </div>
    </div>
  );
}