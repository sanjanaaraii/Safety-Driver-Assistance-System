import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabase'
import { MOCK_JOBS_DRIVER } from '../lib/mockData'
import MapVisual from '../components/MapVisual'

function JobsSection({ isOnline, onAccept, addToast }) {
  if (!isOnline) return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text3)' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💤</div>
      <div className="font-syne" style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text2)' }}>You're Offline</div>
      <div style={{ fontSize: '0.9rem' }}>Toggle the switch above to start receiving job requests</div>
    </div>
  )

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <p style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>{MOCK_JOBS_DRIVER.length} ride requests near you</p>
        <span className="badge badge-success">● Live</span>
      </div>
      {MOCK_JOBS_DRIVER.map(job => (
        <div key={job.id} className={`job-card ${job.urgent ? 'urgent' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className="font-syne" style={{ fontWeight: 700 }}>{job.user}</span>
              {job.urgent && <span className="badge badge-warning">⚡ Urgent</span>}
            </div>
            <div className="earning-highlight">{job.fare}</div>
          </div>
          <div className="job-route">
            <div className="job-route-item"><div className="route-dot" style={{ background: 'var(--accent)' }} /><span>{job.pickup}</span></div>
            <div className="route-line" />
            <div className="job-route-item"><div className="route-dot" style={{ background: 'var(--success)' }} /><span>{job.drop}</span></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge badge-neutral">📏 {job.dist}</span>
              <span className="badge badge-info">💡 {job.reason}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary" style={{ padding: '0.45rem 0.8rem', fontSize: '0.85rem' }} onClick={() => addToast('Job skipped', 'info')}>Skip</button>
              <button className="btn btn-primary" style={{ padding: '0.45rem 0.8rem', fontSize: '0.85rem' }} onClick={() => onAccept(job)}>Accept →</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ActiveSection({ job, tripStatus, onStart, onComplete, addToast }) {
  if (!job) return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text3)' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚗</div>
      <div className="font-syne" style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text2)', marginBottom: '0.5rem' }}>No Active Trip</div>
      <div style={{ fontSize: '0.9rem' }}>Accept a job from the Available Jobs tab</div>
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
            <div style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>Passenger: {job.user}</div>
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
                <div><div style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>Pickup</div><div style={{ fontWeight: 500 }}>{job.pickup}</div></div>
              </div>
              <div className="route-line" />
              <div className="job-route-item">
                <div className="route-dot" style={{ background: 'var(--success)' }} />
                <div><div style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>Drop-off</div><div style={{ fontWeight: 500 }}>{job.drop}</div></div>
              </div>
            </div>
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Your Earnings</span>
              <span className="font-syne" style={{ fontWeight: 800, color: 'var(--success)', fontSize: '1.3rem' }}>{job.fare}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="btn btn-secondary btn-full" onClick={() => addToast('📞 Calling passenger...', 'info')}>📞 Call Passenger</button>
            {tripStatus === 'en-route' && <button className="btn btn-primary btn-full" onClick={onStart}>🚦 Start Trip</button>}
            {tripStatus === 'trip-started' && <button className="btn btn-success btn-full" onClick={onComplete}>✓ Complete Trip</button>}
          </div>
        </div>
        <MapVisual pickup={job.pickup} dropoff={job.drop} showDriver />
      </div>
    </div>
  )
}

function EarningsSection() {
  return (
    <div className="fade-in">
      <div className="stats-grid">
        {[['Today', '₹1,240', '3 trips'], ['This Week', '₹8,650', '22 trips'], ['This Month', '₹34,200', '89 trips'], ['Rating', '4.9 ★', 'Excellent']].map(([l, v, c]) => (
          <div key={l} className="stat-card">
            <div className="stat-label">{l}</div>
            <div className="stat-value" style={{ fontSize: '1.6rem' }}>{v}</div>
            <div className="stat-change stat-up">{c}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h3 className="font-syne" style={{ fontWeight: 700 }}>Recent Payouts</h3>
          <span className="badge badge-success">✓ All Settled</span>
        </div>
        <table className="trips-table">
          <thead><tr><th>Date</th><th>Route</th><th>Duration</th><th>Earned</th></tr></thead>
          <tbody>
            {[['Mar 22', 'Hauz Khas → Noida', '48 min', '₹480'], ['Mar 22', 'Rohini → CP', '35 min', '₹380'], ['Mar 21', 'GK → Airport', '42 min', '₹640'], ['Mar 21', 'Dwarka → Gurugram', '55 min', '₹550']].map(([d, r, t, e]) => (
              <tr key={d + r}>
                <td style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>{d}</td>
                <td style={{ fontSize: '0.9rem' }}>{r}</td>
                <td style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>{t}</td>
                <td className="font-syne" style={{ fontWeight: 700, color: 'var(--success)' }}>{e}</td>
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
        <div className="profile-avatar-lg">{(user.name || 'D').charAt(0).toUpperCase()}</div>
        <div>
          <div className="font-syne" style={{ fontSize: '1.3rem', fontWeight: 700 }}>{user.name || 'Demo Driver'}</div>
          <div style={{ color: 'var(--text2)' }}>{user.email}</div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
            <span className="badge badge-success">✓ Verified</span>
            <span className="badge badge-warning">★ 4.9</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h3 className="font-syne" style={{ fontWeight: 700, marginBottom: '1.2rem' }}>Personal Info</h3>
          <div className="input-group"><label className="input-label">Full Name</label><input className="input" defaultValue={user.name || ''} /></div>
          <div className="input-group"><label className="input-label">Phone</label><input className="input" placeholder="+91 xxxxx xxxxx" /></div>
          <div className="input-group"><label className="input-label">License Number</label><input className="input" placeholder="DL-xxxxxxxxxx" /></div>
          <button className="btn btn-primary" onClick={() => addToast('Profile updated!', 'success')}>Save Changes</button>
        </div>
        <div className="card">
          <h3 className="font-syne" style={{ fontWeight: 700, marginBottom: '1.2rem' }}>Vehicle Details</h3>
          <div className="input-group"><label className="input-label">Make</label><input className="input" placeholder="e.g. Honda" /></div>
          <div className="input-group"><label className="input-label">Model</label><input className="input" placeholder="e.g. City" /></div>
          <div className="input-group"><label className="input-label">Color</label><input className="input" placeholder="e.g. White" /></div>
          <div className="input-group"><label className="input-label">License Plate</label><input className="input" placeholder="DL 01 AB 1234" /></div>
          <button className="btn btn-primary" onClick={() => addToast('Vehicle saved!', 'success')}>Save Vehicle</button>
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

const SECTION_META = {
  jobs: ['Available Jobs', 'Live ride requests near you'],
  active: ['Active Trip', 'Manage your current trip'],
  earnings: ['Earnings Overview', 'Your income at a glance'],
  profile: ['Driver Profile', 'Manage your account & vehicle'],
}

export default function DriverDashboard() {
  const { user, addToast } = useApp()
  const [section, setSection] = useState('jobs')
  const [isOnline, setIsOnline] = useState(false)
  const [acceptedJob, setAcceptedJob] = useState(null)
  const [tripStatus, setTripStatus] = useState(null)

  const handleToggle = async (v) => {
    setIsOnline(v)
    if (supabase) await supabase.from('drivers').update({ is_available: v }).eq('id', user.id)
    addToast(v ? '🟢 You are now online' : '⭕ You are now offline', v ? 'success' : 'info')
  }

  const handleAccept = (job) => {
    setAcceptedJob(job); setTripStatus('en-route')
    addToast(`Job accepted! Head to ${job.pickup}`, 'success')
    setSection('active')
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-section">Driver</div>
        {SIDEBAR.map(item => (
          <button key={item.id} className={`sidebar-item ${section === item.id ? 'active' : ''}`} onClick={() => setSection(item.id)}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
            {item.id === 'active' && acceptedJob && <span style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: 'var(--warning)', flexShrink: 0 }} />}
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
          <h1 className="font-syne" style={{ fontSize: '1.6rem', fontWeight: 800 }}>{SECTION_META[section][0]}</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>{SECTION_META[section][1]}</p>
        </div>

        {section === 'jobs' && <JobsSection isOnline={isOnline} onAccept={handleAccept} addToast={addToast} />}
        {section === 'active' && <ActiveSection job={acceptedJob} tripStatus={tripStatus} onStart={() => { setTripStatus('trip-started'); addToast('Trip started! Drive safely 🚗', 'success') }} onComplete={() => { addToast(`Trip completed! ${acceptedJob.fare} added to earnings 💰`, 'success'); setAcceptedJob(null); setTripStatus(null); setSection('jobs') }} addToast={addToast} />}
        {section === 'earnings' && <EarningsSection />}
        {section === 'profile' && <ProfileSection user={user} addToast={addToast} />}
      </main>
    </div>
  )
}
