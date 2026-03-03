import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './auth-context'
import type { Role } from '../../types'

function homeByRole(role: Role) {
  if (role === 'DOCTOR') return '/doctor'
  if (role === 'PATIENT') return '/patient'
  return '/login'
}

export function RequireAuth() {
  const { user, loading } = useAuth()
  if (loading) {
    return <p className="state">Loading user session...</p>
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

export function RequireRole({ roles }: { roles: Role[] }) {
  const { user, loading } = useAuth()
  if (loading) {
    return <p className="state">Loading user session...</p>
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (!roles.includes(user.role)) {
    const home = homeByRole(user.role)
    if (home === '/login') {
      return (
        <div className="state">
          <p>This web dashboard currently supports only PATIENT and DOCTOR roles.</p>
        </div>
      )
    }
    return <Navigate to={home} replace />
  }
  return <Outlet />
}
