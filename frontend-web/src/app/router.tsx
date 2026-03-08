import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './layout'
import { LoginPage } from '../features/auth/login-page'
import { RegisterPage } from '../features/auth/register-page'
import { RequireAuth, RequireRole } from '../features/auth/route-guards'
import { DoctorHome } from '../features/doctor/doctor-home'
import { DoctorAppointmentsPage } from '../features/doctor/doctor-appointments'
import { DoctorPatientsPage } from '../features/doctor/doctor-patients'
import { DoctorPrescriptionsPage } from '../features/doctor/doctor-prescriptions'
import { DoctorLabOrdersPage } from '../features/doctor/doctor-lab-orders'
import { DoctorNotificationsPage } from '../features/doctor/doctor-notifications'
import { DoctorPatientProfilePage } from '../features/doctor/doctor-patient-profile'
import { DoctorAppointmentDetailsPage } from '../features/doctor/doctor-appointment-details'
import { PatientAppointmentsPage } from '../features/patient/patient-appointments'
import { PatientNotificationsPage } from '../features/patient/patient-notifications'
import { PatientProfilePage } from '../features/patient/patient-profile'
import { PatientRecordsPage } from '../features/patient/patient-records'
import { PharmacyHome } from '../features/pharmacy/pharmacy-home'
import { PharmacyPrescriptionsPage } from '../features/pharmacy/pharmacy-prescriptions'
import { PharmacyNotificationsPage } from '../features/pharmacy/pharmacy-notifications'
import { DiagnosticHome } from '../features/diagnostic/diagnostic-home'
import { useAuth } from '../features/auth/auth-context'

function RoleHomeRedirect() {
  const { user, loading } = useAuth()
  if (loading || !user) return <p className="state">Loading user session...</p>
  if (user.role === 'DOCTOR') return <Navigate to="/doctor" replace />
  if (user.role === 'PATIENT') return <Navigate to="/patient" replace />
  if (user.role === 'PHARMACY') return <Navigate to="/pharmacy" replace />
  if (user.role === 'DIAGNOSTIC') return <Navigate to="/diagnostic" replace />
  return <Navigate to="/login" replace />
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
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
                element: <PatientAppointmentsPage />,
              },
              {
                path: '/patient/appointments',
                element: <PatientAppointmentsPage />,
              },
              {
                path: '/patient/notifications',
                element: <PatientNotificationsPage />,
              },
              {
                path: '/patient/records',
                element: <PatientRecordsPage />,
              },
              {
                path: '/patient/profile',
                element: <PatientProfilePage />,
              },
            ],
          },
          {
            element: <RequireRole roles={['DOCTOR']} />,
            children: [
              {
                path: '/doctor',
                element: <DoctorHome />,
              },
              {
                path: '/doctor/appointments',
                element: <DoctorAppointmentsPage />,
              },
              {
                path: '/doctor/appointments/:appointmentId',
                element: <DoctorAppointmentDetailsPage />,
              },
              {
                path: '/doctor/patients',
                element: <DoctorPatientsPage />,
              },
              {
                path: '/doctor/patients/:patientId/profile',
                element: <DoctorPatientProfilePage />,
              },
              {
                path: '/doctor/prescriptions',
                element: <DoctorPrescriptionsPage />,
              },
              {
                path: '/doctor/lab-orders',
                element: <DoctorLabOrdersPage />,
              },
              {
                path: '/doctor/notifications',
                element: <DoctorNotificationsPage />,
              },
            ],
          },
          {
            element: <RequireRole roles={['PHARMACY']} />,
            children: [
              {
                path: '/pharmacy',
                element: <PharmacyHome />,
              },
              {
                path: '/pharmacy/prescriptions',
                element: <PharmacyPrescriptionsPage />,
              },
              {
                path: '/pharmacy/notifications',
                element: <PharmacyNotificationsPage />,
              },
            ],
          },
          {
            element: <RequireRole roles={['DIAGNOSTIC']} />,
            children: [
              {
                path: '/diagnostic',
                element: <DiagnosticHome />,
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
