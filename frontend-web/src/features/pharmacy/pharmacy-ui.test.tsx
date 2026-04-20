import { QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AppLayout } from '../../app/layout'
import { createTestQueryClient } from '../../test/query-client'
import { PharmacyPrescriptionsPage } from './pharmacy-prescriptions'

const patchMock = vi.fn()
const notificationsData = [
  {
    id: 'n-1',
    userId: 'pharmacy-1',
    type: 'PRESCRIPTION_READY',
    message: 'Unread notification',
    read: false,
    createdAt: '2026-03-03T10:00:00.000Z',
  },
  {
    id: 'n-2',
    userId: 'pharmacy-1',
    type: 'PRESCRIPTION_READY',
    message: 'Read notification',
    read: true,
    createdAt: '2026-03-03T09:00:00.000Z',
  },
]

vi.mock('../auth/auth-context', () => ({
  useAuth: () => ({
    user: { role: 'PHARMACY' as const, fullName: 'Prime Pharmacy', email: 'pharmacy@example.com' },
    loading: false,
    token: 'pharmacy-token',
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

vi.mock('./pharmacy-shared', () => ({
  usePharmacyNotifications: () => ({ data: notificationsData }),
  pharmacyPrescriptionActions: [{ label: 'Dispense', action: 'dispense', from: ['SENT_TO_PHARMACY'] }],
  pharmacyInvalidateKeys: {
    prescriptions: ['prescriptions'],
    notifications: ['notifications'],
  },
  usePharmacyPrescriptions: () => ({
    data: [
      {
        id: 'rx-1',
        appointmentId: 'apt-1',
        status: 'SENT_TO_PHARMACY',
        notes: 'Take after meal',
        appointment: {
          patient: { fullName: 'Ava Thompson', email: 'ava@example.com' },
          doctor: { fullName: 'Dr. Alice', email: 'alice@example.com' },
        },
      },
      {
        id: 'rx-2',
        appointmentId: 'apt-2',
        status: 'DISPENSED',
        notes: 'Already dispensed',
        appointment: {
          patient: { fullName: 'John Doe', email: 'john@example.com' },
          doctor: { fullName: 'Dr. Alice', email: 'alice@example.com' },
        },
      },
    ],
  }),
  usePharmacyMyProfile: () => ({
    data: {
      pharmacy: {
        id: 'pharmacy-1',
        fullName: 'Prime Pharmacy',
        email: 'pharmacy@example.com',
        role: 'PHARMACY',
        phone: '+8801700000004',
        address: 'Dhaka',
        joinedAt: '2026-01-01T00:00:00.000Z',
        profile: {
          pharmacyName: 'Prime Pharmacy',
          licenseNumber: 'PH-1001',
        },
      },
    },
    isLoading: false,
    isError: false,
  }),
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
    off: vi.fn(),
    disconnect: vi.fn(),
  }),
}))

describe('pharmacy UI regression', () => {
  it('renders pharmacy nav labels and profile card in app layout', () => {
    render(
      <MemoryRouter initialEntries={['/pharmacy/test']}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/pharmacy/test" element={<div>Pharmacy Test</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Prescriptions')).toBeInTheDocument()
    expect(screen.getByText('Notifications')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open profile' })).toHaveAttribute('href', '/pharmacy/profile')
    expect(screen.getByText('Prime Pharmacy')).toBeInTheDocument()
  })

  it('shows enabled dispense only for SENT_TO_PHARMACY', () => {
    const queryClient = createTestQueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PharmacyPrescriptionsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    const buttons = screen.getAllByRole('button', { name: 'Dispense' })
    const enabled = buttons.filter((btn) => !btn.hasAttribute('disabled'))
    expect(enabled).toHaveLength(1)
    expect(screen.getAllByRole('link', { name: 'View Details' })[0]).toHaveAttribute(
      'href',
      '/pharmacy/prescriptions/rx-1',
    )
    expect(document.querySelector('.pharmacy-prescriptions-toolbar')).not.toBeNull()
    expect(document.querySelector('.pharmacy-search-wrap')).not.toBeNull()
    expect(document.querySelector('.pharmacy-status-filter')).not.toBeNull()
  })

  it('filters prescriptions by patient name and status together', () => {
    const queryClient = createTestQueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PharmacyPrescriptionsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    fireEvent.change(screen.getByPlaceholderText('Search by patient, doctor, notes or reference'), {
      target: { value: 'ava' },
    })
    fireEvent.change(screen.getByDisplayValue('All Status'), {
      target: { value: 'SENT_TO_PHARMACY' },
    })

    expect(screen.getByText(/Patient:\s*Ava Thompson/i)).toBeInTheDocument()
    expect(screen.queryByText(/Patient:\s*John Doe/i)).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Dispense' }).filter((btn) => !btn.hasAttribute('disabled'))).toHaveLength(1)
  })

})
