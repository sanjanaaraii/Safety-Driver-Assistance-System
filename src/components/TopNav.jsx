import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function TopNav() {
  const { user, logout } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="topnav">
      <div className="logo" onClick={() => navigate('/')}>
        SDAC<span>.</span>
      </div>
      <div className="nav-links">
        {!user ? (
          <>
            <button className="nav-btn nav-btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
            <button className="nav-btn nav-btn-primary" onClick={() => navigate('/signup')}>Get Started</button>
          </>
        ) : (
          <>
            <span style={{ color: 'var(--text2)', fontSize: '0.85rem', marginRight: '0.5rem' }}>
              {user.name?.split(' ')[0]}
            </span>
            <button
              className="nav-btn nav-btn-ghost"
              onClick={() => navigate(user.role === 'driver' ? '/driver' : '/dashboard')}
            >
              {user.role === 'driver' ? '🚗 Driver Hub' : '🗺 Book Driver'}
            </button>
            <button className="nav-btn nav-btn-ghost" onClick={handleLogout}>Sign Out</button>
          </>
        )}
      </div>
    </nav>
  )
}
