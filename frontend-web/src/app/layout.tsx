import { useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  Calendar,
  FileText,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from 'lucide-react'
import { useAuth } from '../features/auth/auth-context'
import { useDoctorNotifications } from '../features/doctor/doctor-shared'
import { usePharmacyNotifications } from '../features/pharmacy/pharmacy-shared'

export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(true)
  const notificationsQuery = useDoctorNotifications()
  const pharmacyNotificationsQuery = usePharmacyNotifications()
  const todayLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date())
  const userLabel =
    user?.role === 'DOCTOR'
      ? 'Dr. User'
      : user?.role === 'PHARMACY'
        ? 'Pharmacy User'
        : user?.role === 'DIAGNOSTIC'
          ? 'Diagnostic User'
          : user?.fullName?.trim() || 'Patient User'
  const userSubtitle =
    user?.role === 'DOCTOR'
      ? 'Doctor'
      : user?.role === 'PHARMACY'
        ? 'Pharmacy'
        : user?.role === 'DIAGNOSTIC'
          ? 'Diagnostic Lab'
          : 'Patient'
  const initials =
    user?.role === 'DOCTOR' ? 'DR' : user?.role === 'PHARMACY' ? 'PH' : user?.role === 'DIAGNOSTIC' ? 'LB' : 'PT'

  const navItems = useMemo<Array<{ label: string; to: string; icon: typeof LayoutDashboard; badge?: number }>>(() => {
    if (!user) return []
    const unreadNotifications =
      user.role === 'DOCTOR' || user.role === 'DIAGNOSTIC'
        ? (notificationsQuery.data ?? []).filter((item) => !item.read).length
        : user.role === 'PHARMACY'
          ? (pharmacyNotificationsQuery.data ?? []).filter((item) => !item.read).length
        : 0

    if (user.role === 'DOCTOR') {
      return [
        { label: 'Dashboard', to: '/doctor', icon: LayoutDashboard },
        { label: 'Appointments', to: '/doctor/appointments', icon: Calendar },
        { label: 'Patients', to: '/doctor/patients', icon: User },
        { label: 'Prescriptions', to: '/doctor/prescriptions', icon: FileText },
        { label: 'Lab Orders', to: '/doctor/lab-orders', icon: FlaskConical },
        { label: 'Notifications', to: '/doctor/notifications', icon: Bell, badge: unreadNotifications },
      ]
    }
    if (user.role === 'PHARMACY') {
      return [
        { label: 'Dashboard', to: '/pharmacy', icon: LayoutDashboard },
        { label: 'Prescriptions', to: '/pharmacy/prescriptions', icon: FileText },
        { label: 'Notifications', to: '/pharmacy/notifications', icon: Bell, badge: unreadNotifications },
      ]
    }
    if (user.role === 'DIAGNOSTIC') {
      return [{ label: 'Dashboard', to: '/diagnostic', icon: LayoutDashboard, badge: unreadNotifications }]
    }
    return [
      { label: 'Dashboard', to: '/patient', icon: LayoutDashboard },
      { label: 'Appointments', to: '/patient/appointments', icon: Calendar },
      { label: 'Records', to: '/patient/records', icon: FileText },
      { label: 'Notifications', to: '/patient/notifications', icon: Bell },
      { label: 'Profile', to: '/patient/profile', icon: User },
    ]
  }, [notificationsQuery.data, pharmacyNotificationsQuery.data, user])

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'open' : 'closed'}`}>
        <div className="sidebar-inner">
          <div className="brand">
            <div className="brand-mark">+</div>
            <div>
              <h2>MedFlow</h2>
              <p>{user?.role === 'DOCTOR' ? 'Doctor Portal' : user?.role === 'DIAGNOSTIC' ? 'Diagnostic Portal' : user?.role === 'PHARMACY' ? 'Pharmacy Portal' : 'Patient Portal'}</p>
            </div>
          </div>

          <nav className="nav">
            {navItems.map((item) => {
              const active =
                location.pathname === item.to ||
                (item.to !== '/doctor' &&
                  item.to !== '/patient' &&
                  item.to !== '/pharmacy' &&
                  location.pathname.startsWith(item.to))
              const Icon = item.icon
              return (
                <Link key={item.label} to={item.to} className={active ? 'active' : ''}>
                  <Icon size={18} />
                  <span className="nav-item-name">{item.label}</span>
                  {item.badge && item.badge > 0 ? <span className="nav-badge">{item.badge}</span> : null}
                </Link>
              )
            })}
          </nav>

          <div className="profile">
            {user?.role === 'PATIENT' ? (
              <Link to="/patient/profile" className="profile-card" aria-label="Open profile">
                <div className="avatar">
                  <span>{initials}</span>
                </div>
                <div>
                  <strong>{userLabel}</strong>
                  <p>{userSubtitle}</p>
                </div>
              </Link>
            ) : (
              <div className="profile-card">
                <div className="avatar">
                  <span>{initials}</span>
                </div>
                <div>
                  <strong>{userLabel}</strong>
                  <p>{userSubtitle}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="main-column">
        <header className="app-header">
          <button type="button" className="icon-btn" onClick={() => setOpen((prev) => !prev)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="header-meta">
            <span>{todayLabel}</span>
            <button
              type="button"
              className="outline-btn"
              onClick={() => {
                logout()
                navigate('/login')
              }}
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  )
}
