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
import { PatientDashboard } from '../features/patient/patient-dashboard'

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
            element: <Navigate to="/patient" replace />,
          },
          {
            element: <RequireRole roles={['PATIENT']} />,
            children: [
              {
                path: '/patient',
                element: <PatientDashboard />,
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
                path: '/doctor/patients',
                element: <DoctorPatientsPage />,
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
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
])
