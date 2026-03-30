import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

// ─── tiny helpers ──────────────────────────────────────────────────────────────
const HOUR_LABELS = ['12a','1a','2a','3a','4a','5a','6a','7a','8a','9a','10a','11a',
                     '12p','1p','2p','3p','4p','5p','6p','7p','8p','9p','10p','11p']

const REASON_COLORS = {
  'Fatigue / Drowsiness':    '#3d7fff',
  'Medical Condition':       '#f43f5e',
  'Alcohol Consumption':     '#a855f7',
  'Stress / Anxiety':        '#f59e0b',
  'Emergency Situation':     '#ef4444',
  'Post-Surgery Recovery':   '#22c55e',
  'Long Distance Travel':    '#06b6d4',
  'Other':                   '#94a3b8',
}
const CHART_ACCENT = '#3d7fff'

function normalize(arr, key) {
  const max = Math.max(...arr.map(d => d[key]), 1)
  return arr.map(d => ({ ...d, pct: (d[key] / max) * 100 }))
}

// ─── Stat KPI tile ─────────────────────────────────────────────────────────────
function KPI({ label, value, sub, color = '#3d7fff', icon }) {
  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16,
      padding: '1.4rem 1.6rem', display: 'flex', flexDirection: 'column', gap: 6,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -16, right: -10, fontSize: '5rem', opacity: 0.07,
        pointerEvents: 'none', userSelect: 'none',
      }}>{icon}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text2)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{sub}</div>}
    </div>
  )
}

// ─── Horizontal bar chart ──────────────────────────────────────────────────────
function HBar({ data, valueKey, labelKey, color = CHART_ACCENT, unit = '' }) {
  const rows = normalize(data, valueKey).slice(0, 8)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {rows.map((d, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 130, fontSize: '0.78rem', color: 'var(--text2)', textAlign: 'right',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 0 }}>
            {d[labelKey]}
          </div>
          <div style={{ flex: 1, background: 'var(--bg3,rgba(255,255,255,0.04))', borderRadius: 6, height: 20, position: 'relative', overflow: 'hidden' }}>
            <div style={{
              width: `${d.pct}%`, height: '100%', borderRadius: 6,
              background: `linear-gradient(90deg, ${color}bb, ${color})`,
              transition: 'width 0.8s cubic-bezier(.4,0,.2,1)',
            }} />
          </div>
          <div style={{ width: 40, fontSize: '0.78rem', color, fontWeight: 700, fontFamily: 'Syne, sans-serif', flexShrink: 0 }}>
            {d[valueKey]}{unit}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Hourly heatmap bar ────────────────────────────────────────────────────────
function HourlyBars({ data }) {
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 80 }}>
      {data.map((d, i) => {
        const h = (d.count / max) * 80
        const isNight = i < 6 || i >= 22
        const isPeak = d.count === Math.max(...data.map(x => x.count))
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div
              title={`${HOUR_LABELS[i]}: ${d.count} trips`}
              style={{
                width: '100%', height: h, borderRadius: '4px 4px 2px 2px',
                background: isPeak
                  ? '#f59e0b'
                  : isNight
                  ? 'rgba(61,127,255,0.35)'
                  : `rgba(61,127,255,${0.2 + (d.count / max) * 0.8})`,
                transition: 'height 0.6s ease',
                cursor: 'default',
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

// ─── Donut chart (SVG) ─────────────────────────────────────────────────────────
function Donut({ data, valueKey, labelKey }) {
  const total = data.reduce((s, d) => s + d[valueKey], 0) || 1
  let cursor = 0
  const cx = 70, cy = 70, r = 52, inner = 34
  const slices = data.map((d, i) => {
    const pct = d[valueKey] / total
    const startAngle = cursor * 2 * Math.PI - Math.PI / 2
    cursor += pct
    const endAngle = cursor * 2 * Math.PI - Math.PI / 2
    const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle),   y2 = cy + r * Math.sin(endAngle)
    const xi1 = cx + inner * Math.cos(startAngle), yi1 = cy + inner * Math.sin(startAngle)
    const xi2 = cx + inner * Math.cos(endAngle),   yi2 = cy + inner * Math.sin(endAngle)
    const large = pct > 0.5 ? 1 : 0
    const col = REASON_COLORS[d[labelKey]] || '#94a3b8'
    return (
      <path key={i}
        d={`M ${xi1} ${yi1} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${inner} ${inner} 0 ${large} 0 ${xi1} ${yi1} Z`}
        fill={col} opacity={0.9}
      >
        <title>{d[labelKey]}: {d[valueKey]} trips</title>
      </path>
    )
  })
  return (
    <svg viewBox="0 0 140 140" style={{ width: 140, height: 140, flexShrink: 0 }}>
      {slices}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--text1)" fontSize="18" fontWeight="800" fontFamily="Syne, sans-serif">{total}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="var(--text3)" fontSize="9">TRIPS</text>
    </svg>
  )
}

// ─── Earnings trend sparkline ──────────────────────────────────────────────────
function Sparkline({ data, color = '#22c55e' }) {
  if (!data.length) return null
  const vals = data.map(d => d.fare)
  const min = Math.min(...vals), max = Math.max(...vals, min + 1)
  const W = 340, H = 60, pad = 6
  const pts = data.map((d, i) => {
    const x = pad + (i / Math.max(data.length - 1, 1)) * (W - pad * 2)
    const y = H - pad - ((d.fare - min) / (max - min)) * (H - pad * 2)
    return `${x},${y}`
  }).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H }}>
      <defs>
        <linearGradient id="spGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <polygon points={`${pad},${H} ${pts} ${W - pad},${H}`} fill="url(#spGrad)" />
    </svg>
  )
}

// ─── Main AnalyticsSection ─────────────────────────────────────────────────────
export default function AnalyticsSection({ user }) {
  const [trips, setTrips]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [range, setRange]       = useState('30') // days

  useEffect(() => {
    async function load() {
      setLoading(true)
      if (!supabase) { setTrips([]); setLoading(false); return }
      const since = new Date()
      since.setDate(since.getDate() - parseInt(range))
      const { data, error } = await supabase
        .from('bookings')
        .select('pickup_address, dropoff_address, reason, estimated_fare, final_fare, requested_at, completed_at, status')
        .eq('driver_id', user.id)
        .eq('status', 'completed')
        .gte('completed_at', since.toISOString())
        .order('completed_at', { ascending: true })
      if (!error && data) setTrips(data)
      setLoading(false)
    }
    load()
  }, [user.id, range])

  // ── derived data ──────────────────────────────────────────────────────────────
  const totalEarnings = trips.reduce((s, t) => s + parseFloat(t.final_fare || t.estimated_fare || 0), 0)
  const avgFare       = trips.length ? totalEarnings / trips.length : 0
  const topRating     = '4.9' // would come from ratings table in a full impl

  // Pickup frequency map
  const pickupMap = {}
  trips.forEach(t => {
    const key = (t.pickup_address || 'Unknown').trim()
    pickupMap[key] = (pickupMap[key] || 0) + 1
  })
  const pickupData = Object.entries(pickupMap)
    .map(([addr, count]) => ({ addr, count }))
    .sort((a, b) => b.count - a.count)

  // Hourly distribution
  const hourData = Array.from({ length: 24 }, (_, h) => ({ hour: h, count: 0 }))
  trips.forEach(t => {
    if (t.requested_at) {
      const h = new Date(t.requested_at).getHours()
      hourData[h].count++
    }
  })

  // Reason breakdown
  const reasonMap = {}
  trips.forEach(t => {
    const r = t.reason || 'Other'
    reasonMap[r] = (reasonMap[r] || 0) + 1
  })
  const reasonData = Object.entries(reasonMap)
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count)

  // Earnings sparkline (daily)
  const earningsMap = {}
  trips.forEach(t => {
    if (t.completed_at) {
      const day = t.completed_at.slice(0, 10)
      earningsMap[day] = (earningsMap[day] || 0) + parseFloat(t.final_fare || t.estimated_fare || 0)
    }
  })
  const sparkData = Object.entries(earningsMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, fare]) => ({ date, fare }))

  const peakHour = hourData.reduce((max, d) => d.count > max.count ? d : max, hourData[0])

  // ── render ────────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem', gap: 16, color: 'var(--text2)' }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: '#3d7fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ fontSize: '0.9rem' }}>Loading your analytics…</div>
    </div>
  )

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── header strip ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="font-syne" style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Performance Dashboard</h2>
          <p style={{ color: 'var(--text2)', fontSize: '0.82rem', margin: '2px 0 0' }}>
            {trips.length} completed trips in the last {range} days
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 4 }}>
          {[['7', '7D'], ['30', '30D'], ['90', '90D']].map(([v, l]) => (
            <button key={v} onClick={() => setRange(v)} style={{
              padding: '0.35rem 0.9rem', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700,
              background: range === v ? '#3d7fff' : 'transparent',
              color: range === v ? '#fff' : 'var(--text2)',
              transition: 'all 0.2s',
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* ── KPI row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        <KPI label="Total Earnings"  value={`₹${Math.round(totalEarnings).toLocaleString('en-IN')}`} sub={`${trips.length} trips`}       color="#22c55e" icon="💰" />
        <KPI label="Avg Fare"        value={`₹${Math.round(avgFare)}`}                               sub="per completed trip"            color="#3d7fff" icon="🧾" />
        <KPI label="Peak Hour"       value={HOUR_LABELS[peakHour?.hour ?? 0]}                        sub={`${peakHour?.count ?? 0} trips`} color="#f59e0b" icon="⏰" />
        <KPI label="Driver Rating"   value={topRating}                                               sub="based on ratings"               color="#a855f7" icon="⭐" />
      </div>

      {trips.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text3)', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16 }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
          <div className="font-syne" style={{ fontWeight: 700, color: 'var(--text2)', fontSize: '1.1rem', marginBottom: 6 }}>No trip data yet</div>
          <div style={{ fontSize: '0.85rem' }}>Complete trips to see your analytics here</div>
        </div>
      ) : (
        <>
          {/* ── earnings sparkline ── */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.4rem 1.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <div className="font-syne" style={{ fontWeight: 700, marginBottom: 2 }}>Earnings Trend</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>Daily fare totals over selected period</div>
              </div>
              <div className="font-syne" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22c55e' }}>
                ₹{Math.round(totalEarnings).toLocaleString('en-IN')}
              </div>
            </div>
            <Sparkline data={sparkData} color="#22c55e" />
          </div>

          {/* ── 2-col charts ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.2rem' }}>

            {/* Pickup locations */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.4rem 1.6rem' }}>
              <div className="font-syne" style={{ fontWeight: 700, marginBottom: 4 }}>Top Pickup Locations</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text2)', marginBottom: '1.2rem' }}>Where you pick up customers most</div>
              {pickupData.length ? (
                <HBar data={pickupData} valueKey="count" labelKey="addr" color="#3d7fff" unit=" trips" />
              ) : (
                <div style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>No data</div>
              )}
            </div>

            {/* Trip reasons donut */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.4rem 1.6rem' }}>
              <div className="font-syne" style={{ fontWeight: 700, marginBottom: 4 }}>Trip Reasons</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text2)', marginBottom: '1.2rem' }}>Why passengers book a driver</div>
              {reasonData.length ? (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Donut data={reasonData} valueKey="count" labelKey="reason" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 120 }}>
                    {reasonData.slice(0, 6).map((d, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: REASON_COLORS[d.reason] || '#94a3b8', flexShrink: 0 }} />
                        <div style={{ fontSize: '0.75rem', color: 'var(--text2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.reason}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text1)', fontFamily: 'Syne, sans-serif' }}>{d.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>No data</div>
              )}
            </div>
          </div>

          {/* ── hourly heatmap ── */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.4rem 1.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div className="font-syne" style={{ fontWeight: 700, marginBottom: 2 }}>Activity by Hour</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>
                  Busiest at <span style={{ color: '#f59e0b', fontWeight: 700 }}>{HOUR_LABELS[peakHour?.hour ?? 0]}</span>
                  {' '}· 🌙 night {' '}
                  <span style={{ color: 'rgba(61,127,255,0.7)' }}>■</span> day{' '}
                  <span style={{ color: '#f59e0b' }}>■</span> peak
                </div>
              </div>
            </div>
            <HourlyBars data={hourData} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              {['12a','3a','6a','9a','12p','3p','6p','9p'].map(l => (
                <div key={l} style={{ fontSize: '0.67rem', color: 'var(--text3)' }}>{l}</div>
              ))}
            </div>
          </div>

          {/* ── dropoff locations ── */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.4rem 1.6rem' }}>
            <div className="font-syne" style={{ fontWeight: 700, marginBottom: 4 }}>Top Drop-off Destinations</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text2)', marginBottom: '1.2rem' }}>Where you drop passengers most often</div>
            {(() => {
              const dm = {}
              trips.forEach(t => { const k = (t.dropoff_address || 'Unknown').trim(); dm[k] = (dm[k] || 0) + 1 })
              const dd = Object.entries(dm).map(([addr, count]) => ({ addr, count })).sort((a, b) => b.count - a.count)
              return dd.length
                ? <HBar data={dd} valueKey="count" labelKey="addr" color="#22c55e" unit=" drops" />
                : <div style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>No data</div>
            })()}
          </div>
        </>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}