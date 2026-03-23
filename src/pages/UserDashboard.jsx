import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabase'
import { REASONS, SCHEMA_SQL } from '../lib/mockData'
import MapVisual from '../components/MapVisual'

const FARE_ESTIMATE = () => `₹${Math.floor(Math.random() * 300) + 250}`

function BookSection({ user, addToast }) {
  const [step, setStep] = useState(0)
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [availableDrivers, setAvailableDrivers] = useState([])
  const [loading, setLoading] = useState(false)
  const [fare] = useState(FARE_ESTIMATE())
  const [activeBooking, setActiveBooking] = useState(null)
  const [bookingStatus, setBookingStatus] = useState(null)

  // Fetch real available drivers from Supabase
  const fetchDrivers = async () => {
    if (!supabase) {
      setAvailableDrivers([
        { id: '1', full_name: 'Arjun Sharma', rating: 4.9, total_trips: 312, vehicle_make: 'Honda', vehicle_plate: 'DL01AB1234' },
        { id: '2', full_name: 'Priya Kapoor', rating: 4.8, total_trips: 198, vehicle_make: 'Maruti', vehicle_plate: 'DL05CD5678' },
      ])
      return
    }
    const { data, error } = await supabase
      .from('drivers')
      .select('id, rating, total_trips, vehicle_make, vehicle_model, vehicle_plate, profiles(full_name, phone)')
      .eq('is_available', true)
    if (!error && data) setAvailableDrivers(data)
  }

  const handleFindDrivers = async () => {
    if (!pickup || !dropoff) { addToast('Please enter pickup and dropoff locations', 'error'); return }
    setLoading(true)
    await fetchDrivers()
    setLoading(false)
    setStep(1)
    addToast('Found available drivers nearby!', 'success')
  }

  const handleConfirm = async () => {
    if (!selectedDriver) { addToast('Please select a driver', 'error'); return }
    setLoading(true)
    try {
      if (supabase) {
        // Create booking in Supabase — status: pending, driver_id assigned immediately
        const { data, error } = await supabase
          .from('bookings')
          .insert({
            user_id: user.id,
            driver_id: selectedDriver.id,
            pickup_address: pickup,
            dropoff_address: dropoff,
            status: 'pending',
            reason,
            notes,
            estimated_fare: parseFloat(fare.replace('₹', '')),
          })
          .select()
          .single()
        if (error) throw error
        setActiveBooking(data)
        setBookingStatus('pending')

        // Subscribe to real-time status changes on this booking
        supabase
          .channel(`booking-${data.id}`)
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'bookings',
            filter: `id=eq.${data.id}`,
          }, (payload) => {
            setBookingStatus(payload.new.status)
            if (payload.new.status === 'accepted') addToast('🚗 Driver accepted your booking!', 'success')
            if (payload.new.status === 'in_progress') addToast('🚦 Trip has started!', 'success')
            if (payload.new.status === 'completed') addToast('✅ Trip completed!', 'success')
          })
          .subscribe()
      } else {
        await new Promise(r => setTimeout(r, 900))
        setActiveBooking({ id: 'DEMO-' + Date.now() })
        setBookingStatus('pending')
      }
      setStep(3)
      addToast('Booking sent! Waiting for driver to accept...', 'info')
    } catch (e) { addToast(e.message || 'Booking failed', 'error') }
    finally { setLoading(false) }
  }

  const handleCancel = async () => {
    if (activeBooking?.id && supabase) {
      await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', activeBooking.id)
    }
    setStep(0); setPickup(''); setDropoff(''); setSelectedDriver(null)
    setActiveBooking(null); setBookingStatus(null)
    addToast('Trip cancelled', 'info')
  }

  const driverName = selectedDriver?.profiles?.full_name || selectedDriver?.full_name || 'Driver'
  const driverInitials = driverName.split(' ').map(n => n[0]).join('').toUpperCase()

  const statusLabel = {
    pending: '⏳ Waiting for driver to accept...',
    accepted: '✅ Driver accepted — on the way!',
    in_progress: '🚗 Trip in progress',
    completed: '🎉 Trip completed',
    cancelled: '❌ Cancelled',
  }

  if (step === 3) return (
    <div className="fade-in">
      <div className="active-trip-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="pulse-dot" />
          <div>
            <div style={{ fontWeight: 600, fontFamily: 'Syne, sans-serif' }}>
              {statusLabel[bookingStatus] || 'Booking active'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>
              Booking ID: {activeBooking?.id?.slice(0, 8)}...
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span className={`badge ${bookingStatus === 'accepted' || bookingStatus === 'in_progress' ? 'badge-success' : 'badge-warning'}`}>
            ● {bookingStatus}
          </span>
          {bookingStatus !== 'completed' && (
            <button className="btn btn-danger" onClick={handleCancel}>Cancel</button>
          )}
        </div>
      </div>
      <div className="booking-layout" style={{ minHeight: 460 }}>
        <div className="booking-panel">
          <div className="driver-card selected" style={{ cursor: 'default', marginBottom: '1.5rem' }}>
            <div className="driver-avatar">{driverInitials}</div>
            <div>
              <div className="font-syne" style={{ fontWeight: 700 }}>{driverName}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                <span style={{ color: 'var(--warning)', fontSize: '0.8rem' }}>★</span>
                <span style={{ fontSize: '0.85rem' }}>{selectedDriver?.rating}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginTop: 3 }}>
                {selectedDriver?.vehicle_make} · {selectedDriver?.vehicle_plate}
              </div>
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
        <MapVisual pickup={pickup} dropoff={dropoff} showDriver={bookingStatus === 'accepted' || bookingStatus === 'in_progress'} />
      </div>
    </div>
  )

  return (
    <div className="booking-layout fade-in" style={{ minHeight: 480 }}>
      <div className="booking-panel">
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
            <button className="btn btn-primary btn-full btn-lg" onClick={handleFindDrivers} disabled={loading}>
              {loading ? '⏳ Finding drivers...' : 'Find Available Drivers →'}
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="font-syne" style={{ fontWeight: 700 }}>Available Drivers</h3>
              <span className="badge badge-success">{availableDrivers.length} online</span>
            </div>
            {availableDrivers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>😔</div>
                <div>No drivers available right now.</div>
                <div style={{ fontSize: '0.82rem', marginTop: '0.25rem' }}>Drivers need to go online from their dashboard.</div>
              </div>
            ) : (
              availableDrivers.map(d => {
                const name = d.profiles?.full_name || d.full_name || 'Driver'
                const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()
                return (
                  <div key={d.id} className={`driver-card ${selectedDriver?.id === d.id ? 'selected' : ''}`} onClick={() => setSelectedDriver(d)}>
                    <div className="driver-avatar">{initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="font-syne" style={{ fontWeight: 700 }}>{name}</span>
                        <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>Verified</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                        <span style={{ color: 'var(--warning)', fontSize: '0.8rem' }}>★</span>
                        <span style={{ fontSize: '0.85rem' }}>{d.rating}</span>
                        <span style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>· {d.total_trips} trips</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>{d.vehicle_make} {d.vehicle_model} · {d.vehicle_plate}</div>
                    </div>
                    {selectedDriver?.id === d.id && <span style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>✓</span>}
                  </div>
                )
              })
            )}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setStep(0)}>← Back</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => {
                if (!selectedDriver) { addToast('Please select a driver', 'error'); return }
                setStep(2)
              }}>Continue →</button>
            </div>
          </div>
        )}

        {step === 2 && selectedDriver && (
          <div className="fade-in">
            <h3 className="font-syne" style={{ fontWeight: 700, marginBottom: '1.2rem' }}>Confirm Booking</h3>
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-sm)', padding: '1.2rem', marginBottom: '1rem' }}>
              {[
                ['📍 From', pickup],
                ['🏁 To', dropoff],
                ['🚗 Driver', selectedDriver?.profiles?.full_name || selectedDriver?.full_name],
                ['💡 Reason', reason || 'Not specified'],
              ].map(([k, v]) => (
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

function HistorySection({ user, addToast }) {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrips = async () => {
      if (!supabase) {
        setTrips([
          { id: 'B001', requested_at: '2026-03-21', pickup_address: 'Connaught Place', dropoff_address: 'Saket', estimated_fare: 320, status: 'completed' },
          { id: 'B002', requested_at: '2026-03-18', pickup_address: 'Lajpat Nagar', dropoff_address: 'IGI Airport', estimated_fare: 680, status: 'completed' },
        ])
        setLoading(false)
        return
      }
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('requested_at', { ascending: false })
      if (data) setTrips(data)
      setLoading(false)
    }
    fetchTrips()
  }, [user.id])

  return (
    <div className="fade-in">
      <div className="stats-grid">
        {[
          ['Total Trips', trips.length, ''],
          ['Completed', trips.filter(t => t.status === 'completed').length, ''],
          ['Cancelled', trips.filter(t => t.status === 'cancelled').length, ''],
          ['Total Spent', `₹${trips.filter(t => t.status === 'completed').reduce((s, t) => s + (t.final_fare || t.estimated_fare || 0), 0)}`, ''],
        ].map(([l, v, c]) => (
          <div key={l} className="stat-card">
            <div className="stat-label">{l}</div>
            <div className="stat-value" style={{ fontSize: '1.6rem' }}>{v}</div>
            {c && <div className="stat-change stat-up">{c}</div>}
          </div>
        ))}
      </div>
      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text2)' }}>Loading trips...</div>
        ) : trips.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
            No trips yet. Book your first driver!
          </div>
        ) : (
          <table className="trips-table">
            <thead><tr><th>Date</th><th>Route</th><th>Fare</th><th>Status</th></tr></thead>
            <tbody>
              {trips.map(t => (
                <tr key={t.id}>
                  <td style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>{new Date(t.requested_at).toLocaleDateString()}</td>
                  <td>
                    <div style={{ fontSize: '0.9rem' }}>{t.pickup_address}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>→ {t.dropoff_address}</div>
                  </td>
                  <td className="font-syne" style={{ fontWeight: 700 }}>₹{t.final_fare || t.estimated_fare || '—'}</td>
                  <td><span className={`badge ${t.status === 'completed' ? 'badge-success' : t.status === 'cancelled' ? 'badge-danger' : t.status === 'pending' ? 'badge-warning' : 'badge-info'}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function ProfileSection({ user, addToast }) {
  const [name, setName] = useState(user.name || '')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    if (supabase) {
      await supabase.from('profiles').update({ full_name: name, phone }).eq('id', user.id)
    }
    await new Promise(r => setTimeout(r, 500))
    setSaving(false)
    addToast('Profile updated!', 'success')
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="profile-avatar-lg">{(user.name || 'U').charAt(0).toUpperCase()}</div>
        <div>
          <div className="font-syne" style={{ fontSize: '1.3rem', fontWeight: 700 }}>{user.name || 'User'}</div>
          <div style={{ color: 'var(--text2)' }}>{user.email}</div>
          <span className="badge badge-info" style={{ marginTop: '0.4rem' }}>Passenger</span>
        </div>
      </div>
      <div className="card" style={{ maxWidth: 480 }}>
        <h3 className="font-syne" style={{ fontWeight: 700, marginBottom: '1.2rem' }}>Account Details</h3>
        <div className="input-group"><label className="input-label">Full Name</label><input className="input" value={name} onChange={e => setName(e.target.value)} /></div>
        <div className="input-group"><label className="input-label">Email</label><input className="input" value={user.email || ''} disabled style={{ opacity: 0.6 }} /></div>
        <div className="input-group"><label className="input-label">Phone Number</label><input className="input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 xxxxx xxxxx" /></div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
      </div>
    </div>
  )
}

function SchemaSection({ addToast }) {
  return (
    <div className="fade-in">
      <h1 className="font-syne" style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>Supabase Setup</h1>
      <p style={{ color: 'var(--text2)', marginBottom: '1.5rem' }}>Copy this SQL into your Supabase SQL Editor</p>
      <div style={{ position: 'relative' }}>
        <pre style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', fontSize: '0.78rem', overflowX: 'auto', color: '#a8c7fa', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{SCHEMA_SQL}</pre>
        <button className="btn btn-secondary" style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          onClick={() => { navigator.clipboard?.writeText(SCHEMA_SQL); addToast('SQL copied!', 'success') }}>Copy SQL</button>
      </div>
      <div className="card" style={{ marginTop: '1.5rem', background: 'rgba(61,127,255,0.06)', borderColor: 'rgba(61,127,255,0.2)' }}>
        <h3 className="font-syne" style={{ fontWeight: 700, marginBottom: '1rem' }}>⚙️ Configure .env</h3>
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
  const titles = { book: ['Book a Safety Driver', 'Your car, our professional driver'], history: ['My Trips', 'Your complete travel history'], profile: ['My Profile', 'Manage your account'], schema: ['', ''] }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-section">Main</div>
        {SIDEBAR.map(item => (
          <button key={item.id} className={`sidebar-item ${section === item.id ? 'active' : ''}`} onClick={() => setSection(item.id)}>
            <span>{item.icon}</span><span>{item.label}</span>
          </button>
        ))}
      </aside>
      <main className="main-content">
        {section !== 'schema' && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 className="font-syne" style={{ fontSize: '1.6rem', fontWeight: 800 }}>{titles[section][0]}</h1>
            <p style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>{titles[section][1]}</p>
          </div>
        )}
        {section === 'book' && <BookSection user={user} addToast={addToast} />}
        {section === 'history' && <HistorySection user={user} addToast={addToast} />}
        {section === 'profile' && <ProfileSection user={user} addToast={addToast} />}
        {section === 'schema' && <SchemaSection addToast={addToast} />}
      </main>
    </div>
  )
}