import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabase'
import { MOCK_DRIVERS, MOCK_TRIPS_USER, REASONS, SCHEMA_SQL } from '../lib/mockData'
import MapVisual from '../components/MapVisual'

function BookSection({ user, addToast }) {
  const [step, setStep] = useState(0)
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fare] = useState(`₹${Math.floor(Math.random() * 300) + 250}`)
  const [activeBooking, setActiveBooking] = useState(null)

  const handleFindDrivers = () => {
    if (!pickup || !dropoff) { addToast('Please enter pickup and dropoff locations', 'error'); return }
    setStep(1)
    addToast('Found 3 available drivers nearby!', 'success')
  }

  const handleConfirm = async () => {
    if (!selectedDriver) { addToast('Please select a driver', 'error'); return }
    setLoading(true)
    try {
      if (supabase) {
        const { data, error } = await supabase.from('bookings').insert({
          user_id: user.id, pickup_address: pickup, dropoff_address: dropoff,
          status: 'pending', reason, notes, estimated_fare: parseFloat(fare.replace('₹', ''))
        }).select().single()
        if (error) throw error
        setActiveBooking(data)
      } else {
        await new Promise(r => setTimeout(r, 900))
        setActiveBooking({ id: 'DEMO-' + Date.now() })
      }
      setStep(3)
      addToast(`${selectedDriver.name} is on the way! ETA: ${selectedDriver.eta}`, 'success')
    } catch (e) { addToast(e.message || 'Booking failed', 'error') }
    finally { setLoading(false) }
  }

  const handleCancel = () => {
    setStep(0); setPickup(''); setDropoff(''); setSelectedDriver(null); setActiveBooking(null)
    addToast('Trip cancelled', 'info')
  }

  if (step === 3) return (
    <div className="fade-in">
      <div className="active-trip-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="pulse-dot" />
          <div>
            <div style={{ fontWeight: 600, fontFamily: 'Syne, sans-serif' }}>{selectedDriver?.name} is driving to you</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>ETA: {selectedDriver?.eta}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span className="badge badge-success">● Active Trip</span>
          <button className="btn btn-danger" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
      <div className="booking-layout" style={{ height: 500 }}>
        <div className="booking-panel">
          <div className="driver-card selected" style={{ cursor: 'default', marginBottom: '1.5rem' }}>
            <div className="driver-avatar">{selectedDriver?.initials}</div>
            <div>
              <div className="font-syne" style={{ fontWeight: 700 }}>{selectedDriver?.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                <span style={{ color: 'var(--warning)', fontSize: '0.8rem' }}>★★★★★</span>
                <span style={{ fontSize: '0.85rem' }}>{selectedDriver?.rating}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginTop: 3 }}>{selectedDriver?.vehicle}</div>
            </div>
          </div>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem' }}><span>📍</span>{pickup}</div>
              <div style={{ width: 2, height: 16, background: 'var(--border)', marginLeft: 9 }} />
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem' }}><span>🏁</span>{dropoff}</div>
            </div>
          </div>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-sm)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Estimated Fare</span>
            <span className="font-syne" style={{ fontWeight: 800, color: 'var(--success)', fontSize: '1.3rem' }}>{fare}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => addToast('📞 Calling driver...', 'info')}>📞 Call</button>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => addToast('💬 Opening chat...', 'info')}>💬 Chat</button>
          </div>
        </div>
        <MapVisual pickup={pickup} dropoff={dropoff} showDriver />
      </div>
    </div>
  )

  return (
    <div className="booking-layout fade-in" style={{ minHeight: 480 }}>
      <div className="booking-panel">
        {/* Steps */}
        <div className="steps">
          {['Location', 'Driver', 'Confirm'].map((s, i) => (
            <div key={i} className={`step ${step > i ? 'done' : step === i ? 'active' : ''}`}>
              <div className="step-circle">{step > i ? '✓' : i + 1}</div>
              <div className="step-label">{s}</div>
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="fade-in">
            <div className="input-group">
              <label className="input-label">📍 Pickup Location</label>
              <input className="input" placeholder="Where are you now?" value={pickup} onChange={e => setPickup(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">🏁 Destination</label>
              <input className="input" placeholder="Where do you need to go?" value={dropoff} onChange={e => setDropoff(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Reason for Assistance</label>
              <select className="input" value={reason} onChange={e => setReason(e.target.value)}>
                <option value="">Select reason...</option>
                {REASONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Notes (optional)</label>
              <input className="input" placeholder="Any special instructions..." value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-full btn-lg" onClick={handleFindDrivers}>Find Available Drivers →</button>
          </div>
        )}

        {step === 1 && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="font-syne" style={{ fontWeight: 700 }}>Nearby Drivers</h3>
              <span className="badge badge-success">{MOCK_DRIVERS.length} available</span>
            </div>
            {MOCK_DRIVERS.map(d => (
              <div key={d.id} className={`driver-card ${selectedDriver?.id === d.id ? 'selected' : ''}`} onClick={() => setSelectedDriver(d)}>
                <div className="driver-avatar">{d.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="font-syne" style={{ fontWeight: 700 }}>{d.name}</span>
                    <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>{d.badge}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                    <span style={{ color: 'var(--warning)', fontSize: '0.8rem' }}>★</span>
                    <span style={{ fontSize: '0.85rem' }}>{d.rating}</span>
                    <span style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>· {d.trips} trips</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>{d.eta}</div>
                </div>
                {selectedDriver?.id === d.id && <span style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>✓</span>}
              </div>
            ))}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setStep(0)}>← Back</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { if (!selectedDriver) { addToast('Please select a driver', 'error'); return } setStep(2) }}>Continue →</button>
            </div>
          </div>
        )}

        {step === 2 && selectedDriver && (
          <div className="fade-in">
            <h3 className="font-syne" style={{ fontWeight: 700, marginBottom: '1.2rem' }}>Confirm Booking</h3>
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-sm)', padding: '1.2rem', marginBottom: '1rem' }}>
              {[['📍 From', pickup], ['🏁 To', dropoff], ['🚗 Driver', selectedDriver.name], ['💡 Reason', reason || 'Not specified']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                  <span style={{ color: 'var(--text2)' }}>{k}</span>
                  <span style={{ textAlign: 'right', maxWidth: '60%' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--radius-sm)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <span style={{ color: 'var(--text2)' }}>Estimated Fare</span>
              <span className="font-syne" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)' }}>{fare}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-success" style={{ flex: 1 }} onClick={handleConfirm} disabled={loading}>
                {loading ? '⏳ Booking...' : '✓ Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
      <MapVisual pickup={pickup} dropoff={dropoff} showDriver={step >= 1} />
    </div>
  )
}

function HistorySection() {
  return (
    <div className="fade-in">
      <div className="stats-grid">
        {[['Total Trips', '4', '↑ 1 this week'], ['Money Saved', '₹1,950', 'vs ride-hailing'], ['Safety Score', 'A+', 'Excellent'], ['Avg Rating', '4.9★', 'Given to drivers']].map(([l, v, c]) => (
          <div key={l} className="stat-card">
            <div className="stat-label">{l}</div>
            <div className="stat-value" style={{ fontSize: '1.6rem' }}>{v}</div>
            <div className="stat-change stat-up">{c}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <table className="trips-table">
          <thead><tr><th>Date</th><th>Route</th><th>Driver</th><th>Fare</th><th>Status</th></tr></thead>
          <tbody>
            {MOCK_TRIPS_USER.map(t => (
              <tr key={t.id}>
                <td style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>{t.date}</td>
                <td><div style={{ fontSize: '0.9rem' }}>{t.pickup}</div><div style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>→ {t.drop}</div></td>
                <td style={{ fontSize: '0.9rem' }}>{t.driver}</td>
                <td className="font-syne" style={{ fontWeight: 700 }}>{t.fare}</td>
                <td><span className={`badge ${t.status === 'completed' ? 'badge-success' : 'badge-danger'}`}>{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ProfileSection({ user, addToast }) {
  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="profile-avatar-lg">{(user.name || 'U').charAt(0).toUpperCase()}</div>
        <div>
          <div className="font-syne" style={{ fontSize: '1.3rem', fontWeight: 700 }}>{user.name || 'Demo User'}</div>
          <div style={{ color: 'var(--text2)' }}>{user.email}</div>
          <span className="badge badge-info" style={{ marginTop: '0.4rem' }}>Passenger Account</span>
        </div>
      </div>
      <div className="card" style={{ maxWidth: 480 }}>
        <h3 className="font-syne" style={{ fontWeight: 700, marginBottom: '1.2rem' }}>Account Details</h3>
        <div className="input-group"><label className="input-label">Full Name</label><input className="input" defaultValue={user.name || ''} /></div>
        <div className="input-group"><label className="input-label">Email</label><input className="input" defaultValue={user.email || ''} disabled style={{ opacity: 0.6 }} /></div>
        <div className="input-group"><label className="input-label">Phone Number</label><input className="input" placeholder="+91 xxxxx xxxxx" /></div>
        <button className="btn btn-primary" onClick={() => addToast('Profile updated!', 'success')}>Save Changes</button>
      </div>
    </div>
  )
}

function SchemaSection({ addToast }) {
  return (
    <div className="fade-in">
      <h1 className="font-syne" style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>Supabase Setup</h1>
      <p style={{ color: 'var(--text2)', marginBottom: '1.5rem' }}>Copy this SQL into your Supabase SQL Editor to create all tables</p>
      <div style={{ position: 'relative' }}>
        <pre style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', fontSize: '0.78rem', overflowX: 'auto', color: '#a8c7fa', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{SCHEMA_SQL}</pre>
        <button className="btn btn-secondary" style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => { navigator.clipboard?.writeText(SCHEMA_SQL); addToast('SQL copied!', 'success') }}>Copy SQL</button>
      </div>
      <div className="card" style={{ marginTop: '1.5rem', background: 'rgba(61,127,255,0.06)', borderColor: 'rgba(61,127,255,0.2)' }}>
        <h3 className="font-syne" style={{ fontWeight: 700, marginBottom: '1rem' }}>⚙️ Configure Supabase</h3>
        <p style={{ color: 'var(--text2)', fontSize: '0.85rem', marginBottom: '1rem' }}>Create a <code>.env</code> file in the project root:</p>
        <pre style={{ background: 'var(--bg3)', borderRadius: 8, padding: '1rem', fontSize: '0.8rem', color: '#a8c7fa' }}>{`VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co\nVITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY`}</pre>
      </div>
    </div>
  )
}

const SIDEBAR = [
  { id: 'book', icon: '🗺️', label: 'Book Driver' },
  { id: 'history', icon: '📋', label: 'My Trips' },
  { id: 'profile', icon: '👤', label: 'Profile' },
  { id: 'schema', icon: '🗄️', label: 'DB Schema' },
]

export default function UserDashboard() {
  const { user, addToast } = useApp()
  const [section, setSection] = useState('book')

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-section">Main</div>
        {SIDEBAR.map(item => (
          <button key={item.id} className={`sidebar-item ${section === item.id ? 'active' : ''}`} onClick={() => setSection(item.id)}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </aside>
      <main className="main-content">
        {section !== 'schema' && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 className="font-syne" style={{ fontSize: '1.6rem', fontWeight: 800 }}>
              {section === 'book' ? 'Book a Safety Driver' : section === 'history' ? 'My Trips' : 'My Profile'}
            </h1>
            <p style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>
              {section === 'book' ? 'Your car, our professional driver' : section === 'history' ? 'Your complete travel history' : 'Manage your account'}
            </p>
          </div>
        )}
        {section === 'book' && <BookSection user={user} addToast={addToast} />}
        {section === 'history' && <HistorySection />}
        {section === 'profile' && <ProfileSection user={user} addToast={addToast} />}
        {section === 'schema' && <SchemaSection addToast={addToast} />}
      </main>
    </div>
  )
}
