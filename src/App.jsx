import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import TopNav from './components/TopNav'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import UserDashboard from './pages/UserDashboard'
import DriverDashboard from './pages/DriverDashboard'
import "leaflet/dist/leaflet.css";
function ProtectedRoute({ children, requiredRole }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/login" replace />
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'driver' ? '/driver' : '/dashboard'} replace />
  }
  return children
}

function AppRoutes() {
  return (
    <div className="app-shell">
      <TopNav />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage defaultTab="login" />} />
        <Route path="/signup" element={<AuthPage defaultTab="signup" />} />
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="user"><UserDashboard /></ProtectedRoute>
        } />
        <Route path="/driver" element={
          <ProtectedRoute requiredRole="driver"><DriverDashboard /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  )
}
