import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AppLayout } from '../../app/layout'
import { PharmacyHome } from './pharmacy-home'
import { PharmacyNotificationsPage } from './pharmacy-notifications'
import { PharmacyPrescriptionsPage } from './pharmacy-prescriptions'

const patchMock = vi.fn()

const authState = {
  user: { role: 'PHARMACY' as const },
  loading: false,
  token: 'pharmacy-token',
  logout: vi.fn(),
  login: vi.fn(),
  refreshUser: vi.fn(),
}

const pharmacyData = {
  prescriptions: [
    {
      id: 'rx-1',
      appointmentId: 'apt-1',
      doctorId: 'doctor-1',
      pharmacyId: 'pharmacy-1',
      notes: 'Take after meal',
      status: 'SENT_TO_PHARMACY' as const,
    },
    {
      id: 'rx-2',
      appointmentId: 'apt-2',
      doctorId: 'doctor-1',
      pharmacyId: 'pharmacy-1',
      notes: 'Already dispensed',
      status: 'DISPENSED' as const,
    },
  ],
  notifications: [
    {
      id: 'n-1',
      userId: 'pharmacy-1',
      type: 'PRESCRIPTION_READY' as const,
      message: 'Unread notification',
      read: false,
      createdAt: '2026-03-03T10:00:00.000Z',
    },
    {
      id: 'n-2',
      userId: 'pharmacy-1',
      type: 'PRESCRIPTION_READY' as const,
      message: 'Read notification',
      read: true,
      createdAt: '2026-03-03T09:00:00.000Z',
    },
  ],
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

vi.mock('../../lib/socket', () => ({
  connectNotificationsSocket: () => ({
    on: vi.fn(),
    disconnect: vi.fn(),
  }),
}))

vi.mock('../doctor/doctor-shared', () => ({
  useDoctorNotifications: () => ({ data: [] }),
}))

vi.mock('./pharmacy-shared', () => ({
  pharmacyInvalidateKeys: {
    prescriptions: ['prescriptions'],
    notifications: ['notifications'],
  },
  pharmacyPrescriptionActions: [{ label: 'Dispense', action: 'dispense', from: ['SENT_TO_PHARMACY'] }],
  usePharmacyPrescriptions: () => ({ data: pharmacyData.prescriptions }),
  usePharmacyNotifications: () => ({ data: pharmacyData.notifications }),
}))

function renderPharmacyRoute(path: string, element: ReactNode) {
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
            <Route path="/pharmacy" element={<PharmacyHome />} />
            <Route path="/pharmacy/prescriptions" element={<PharmacyPrescriptionsPage />} />
            <Route path="/pharmacy/notifications" element={<PharmacyNotificationsPage />} />
            <Route path="/pharmacy/test" element={element} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('pharmacy UI regression', () => {
  it('renders pharmacy nav labels in app layout', () => {
    renderPharmacyRoute('/pharmacy/test', <div>Pharmacy Test</div>)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Prescriptions')).toBeInTheDocument()
    expect(screen.getByText('Notifications')).toBeInTheDocument()
    expect(screen.queryByText('Appointments')).not.toBeInTheDocument()
  })

  it('shows enabled dispense only for SENT_TO_PHARMACY', () => {
    renderPharmacyRoute('/pharmacy/prescriptions', <div />)

    const buttons = screen.getAllByRole('button', { name: 'Dispense' })
    const enabled = buttons.filter((btn) => !btn.hasAttribute('disabled'))
    expect(enabled).toHaveLength(1)
  })

  it('filters unread notifications and marks one as read', async () => {
    patchMock.mockResolvedValue({ data: {} })
    renderPharmacyRoute('/pharmacy/notifications', <div />)

    fireEvent.click(screen.getByRole('button', { name: /unread/i }))
    expect(screen.getByText('Unread notification')).toBeInTheDocument()
    expect(screen.queryByText('Read notification')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /mark read/i }))
    await waitFor(() => {
      expect(patchMock).toHaveBeenCalledWith('/notifications/n-1/read')
    })
  })
})
