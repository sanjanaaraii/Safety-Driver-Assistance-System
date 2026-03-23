export default function MapVisual({ pickup, dropoff, showDriver }) {
  return (
    <div className="map-container" style={{ height: '100%', minHeight: 320 }}>
      <div className="map-visual">
        <div className="map-grid-lines" />

        {/* Road network */}
        {[20, 40, 65, 80].map(t => (
          <div key={`h${t}`} style={{ position:'absolute', top:`${t}%`, left:0, right:0, height: t===40||t===65 ? 6 : 3, background: t===40||t===65 ? 'rgba(100,140,200,0.2)' : 'rgba(100,120,160,0.3)', borderRadius:3 }} />
        ))}
        {[15, 30, 50, 70, 85].map(l => (
          <div key={`v${l}`} style={{ position:'absolute', left:`${l}%`, top:0, bottom:0, width: l===30||l===70 ? 6 : 3, background: l===30||l===70 ? 'rgba(100,140,200,0.2)' : 'rgba(100,120,160,0.3)', borderRadius:3 }} />
        ))}

        {/* Route SVG */}
        {pickup && dropoff && (
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }}>
            <defs>
              <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3d7fff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <path d="M 25% 65% Q 50% 30% 75% 42%" stroke="url(#routeGrad)" strokeWidth="3" fill="none" strokeDasharray="8,4" />
          </svg>
        )}

        {/* Markers */}
        {pickup && (
          <div style={{ position:'absolute', left:'25%', top:'65%', transform:'translate(-50%,-100%)', display:'flex', flexDirection:'column', alignItems:'center' }}>
            <div style={{ width:32, height:32, borderRadius:'50% 50% 50% 0', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', transform:'rotate(-45deg)', boxShadow:'0 4px 12px rgba(0,0,0,0.4)' }}>
              <span style={{ transform:'rotate(45deg)', fontSize:'0.9rem' }}>📍</span>
            </div>
          </div>
        )}
        {dropoff && (
          <div style={{ position:'absolute', left:'75%', top:'42%', transform:'translate(-50%,-100%)', display:'flex', flexDirection:'column', alignItems:'center' }}>
            <div style={{ width:32, height:32, borderRadius:'50% 50% 50% 0', background:'var(--success)', display:'flex', alignItems:'center', justifyContent:'center', transform:'rotate(-45deg)', boxShadow:'0 4px 12px rgba(0,0,0,0.4)' }}>
              <span style={{ transform:'rotate(45deg)', fontSize:'0.9rem' }}>🏁</span>
            </div>
          </div>
        )}
        {showDriver && (
          <div className="map-driver-dot" style={{ left:'42%', top:'54%' }} />
        )}

        {/* Info overlay */}
        {pickup && (
          <div className="map-overlay-info">
            <div style={{ color:'var(--text2)', fontSize:'0.75rem', marginBottom:'0.25rem' }}>Est. Journey</div>
            <div style={{ fontFamily:'Syne, sans-serif', fontWeight:700 }}>28 min · 14.2 km</div>
          </div>
        )}

        {/* Legend */}
        <div className="map-legend">
          {pickup && <div className="map-legend-item"><div className="map-legend-dot" style={{ background:'var(--accent)' }} />Pickup</div>}
          {dropoff && <div className="map-legend-item"><div className="map-legend-dot" style={{ background:'var(--success)' }} />Destination</div>}
          {showDriver && <div className="map-legend-item"><div className="map-legend-dot" style={{ background:'var(--warning)' }} />Driver</div>}
        </div>

        {!pickup && (
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'var(--text3)' }}>
            <div style={{ fontSize:'3rem', marginBottom:'0.75rem', opacity:0.4 }}>🗺️</div>
            <div style={{ fontSize:'0.9rem' }}>Enter locations to see route</div>
          </div>
        )}
      </div>
    </div>
  )
}
