import { QueryClientProvider } from '@tanstack/react-query'
import { act, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PatientNotificationsPage } from './patient-notifications'
import { createTestQueryClient } from '../../test/query-client'

const getMock = vi.fn()
const patchMock = vi.fn()
const socketHandlers: Record<string, (() => void) | undefined> = {}
const browserNotificationMock = vi.fn()

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
    on: vi.fn((event: string, cb: () => void) => {
      socketHandlers[event] = cb
    }),
    off: vi.fn((event: string) => {
      delete socketHandlers[event]
    }),
    disconnect: vi.fn(),
  }),
}))

function renderNotifications() {
  const queryClient = createTestQueryClient()

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
        {
          id: 'n3',
          type: 'LAB_ASSIGNED',
          message: 'Lab assigned',
          read: false,
          createdAt: '2026-03-07T00:00:00.000Z',
        },
      ],
    })
    for (const key of Object.keys(socketHandlers)) delete socketHandlers[key]
    browserNotificationMock.mockReset()
    Object.defineProperty(window, 'Notification', {
      configurable: true,
      writable: true,
      value: class MockNotification {
        static permission: NotificationPermission = 'granted'
        static requestPermission = vi.fn(async () => 'granted')
        constructor(_title: string, _options?: NotificationOptions) {
          browserNotificationMock()
        }
        close() {}
      },
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
    expect(screen.getByRole('link', { name: 'View Lab Order' })).toHaveAttribute(
      'href',
      '/patient/records?tab=labs',
    )
  })

  it('shows browser notification on realtime event when permission is granted', async () => {
    renderNotifications()
    await screen.findByRole('heading', { name: 'Notifications' })

    act(() => {
      socketHandlers['prescription.ready']?.()
    })
    await waitFor(() => {
      expect(browserNotificationMock).toHaveBeenCalled()
    })
  })
})
