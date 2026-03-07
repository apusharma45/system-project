import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppLayout } from '../../app/layout'
import { DoctorAppointmentsPage } from './doctor-appointments'
import { DoctorHome } from './doctor-home'
import { DoctorLabOrdersPage } from './doctor-lab-orders'
import { DoctorNotificationsPage } from './doctor-notifications'
import { DoctorPatientsPage } from './doctor-patients'
import { DoctorPrescriptionsPage } from './doctor-prescriptions'

const patchMock = vi.fn()

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
      status: 'REQUESTED' as const,
      scheduledAt: null,
      preferredDateFrom: '2026-02-28T08:00:00.000Z',
      preferredDateTo: '2026-02-28T10:00:00.000Z',
      preferredTimeNote: 'Evening',
      reason: 'Fever follow-up',
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
      appointment: {
        patientId: 'patient-2',
        patient: { id: 'patient-2', fullName: 'John Doe', email: 'john@example.com' },
      },
    },
  ],
  labs: [
    {
      id: 'lab-1',
      appointmentId: 'apt-1',
      diagnosticId: 'diag-1',
      status: 'CREATED' as const,
      tests: [{ title: 'Test 1', description: 'CBC panel' }],
      appointment: {
        patientId: 'patient-1',
        patient: { id: 'patient-1', fullName: 'Alice Smith', email: 'alice@example.com' },
      },
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

vi.mock('../../lib/api', () => ({
  api: {
    patch: (...args: unknown[]) => patchMock(...args),
  },
  getApiErrorMessage: () => 'api-error',
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
  beforeEach(() => {
    patchMock.mockReset()
    patchMock.mockResolvedValue({ data: {} })
  })

  it('renders doctor navigation labels in app layout', () => {
    renderDoctorRoute('/doctor/test', <div>Layout Test Page</div>)

    expect(screen.getByText('MedFlow')).toBeInTheDocument()
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

  it('request cards show preferred time and reason; approve preferred hits confirm endpoint', async () => {
    renderDoctorRoute('/doctor/appointments', <div />)

    expect(screen.getByText(/Preferred time: Evening/i)).toBeInTheDocument()
    expect(screen.getByText(/Reason: Fever follow-up/i)).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: 'Approve Preferred' })[0])
    await waitFor(() => {
      expect(patchMock).toHaveBeenCalledWith('/appointments/apt-1/confirm')
    })
  })

  it('assign new time hits schedule endpoint', async () => {
    renderDoctorRoute('/doctor/appointments', <div />)

    const requestItem = screen.getByText(/Reason: Fever follow-up/i).closest('li') as HTMLElement
    const datetimeInput = within(requestItem).getByDisplayValue('') as HTMLInputElement
    fireEvent.change(datetimeInput, { target: { value: '2026-03-01T10:30' } })
    fireEvent.click(screen.getByRole('button', { name: 'Assign New Time' }))

    await waitFor(() => {
      expect(patchMock).toHaveBeenCalledWith('/appointments/apt-1/schedule', {
        scheduledAt: '2026-03-01T04:30:00.000Z',
      })
    })
  })

  it('lab orders page shows requested tests and readable patient identity', () => {
    renderDoctorRoute('/doctor/lab-orders', <div />)
    expect(screen.getByText('Tests: Test 1: Test 1')).toBeInTheDocument()
    expect(screen.getByText('Patient: Alice Smith (alice@example.com) • #apt-1')).toBeInTheDocument()
  })

  it('prescriptions page is upload-only and shows patient-readable label', () => {
    renderDoctorRoute('/doctor/prescriptions', <div />)

    expect(screen.queryByText('Create Structured Prescription')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Sign' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Send Patient' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Send Pharmacy' })).not.toBeInTheDocument()
    expect(screen.getByText('Patient: John Doe (john@example.com)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Upload Document' })).toBeInTheDocument()
  })
})
