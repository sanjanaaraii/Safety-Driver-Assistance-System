import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { supabase, isDemoMode } from '../lib/supabase'

const ROLES = [
  { value: 'user', icon: '🙋', label: 'Passenger', desc: 'Book a driver for my car' },
  { value: 'driver', icon: '🚗', label: 'Driver', desc: 'Earn by driving others' },
]

export default function AuthPage({ defaultTab = 'login' }) {
  const { login, addToast } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState(defaultTab)
  const [role, setRole] = useState('user')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', license: '' })

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async () => {
    if (!form.email || !form.password) { addToast('Please fill in all required fields', 'error'); return }
    setLoading(true)
    try {
      if (supabase && !isDemoMode) {
        if (tab === 'signup') {
          const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password })
          if (error) throw error
          await supabase.from('profiles').insert({ id: data.user.id, full_name: form.name, phone: form.phone, role })
          if (role === 'driver') {
            await supabase.from('drivers').insert({ id: data.user.id, license_number: form.license })
          }
          login({ id: data.user.id, name: form.name, email: form.email, role })
          addToast('Account created! Welcome to SDAC.', 'success')
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
          if (error) throw error
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
          login({ id: data.user.id, name: profile?.full_name, email: form.email, role: profile?.role })
          addToast(`Welcome back, ${profile?.full_name?.split(' ')[0] || 'there'}!`, 'success')
          navigate(profile?.role === 'driver' ? '/driver' : '/dashboard')
          return
        }
      } else {
        // Demo mode
        await new Promise(r => setTimeout(r, 700))
        const mockUser = { id: 'demo-' + Date.now(), name: form.name || 'Demo User', email: form.email, role }
        login(mockUser)
        addToast(tab === 'signup' ? 'Account created! (Demo mode)' : 'Signed in! (Demo mode)', 'success')
      }
      navigate(role === 'driver' ? '/driver' : '/dashboard')
    } catch (e) {
      addToast(e.message || 'Authentication failed', 'error')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div className="logo" style={{ fontSize: '1.5rem' }}>SDAC<span style={{ color: 'var(--accent2)' }}>.</span></div>
        </div>

        <div className="auth-tabs">
          {[['login', 'Sign In'], ['signup', 'Create Account']].map(([t, l]) => (
            <button key={t} className={`auth-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{l}</button>
          ))}
        </div>

        {tab === 'signup' && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <div className="input-label" style={{ marginBottom: '0.75rem' }}>I want to join as:</div>
              <div className="role-selector">
                {ROLES.map(({ value, icon, label, desc }) => (
                  <div key={value} className={`role-option ${role === value ? 'selected' : ''}`} onClick={() => setRole(value)}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>{icon}</div>
                    <div className="font-syne" style={{ fontWeight: 700, fontSize: '0.9rem' }}>{label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Full Name *</label>
              <input className="input" placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Phone Number</label>
              <input className="input" placeholder="+91 98xxx xxxxx" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            {role === 'driver' && (
              <div className="input-group">
                <label className="input-label">Driving License Number *</label>
                <input className="input" placeholder="DL-xxxxxxxxxx" value={form.license} onChange={e => set('license', e.target.value)} />
              </div>
            )}
          </>
        )}

        <div className="input-group">
          <label className="input-label">Email Address *</label>
          <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label">Password *</label>
          <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>

        {isDemoMode && (
          <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, padding: '0.75rem', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--warning)' }}>
            ⚠️ Running in demo mode — add Supabase credentials in <code>.env</code> for full auth.
          </div>
        )}

        <button className="btn btn-primary btn-full" style={{ marginTop: '0.5rem' }} onClick={handleSubmit} disabled={loading}>
          {loading ? '⏳ Please wait...' : tab === 'signup' ? '🚀 Create Account' : '→ Sign In'}
        </button>

        <div className="divider">{tab === 'login' ? 'New to SDAC?' : 'Already have an account?'}</div>
        <button className="btn btn-secondary btn-full" onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}>
          {tab === 'login' ? 'Create an Account' : 'Sign In Instead'}
        </button>
      </div>
    </div>
  )
}
