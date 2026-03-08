import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PatientNotificationsPage } from './patient-notifications'

const getMock = vi.fn()
const patchMock = vi.fn()

vi.mock('../../lib/api', () => ({
  api: {
    get: (...args: unknown[]) => getMock(...args),
    patch: (...args: unknown[]) => patchMock(...args),
  },
}))

vi.mock('../auth/auth-context', () => ({
  useAuth: () => ({
    token: 'patient-token',
  }),
}))

vi.mock('../../lib/socket', () => ({
  connectNotificationsSocket: () => ({
    on: vi.fn(),
    disconnect: vi.fn(),
  }),
}))

function renderNotifications() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <PatientNotificationsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('PatientNotificationsPage', () => {
  beforeEach(() => {
    getMock.mockReset()
    patchMock.mockReset()
    getMock.mockResolvedValue({
      data: [
        {
          id: 'n1',
          type: 'PRESCRIPTION_READY',
          message: 'Prescription sent',
          read: false,
          createdAt: '2026-03-07T00:00:00.000Z',
        },
        {
          id: 'n2',
          type: 'LAB_RESULT_UPLOADED',
          message: 'Lab result uploaded',
          read: false,
          createdAt: '2026-03-07T00:00:00.000Z',
        },
      ],
    })
  })

  it('shows deep links to records tabs for prescription and lab notifications', async () => {
    renderNotifications()

    expect(await screen.findByRole('link', { name: 'View Prescription' })).toHaveAttribute(
      'href',
      '/patient/records?tab=prescriptions',
    )
    expect(screen.getByRole('link', { name: 'View Report' })).toHaveAttribute(
      'href',
      '/patient/records?tab=reports',
    )
  })
})
