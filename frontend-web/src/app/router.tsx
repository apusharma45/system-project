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
import { DoctorProfilePage } from '../features/doctor/doctor-profile'
import { PatientAppointmentsPage } from '../features/patient/patient-appointments'
import { PatientAppointmentDetailsPage } from '../features/patient/patient-appointment-details'
import { PatientDoctorDetailsPage } from '../features/patient/patient-doctor-details'
import { PatientNotificationsPage } from '../features/patient/patient-notifications'
import { PatientProfilePage } from '../features/patient/patient-profile'
import { PatientRecordsPage } from '../features/patient/patient-records'
import { PharmacyHome } from '../features/pharmacy/pharmacy-home'
import { PharmacyPrescriptionsPage } from '../features/pharmacy/pharmacy-prescriptions'
import { PharmacyNotificationsPage } from '../features/pharmacy/pharmacy-notifications'
import { PharmacyPrescriptionDetailsPage } from '../features/pharmacy/pharmacy-prescription-details'
import { PharmacyProfilePage } from '../features/pharmacy/pharmacy-profile'
import { DiagnosticHome } from '../features/diagnostic/diagnostic-home'
import { DiagnosticLabOrdersPage } from '../features/diagnostic/diagnostic-lab-orders'
import { DiagnosticLabOrderDetailsPage } from '../features/diagnostic/diagnostic-lab-order-details'
import { DiagnosticNotificationsPage } from '../features/diagnostic/diagnostic-notifications'
import { DiagnosticProfilePage } from '../features/diagnostic/diagnostic-profile'
import {
  AdminAuditPage,
  AdminDiagnosticsPage,
  AdminDoctorsPage,
  AdminPharmaciesPage,
  AdminIntegrationsPage,
  AdminLayout,
  AdminNotificationsPage,
  AdminOverviewPage,
  AdminProfilePage,
  AdminUsersPage,
} from '../features/admin/admin-ui'
import { useAuth } from '../features/auth/auth-context'

function RoleHomeRedirect() {
  const { user, loading } = useAuth()
  if (loading || !user) return <p className="state">Loading user session...</p>
  if (user.role === 'DOCTOR') return <Navigate to="/doctor" replace />
  if (user.role === 'PATIENT') return <Navigate to="/patient" replace />
  if (user.role === 'PHARMACY') return <Navigate to="/pharmacy" replace />
  if (user.role === 'DIAGNOSTIC') return <Navigate to="/diagnostic" replace />
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />
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
                path: '/patient/appointments/:appointmentId',
                element: <PatientAppointmentDetailsPage />,
              },
              {
                path: '/patient/doctors/:doctorId',
                element: <PatientDoctorDetailsPage />,
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
              {
                path: '/doctor/profile',
                element: <DoctorProfilePage />,
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
                path: '/pharmacy/prescriptions/:prescriptionId',
                element: <PharmacyPrescriptionDetailsPage />,
              },
              {
                path: '/pharmacy/notifications',
                element: <PharmacyNotificationsPage />,
              },
              {
                path: '/pharmacy/profile',
                element: <PharmacyProfilePage />,
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
              {
                path: '/diagnostic/lab-orders',
                element: <DiagnosticLabOrdersPage />,
              },
              {
                path: '/diagnostic/lab-orders/:orderId',
                element: <DiagnosticLabOrderDetailsPage />,
              },
              {
                path: '/diagnostic/notifications',
                element: <DiagnosticNotificationsPage />,
              },
              {
                path: '/diagnostic/profile',
                element: <DiagnosticProfilePage />,
              },
            ],
          },
        ],
      },
      {
        element: <RequireRole roles={['ADMIN']} />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                path: '/admin',
                element: <AdminOverviewPage />,
              },
              {
                path: '/admin/users',
                element: <AdminUsersPage />,
              },
              {
                path: '/admin/doctors',
                element: <AdminDoctorsPage />,
              },
              {
                path: '/admin/pharmacies',
                element: <AdminPharmaciesPage />,
              },
              {
                path: '/admin/diagnostics',
                element: <AdminDiagnosticsPage />,
              },
              {
                path: '/admin/notifications',
                element: <AdminNotificationsPage />,
              },
              {
                path: '/admin/audit',
                element: <AdminAuditPage />,
              },
              {
                path: '/admin/integrations',
                element: <AdminIntegrationsPage />,
              },
              {
                path: '/admin/profile',
                element: <AdminProfilePage />,
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
