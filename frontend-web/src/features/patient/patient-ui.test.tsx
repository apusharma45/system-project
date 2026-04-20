import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AppLayout } from '../../app/layout'
import { PatientAppointmentsPage } from './patient-appointments'
import { PatientAppointmentDetailsPage } from './patient-appointment-details'
import { PatientNotificationsPage } from './patient-notifications'
import { PatientProfilePage } from './patient-profile'
import { PatientRecordsPage } from './patient-records'
import { createTestQueryClient } from '../../test/query-client'

vi.mock('../auth/auth-context', () => ({
  useAuth: () => ({
    user: { role: 'PATIENT', fullName: 'Patient Demo', userId: 'patient-1', email: 'patient@example.com' },
    loading: false,
    token: 'patient-token',
    logout: vi.fn(),
    login: vi.fn(),
    refreshUser: vi.fn(),
  }),
}))

vi.mock('../doctor/doctor-shared', () => ({
  useDoctorNotifications: () => ({ data: [] }),
}))

vi.mock('../diagnostic/diagnostic-shared', () => ({
  useDiagnosticNotifications: () => ({ data: [] }),
}))

vi.mock('../pharmacy/pharmacy-shared', () => ({
  usePharmacyNotifications: () => ({ data: [] }),
}))

vi.mock('../../lib/api', () => ({
  api: {
    get: (url: string) => {
      if (url === '/appointments/me') return Promise.resolve({ data: [] })
      if (url === '/notifications/me') return Promise.resolve({ data: [] })
      if (url === '/users/doctors') return Promise.resolve({ data: [] })
      if (url === '/prescriptions/me') return Promise.resolve({ data: [] })
      if (url === '/labs/orders/me') return Promise.resolve({ data: [] })
      if (url === '/patients/me/profile') {
        return Promise.resolve({
          data: {
            patient: {
              id: 'patient-1',
              fullName: 'Patient Demo',
              email: 'patient@example.com',
              role: 'PATIENT',
              phone: '+8801700000000',
              address: 'Dhaka',
              joinedAt: '2026-01-01T00:00:00.000Z',
              profile: { gender: 'MALE', dateOfBirth: '1990-01-01T00:00:00.000Z' },
            },
          },
        })
      }
      return Promise.resolve({ data: [] })
    },
    patch: () => Promise.resolve({ data: {} }),
  },
  getApiErrorMessage: () => 'api-error',
}))

vi.mock('../../lib/socket', () => ({
  connectNotificationsSocket: () => ({
    on: vi.fn(),
    off: vi.fn(),
    disconnect: vi.fn(),
  }),
}))

function renderPatientRoute(path: string, element: ReactNode) {
  const queryClient = createTestQueryClient()

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/patient" element={<PatientAppointmentsPage />} />
            <Route path="/patient/appointments" element={<PatientAppointmentsPage />} />
            <Route path="/patient/appointments/:appointmentId" element={<PatientAppointmentDetailsPage />} />
            <Route path="/patient/records" element={<PatientRecordsPage />} />
            <Route path="/patient/notifications" element={<PatientNotificationsPage />} />
            <Route path="/patient/profile" element={<PatientProfilePage />} />
            <Route path="/patient/test" element={element} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('patient navigation', () => {
  it('points appointments nav to dedicated patient appointments route', () => {
    renderPatientRoute('/patient/test', <div>Patient Test Page</div>)

    const appointmentsLink = screen.getByRole('link', { name: 'Appointments' })
    expect(appointmentsLink).toHaveAttribute('href', '/patient/appointments')
  })

  it('points notifications nav to dedicated patient notifications route', () => {
    renderPatientRoute('/patient/test', <div>Patient Test Page</div>)

    const notificationsLink = screen.getByRole('link', { name: 'Notifications' })
    expect(notificationsLink).toHaveAttribute('href', '/patient/notifications')
  })

  it('points records nav to dedicated patient records route', () => {
    renderPatientRoute('/patient/test', <div>Patient Test Page</div>)

    const recordsLink = screen.getByRole('link', { name: 'Records' })
    expect(recordsLink).toHaveAttribute('href', '/patient/records')
  })

  it('points profile nav to dedicated patient profile route', () => {
    renderPatientRoute('/patient/test', <div>Patient Test Page</div>)

    const profileLink = screen.getByRole('link', { name: 'Profile' })
    expect(profileLink).toHaveAttribute('href', '/patient/profile')
  })

  it('shows patient full name in profile card and card links to profile page', () => {
    renderPatientRoute('/patient/test', <div>Patient Test Page</div>)

    expect(screen.getByText('Patient Demo')).toBeInTheDocument()
    const profileCardLink = screen.getByRole('link', { name: 'Open profile' })
    expect(profileCardLink).toHaveAttribute('href', '/patient/profile')
  })

  it('navigates to patient appointments page when appointments nav is clicked', async () => {
    const user = userEvent.setup()
    renderPatientRoute('/patient', <div />)

    await user.click(screen.getByRole('link', { name: 'Appointments' }))

    expect(await screen.findByRole('heading', { name: 'Appointments' })).toBeInTheDocument()
  })

  it('navigates to patient notifications page when notifications nav is clicked', async () => {
    const user = userEvent.setup()
    renderPatientRoute('/patient', <div />)

    await user.click(screen.getByRole('link', { name: 'Notifications' }))

    expect(await screen.findByRole('heading', { name: 'Notifications' })).toBeInTheDocument()
  })

  it('navigates to patient records page when records nav is clicked', async () => {
    const user = userEvent.setup()
    renderPatientRoute('/patient', <div />)

    await user.click(screen.getByRole('link', { name: 'Records' }))

    expect(await screen.findByRole('heading', { name: 'Records' })).toBeInTheDocument()
  })

  it('dashboard route renders appointments content', async () => {
    renderPatientRoute('/patient', <div />)
    expect(await screen.findByRole('heading', { name: 'Appointments' })).toBeInTheDocument()
  })

  it('patient appointment details route is guarded and renders details page', async () => {
    renderPatientRoute('/patient/appointments/missing', <div />)
    expect(await screen.findByRole('heading', { name: 'Appointment Details' })).toBeInTheDocument()
  })
})
