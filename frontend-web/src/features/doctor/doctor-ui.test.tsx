import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AppLayout } from '../../app/layout'
import { DoctorAppointmentsPage } from './doctor-appointments'
import { DoctorHome } from './doctor-home'
import { DoctorLabOrdersPage } from './doctor-lab-orders'
import { DoctorNotificationsPage } from './doctor-notifications'
import { DoctorPatientsPage } from './doctor-patients'
import { DoctorPrescriptionsPage } from './doctor-prescriptions'

const authState = {
  user: { role: 'DOCTOR' as const },
  loading: false,
  token: null,
  logout: vi.fn(),
  login: vi.fn(),
  refreshUser: vi.fn(),
}

const doctorData = {
  appointments: [
    {
      id: 'apt-1',
      patientId: 'patient-1',
      doctorId: 'doctor-1',
      status: 'CONFIRMED' as const,
      scheduledAt: '2026-02-28T09:00:00.000Z',
      requiresLab: true,
      labFlowLocked: false,
    },
    {
      id: 'apt-2',
      patientId: 'patient-2',
      doctorId: 'doctor-1',
      status: 'EXAM_DONE' as const,
      scheduledAt: '2026-02-27T09:00:00.000Z',
      requiresLab: false,
      labFlowLocked: false,
    },
  ],
  prescriptions: [
    {
      id: 'rx-1',
      appointmentId: 'apt-2',
      doctorId: 'doctor-1',
      pharmacyId: 'pharmacy-1',
      notes: 'Take once daily',
      status: 'DRAFT' as const,
      appointment: { patientId: 'patient-2' },
    },
  ],
  labs: [
    {
      id: 'lab-1',
      appointmentId: 'apt-1',
      diagnosticId: 'diag-1',
      status: 'CREATED' as const,
      appointment: { patientId: 'patient-1' },
      labResult: null,
    },
  ],
  notifications: [
    {
      id: 'n-1',
      userId: 'doctor-1',
      type: 'APPOINTMENT_CALLED' as const,
      message: 'Patient called in',
      read: false,
      createdAt: '2026-02-28T10:00:00.000Z',
    },
  ],
  diagnostics: [{ id: 'diag-1', email: 'diag@test.com', role: 'DIAGNOSTIC' as const }],
  pharmacies: [{ id: 'pharmacy-1', email: 'pharm@test.com', role: 'PHARMACY' as const }],
}

vi.mock('../auth/auth-context', () => ({
  useAuth: () => authState,
}))

vi.mock('./doctor-shared', () => ({
  useDoctorAppointments: () => ({ data: doctorData.appointments }),
  useDoctorPrescriptions: () => ({ data: doctorData.prescriptions }),
  useDoctorLabOrders: () => ({ data: doctorData.labs }),
  useDoctorNotifications: () => ({ data: doctorData.notifications }),
  useDoctorDiagnostics: () => ({ data: doctorData.diagnostics }),
  useDoctorPharmacies: () => ({ data: doctorData.pharmacies }),
}))

function renderDoctorRoute(path: string, element: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/doctor" element={<DoctorHome />} />
            <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />
            <Route path="/doctor/patients" element={<DoctorPatientsPage />} />
            <Route path="/doctor/prescriptions" element={<DoctorPrescriptionsPage />} />
            <Route path="/doctor/lab-orders" element={<DoctorLabOrdersPage />} />
            <Route path="/doctor/notifications" element={<DoctorNotificationsPage />} />
            <Route path="/doctor/test" element={element} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('doctor UI regression', () => {
  it('renders doctor navigation labels in app layout', () => {
    renderDoctorRoute('/doctor/test', <div>Layout Test Page</div>)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Appointments')).toBeInTheDocument()
    expect(screen.getByText('Patients')).toBeInTheDocument()
    expect(screen.getByText('Prescriptions')).toBeInTheDocument()
    expect(screen.getByText('Lab Orders')).toBeInTheDocument()
    expect(screen.getByText('Notifications')).toBeInTheDocument()
  })

  it('renders dashboard stats and chart sections', () => {
    renderDoctorRoute('/doctor', <div />)

    expect(screen.getByText("Today's Appointments")).toBeInTheDocument()
    expect(screen.getByText('Patient Growth')).toBeInTheDocument()
    expect(screen.getByTestId('weekly-appointments-chart')).toBeInTheDocument()
    expect(screen.getByTestId('patient-growth-chart')).toBeInTheDocument()
    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
  })

  it.each([
    ['/doctor/appointments', 'Appointments'],
    ['/doctor/patients', 'Patients'],
    ['/doctor/prescriptions', 'Prescriptions'],
    ['/doctor/lab-orders', 'Lab Orders'],
    ['/doctor/notifications', 'Notification Center'],
  ])('renders key section for route %s', (path, heading) => {
    renderDoctorRoute(path, <div />)
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
  })
})
