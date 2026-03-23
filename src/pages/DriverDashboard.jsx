import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabase'
import MapVisual from '../components/MapVisual'

function JobsSection({ isOnline, onAccept, addToast }) {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch real pending bookings from Supabase
  const fetchJobs = async () => {
    if (!supabase) {
      setJobs([
        { id: 'DEMO1', user_id: 'u1', pickup_address: 'Connaught Place', dropoff_address: 'Noida Sec 18', estimated_fare: 480, reason: 'Fatigue', profiles: { full_name: 'Demo User' } },
      ])
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('bookings')
      .select('*, profiles!bookings_user_id_fkey(full_name, phone)')
      .eq('status', 'pending')
      .order('requested_at', { ascending: false })
    if (!error && data) setJobs(data)
    setLoading(false)
  }

  useEffect(() => {
    if (!isOnline) return
    fetchJobs()

    // Real-time: listen for new pending bookings
    if (!supabase) return
    const channel = supabase
      .channel('pending-bookings')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'bookings',
        filter: 'status=eq.pending',
      }, (payload) => {
        setJobs(prev => [payload.new, ...prev])
        addToast('🔔 New booking request!', 'info')
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'bookings',
      }, (payload) => {
        // Remove from list if no longer pending
        if (payload.new.status !== 'pending') {
          setJobs(prev => prev.filter(j => j.id !== payload.new.id))
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [isOnline])

  if (!isOnline) return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text3)' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💤</div>
      <div className="font-syne" style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text2)' }}>You're Offline</div>
      <div style={{ fontSize: '0.9rem' }}>Toggle the switch above to see booking requests</div>
    </div>
  )

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text2)' }}>Loading jobs...</div>
  )

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <p style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>{jobs.length} booking requests</p>
        <span className="badge badge-success">● Live</span>
      </div>

      {jobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text3)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🕐</div>
          <div className="font-syne" style={{ fontWeight: 700, color: 'var(--text2)', marginBottom: '0.4rem' }}>No requests yet</div>
          <div style={{ fontSize: '0.88rem' }}>New booking requests will appear here in real time</div>
          <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={fetchJobs}>🔄 Refresh</button>
        </div>
      ) : (
        jobs.map(job => (
          <div key={job.id} className="job-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className="font-syne" style={{ fontWeight: 700 }}>
                  {job.profiles?.full_name || 'Passenger'}
                </span>
                {job.reason?.toLowerCase().includes('emergency') && (
                  <span className="badge badge-warning">⚡ Urgent</span>
                )}
              </div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>
                ₹{job.estimated_fare || '—'}
              </div>
            </div>
            <div className="job-route">
              <div className="job-route-item">
                <div className="route-dot" style={{ background: 'var(--accent)' }} />
                <span>{job.pickup_address}</span>
              </div>
              <div className="route-line" />
              <div className="job-route-item">
                <div className="route-dot" style={{ background: 'var(--success)' }} />
                <span>{job.dropoff_address}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {job.reason && <span className="badge badge-info">💡 {job.reason}</span>}
                <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                  {new Date(job.requested_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary" style={{ padding: '0.45rem 0.8rem', fontSize: '0.85rem' }}
                  onClick={() => { setJobs(prev => prev.filter(j => j.id !== job.id)); addToast('Job skipped', 'info') }}>
                  Skip
                </button>
                <button className="btn btn-primary" style={{ padding: '0.45rem 0.8rem', fontSize: '0.85rem' }}
                  onClick={() => onAccept(job)}>
                  Accept →
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function ActiveSection({ job, tripStatus, onStart, onComplete, addToast }) {
  if (!job) return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text3)' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚗</div>
      <div className="font-syne" style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text2)', marginBottom: '0.5rem' }}>No Active Trip</div>
      <div style={{ fontSize: '0.9rem' }}>Accept a job from Available Jobs</div>
    </div>
  )

  return (
    <div className="fade-in">
      <div className="active-trip-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="pulse-dot" />
          <div>
            <div style={{ fontWeight: 600, fontFamily: 'Syne, sans-serif' }}>
              {tripStatus === 'en-route' ? 'En route to pickup' : 'Trip in progress'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>
              Passenger: {job.profiles?.full_name || 'Passenger'}
            </div>
          </div>
        </div>
        <span className={`badge ${tripStatus === 'en-route' ? 'badge-warning' : 'badge-success'}`}>
          {tripStatus === 'en-route' ? '⚡ To Pickup' : '🚗 Active'}
        </span>
      </div>
      <div className="booking-layout" style={{ minHeight: 460 }}>
        <div className="booking-panel">
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-sm)', padding: '1.2rem', marginBottom: '1.2rem' }}>
            <div className="font-syne" style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Route Details</div>
            <div className="job-route">
              <div className="job-route-item">
                <div className="route-dot" style={{ background: 'var(--accent)' }} />
                <div><div style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>Pickup</div><div style={{ fontWeight: 500 }}>{job.pickup_address}</div></div>
              </div>
              <div className="route-line" />
              <div className="job-route-item">
                <div className="route-dot" style={{ background: 'var(--success)' }} />
                <div><div style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>Drop-off</div><div style={{ fontWeight: 500 }}>{job.dropoff_address}</div></div>
              </div>
            </div>
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Earnings</span>
              <span className="font-syne" style={{ fontWeight: 800, color: 'var(--success)', fontSize: '1.3rem' }}>₹{job.estimated_fare || '—'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="btn btn-secondary btn-full" onClick={() => addToast('📞 Calling passenger...', 'info')}>📞 Call Passenger</button>
            {tripStatus === 'en-route' && (
              <button className="btn btn-primary btn-full" onClick={onStart}>🚦 Start Trip</button>
            )}
            {tripStatus === 'trip-started' && (
              <button className="btn btn-success btn-full" onClick={onComplete}>✓ Complete Trip</button>
            )}
          </div>
        </div>
        <MapVisual pickup={job.pickup_address} dropoff={job.dropoff_address} showDriver />
      </div>
    </div>
  )
}

function EarningsSection({ user }) {
  const [trips, setTrips] = useState([])

  useEffect(() => {
    if (!supabase) return
    supabase.from('bookings').select('*').eq('driver_id', user.id).eq('status', 'completed').order('completed_at', { ascending: false }).then(({ data }) => {
      if (data) setTrips(data)
    })
  }, [user.id])

  const total = trips.reduce((s, t) => s + (t.final_fare || t.estimated_fare || 0), 0)

  return (
    <div className="fade-in">
      <div className="stats-grid">
        {[
          ['Total Trips', trips.length, ''],
          ['Total Earned', `₹${total}`, ''],
          ['Avg per Trip', trips.length ? `₹${Math.round(total / trips.length)}` : '₹0', ''],
          ['Rating', '4.9 ★', ''],
        ].map(([l, v]) => (
          <div key={l} className="stat-card">
            <div className="stat-label">{l}</div>
            <div className="stat-value" style={{ fontSize: '1.6rem' }}>{v}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 className="font-syne" style={{ fontWeight: 700, marginBottom: '1.2rem' }}>Completed Trips</h3>
        {trips.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)' }}>No completed trips yet</div>
        ) : (
          <table className="trips-table">
            <thead><tr><th>Date</th><th>Route</th><th>Earned</th></tr></thead>
            <tbody>
              {trips.map(t => (
                <tr key={t.id}>
                  <td style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>{new Date(t.completed_at || t.requested_at).toLocaleDateString()}</td>
                  <td>
                    <div style={{ fontSize: '0.9rem' }}>{t.pickup_address}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>→ {t.dropoff_address}</div>
                  </td>
                  <td className="font-syne" style={{ fontWeight: 700, color: 'var(--success)' }}>₹{t.final_fare || t.estimated_fare || '—'}</td>
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
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ vehicle_make: '', vehicle_model: '', vehicle_color: '', vehicle_plate: '' })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  useEffect(() => {
    if (!supabase) return
    supabase.from('drivers').select('*').eq('id', user.id).single().then(({ data }) => {
      if (data) setForm({ vehicle_make: data.vehicle_make || '', vehicle_model: data.vehicle_model || '', vehicle_color: data.vehicle_color || '', vehicle_plate: data.vehicle_plate || '' })
    })
  }, [user.id])

  const handleSave = async () => {
    setSaving(true)
    if (supabase) {
      await supabase.from('drivers').update(form).eq('id', user.id)
    }
    await new Promise(r => setTimeout(r, 500))
    setSaving(false)
    addToast('Profile saved!', 'success')
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="profile-avatar-lg">{(user.name || 'D').charAt(0).toUpperCase()}</div>
        <div>
          <div className="font-syne" style={{ fontSize: '1.3rem', fontWeight: 700 }}>{user.name || 'Driver'}</div>
          <div style={{ color: 'var(--text2)' }}>{user.email}</div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
            <span className="badge badge-success">✓ Verified</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h3 className="font-syne" style={{ fontWeight: 700, marginBottom: '1.2rem' }}>Personal Info</h3>
          <div className="input-group"><label className="input-label">Full Name</label><input className="input" defaultValue={user.name || ''} /></div>
          <div className="input-group"><label className="input-label">Email</label><input className="input" value={user.email || ''} disabled style={{ opacity: 0.6 }} /></div>
          <button className="btn btn-primary" onClick={() => addToast('Saved!', 'success')}>Save</button>
        </div>
        <div className="card">
          <h3 className="font-syne" style={{ fontWeight: 700, marginBottom: '1.2rem' }}>Vehicle Details</h3>
          <div className="input-group"><label className="input-label">Make</label><input className="input" value={form.vehicle_make} onChange={e => set('vehicle_make', e.target.value)} placeholder="Honda" /></div>
          <div className="input-group"><label className="input-label">Model</label><input className="input" value={form.vehicle_model} onChange={e => set('vehicle_model', e.target.value)} placeholder="City" /></div>
          <div className="input-group"><label className="input-label">Color</label><input className="input" value={form.vehicle_color} onChange={e => set('vehicle_color', e.target.value)} placeholder="White" /></div>
          <div className="input-group"><label className="input-label">License Plate</label><input className="input" value={form.vehicle_plate} onChange={e => set('vehicle_plate', e.target.value)} placeholder="DL 01 AB 1234" /></div>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Vehicle'}</button>
        </div>
      </div>
    </div>
  )
}

const SIDEBAR = [
  { id: 'jobs', icon: '📋', label: 'Available Jobs' },
  { id: 'active', icon: '🚗', label: 'Active Trip' },
  { id: 'earnings', icon: '💰', label: 'Earnings' },
  { id: 'profile', icon: '👤', label: 'Profile' },
]

export default function DriverDashboard() {
  const { user, addToast } = useApp()
  const [section, setSection] = useState('jobs')
  const [isOnline, setIsOnline] = useState(false)
  const [acceptedJob, setAcceptedJob] = useState(null)
  const [tripStatus, setTripStatus] = useState(null)

  const handleToggle = async (v) => {
    setIsOnline(v)
    if (supabase) {
      await supabase.from('drivers').update({ is_available: v }).eq('id', user.id)
    }
    addToast(v ? '🟢 You are now online' : '⭕ You are now offline', v ? 'success' : 'info')
  }

  const handleAccept = async (job) => {
    // Update booking status to accepted in Supabase
    if (supabase) {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'accepted', driver_id: user.id, accepted_at: new Date().toISOString() })
        .eq('id', job.id)
      if (error) { addToast('Failed to accept booking', 'error'); return }
    }
    setAcceptedJob(job)
    setTripStatus('en-route')
    addToast(`Job accepted! Head to ${job.pickup_address}`, 'success')
    setSection('active')
  }

  const handleStartTrip = async () => {
    if (supabase && acceptedJob) {
      await supabase.from('bookings').update({ status: 'in_progress', started_at: new Date().toISOString() }).eq('id', acceptedJob.id)
    }
    setTripStatus('trip-started')
    addToast('Trip started! Drive safely 🚗', 'success')
  }

  const handleCompleteTrip = async () => {
    if (supabase && acceptedJob) {
      await supabase.from('bookings').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', acceptedJob.id)
      // Increment driver total_trips
      await supabase.rpc('increment_trips', { driver_id: user.id }).catch(() => {})
    }
    addToast(`Trip completed! ₹${acceptedJob.estimated_fare} added to earnings 💰`, 'success')
    setAcceptedJob(null); setTripStatus(null); setSection('jobs')
  }

  const titles = {
    jobs: ['Available Jobs', 'Live booking requests from passengers'],
    active: ['Active Trip', 'Manage your current trip'],
    earnings: ['Earnings', 'Your income summary'],
    profile: ['Driver Profile', 'Manage your account & vehicle'],
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-section">Driver</div>
        {SIDEBAR.map(item => (
          <button key={item.id} className={`sidebar-item ${section === item.id ? 'active' : ''}`} onClick={() => setSection(item.id)}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
            {item.id === 'active' && acceptedJob && (
              <span style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: 'var(--warning)', flexShrink: 0 }} />
            )}
          </button>
        ))}
      </aside>
      <main className="main-content">
        {/* Online toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.9rem 1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: isOnline ? 'var(--success)' : 'var(--text3)', boxShadow: isOnline ? '0 0 8px var(--success)' : 'none' }} />
            <span style={{ fontWeight: 500 }}>{isOnline ? 'Online – Accepting Rides' : 'Offline'}</span>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={isOnline} onChange={e => handleToggle(e.target.checked)} />
            <span className="toggle-slider" />
          </label>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 className="font-syne" style={{ fontSize: '1.6rem', fontWeight: 800 }}>{titles[section][0]}</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>{titles[section][1]}</p>
        </div>
        {section === 'jobs' && <JobsSection isOnline={isOnline} onAccept={handleAccept} addToast={addToast} />}
        {section === 'active' && <ActiveSection job={acceptedJob} tripStatus={tripStatus} onStart={handleStartTrip} onComplete={handleCompleteTrip} addToast={addToast} />}
        {section === 'earnings' && <EarningsSection user={user} />}
        {section === 'profile' && <ProfileSection user={user} addToast={addToast} />}
      </main>
    </div>
  )
}