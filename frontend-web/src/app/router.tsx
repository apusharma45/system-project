import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './layout'
import { RequireAuth, RequireRole } from '../features/auth/route-guards'
import { useAuth } from '../features/auth/auth-context'

const LoginPage = lazy(() => import('../features/auth/login-page').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() =>
  import('../features/auth/register-page').then((m) => ({ default: m.RegisterPage })),
)
const PatientDashboard = lazy(() =>
  import('../features/patient/patient-dashboard').then((m) => ({ default: m.PatientDashboard })),
)
const DoctorHome = lazy(() =>
  import('../features/doctor/doctor-home').then((m) => ({ default: m.DoctorHome })),
)
const DoctorAppointmentsPage = lazy(() =>
  import('../features/doctor/doctor-appointments').then((m) => ({ default: m.DoctorAppointmentsPage })),
)
const DoctorPatientsPage = lazy(() =>
  import('../features/doctor/doctor-patients').then((m) => ({ default: m.DoctorPatientsPage })),
)
const DoctorPrescriptionsPage = lazy(() =>
  import('../features/doctor/doctor-prescriptions').then((m) => ({ default: m.DoctorPrescriptionsPage })),
)
const DoctorLabOrdersPage = lazy(() =>
  import('../features/doctor/doctor-lab-orders').then((m) => ({ default: m.DoctorLabOrdersPage })),
)
const DoctorNotificationsPage = lazy(() =>
  import('../features/doctor/doctor-notifications').then((m) => ({ default: m.DoctorNotificationsPage })),
)
const DiagnosticHome = lazy(() =>
  import('../features/diagnostic/diagnostic-home').then((m) => ({ default: m.DiagnosticHome })),
)
const DiagnosticLabOrdersPage = lazy(() =>
  import('../features/diagnostic/diagnostic-lab-orders').then((m) => ({ default: m.DiagnosticLabOrdersPage })),
)
const DiagnosticNotificationsPage = lazy(() =>
  import('../features/diagnostic/diagnostic-notifications').then((m) => ({ default: m.DiagnosticNotificationsPage })),
)

function withLazyBoundary(node: ReactNode) {
  return <Suspense fallback={<p className="state">Loading module...</p>}>{node}</Suspense>
}

function RoleHomeRedirect() {
  const { user, loading } = useAuth()
  if (loading || !user) return <p className="state">Loading user session...</p>
  if (user.role === 'DOCTOR') return <Navigate to="/doctor" replace />
  if (user.role === 'PATIENT') return <Navigate to="/patient" replace />
  if (user.role === 'DIAGNOSTIC') return <Navigate to="/diagnostic" replace />
  return <Navigate to="/login" replace />
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: withLazyBoundary(<LoginPage />),
  },
  {
    path: '/register',
    element: withLazyBoundary(<RegisterPage />),
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/',
            element: <RoleHomeRedirect />,
          },
          {
            element: <RequireRole roles={['PATIENT']} />,
            children: [
              {
                path: '/patient',
                element: withLazyBoundary(<PatientDashboard />),
              },
            ],
          },
          {
            element: <RequireRole roles={['DOCTOR']} />,
            children: [
              {
                path: '/doctor',
                element: withLazyBoundary(<DoctorHome />),
              },
              {
                path: '/doctor/appointments',
                element: withLazyBoundary(<DoctorAppointmentsPage />),
              },
              {
                path: '/doctor/patients',
                element: withLazyBoundary(<DoctorPatientsPage />),
              },
              {
                path: '/doctor/prescriptions',
                element: withLazyBoundary(<DoctorPrescriptionsPage />),
              },
              {
                path: '/doctor/lab-orders',
                element: withLazyBoundary(<DoctorLabOrdersPage />),
              },
              {
                path: '/doctor/notifications',
                element: withLazyBoundary(<DoctorNotificationsPage />),
              },
            ],
          },
          {
            element: <RequireRole roles={['DIAGNOSTIC']} />,
            children: [
              {
                path: '/diagnostic',
                element: withLazyBoundary(<DiagnosticHome />),
              },
              {
                path: '/diagnostic/lab-orders',
                element: withLazyBoundary(<DiagnosticLabOrdersPage />),
              },
              {
                path: '/diagnostic/notifications',
                element: withLazyBoundary(<DiagnosticNotificationsPage />),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
])
