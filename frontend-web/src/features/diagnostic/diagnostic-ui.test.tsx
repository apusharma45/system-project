import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AppLayout } from '../../app/layout'
import { DiagnosticHome } from './diagnostic-home'
import { DiagnosticLabOrdersPage } from './diagnostic-lab-orders'
import { DiagnosticNotificationsPage } from './diagnostic-notifications'

const patchMock = vi.fn()

const authState = {
  user: { role: 'DIAGNOSTIC' as const },
  loading: false,
  token: 'diag-token',
  logout: vi.fn(),
  login: vi.fn(),
  refreshUser: vi.fn(),
}

const labOrders = [
  { id: 'l1', appointmentId: 'a1', status: 'CREATED', appointment: { patientId: 'p1' }, labResult: null },
  { id: 'l2', appointmentId: 'a2', status: 'ASSIGNED', appointment: { patientId: 'p2' }, labResult: null },
  { id: 'l3', appointmentId: 'a3', status: 'SAMPLE_COLLECTED', appointment: { patientId: 'p3' }, labResult: null },
  {
    id: 'l4',
    appointmentId: 'a4',
    status: 'RESULT_UPLOADED',
    appointment: { patientId: 'p4' },
    labResult: { fileUrl: 'https://example.com/report.pdf' },
  },
] as const

const notifications = [
  {
    id: 'n-1',
    userId: 'diag-1',
    type: 'LAB_RESULT_UPLOADED' as const,
    message: 'Unread lab event',
    read: false,
    createdAt: '2026-03-03T10:00:00.000Z',
  },
  {
    id: 'n-2',
    userId: 'diag-1',
    type: 'LAB_RESULT_UPLOADED' as const,
    message: 'Read lab event',
    read: true,
    createdAt: '2026-03-03T09:00:00.000Z',
  },
]

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

vi.mock('./diagnostic-shared', () => ({
  diagnosticInvalidateKeys: {
    labs: ['labs'],
    notifications: ['notifications'],
  },
  labTransitionActions: [
    { label: 'Assign', action: 'assign', from: ['CREATED'] },
    { label: 'Sample Collected', action: 'sample-collected', from: ['ASSIGNED'] },
    { label: 'Result Uploaded', action: 'result-uploaded', from: ['SAMPLE_COLLECTED'] },
    { label: 'Mark Sent', action: 'sent', from: ['RESULT_UPLOADED'] },
  ],
  useDiagnosticLabOrders: () => ({ data: labOrders }),
  useDiagnosticNotifications: () => ({ data: notifications }),
}))

vi.mock('../doctor/doctor-shared', () => ({
  useDoctorNotifications: () => ({ data: [] }),
}))

function renderDiagnosticRoute(path: string, element: ReactNode) {
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
            <Route path="/diagnostic" element={<DiagnosticHome />} />
            <Route path="/diagnostic/lab-orders" element={<DiagnosticLabOrdersPage />} />
            <Route path="/diagnostic/notifications" element={<DiagnosticNotificationsPage />} />
            <Route path="/diagnostic/test" element={element} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('diagnostic UI regression', () => {
  it('renders diagnostic nav labels in app layout', () => {
    renderDiagnosticRoute('/diagnostic/test', <div>Diagnostic Test</div>)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Lab Orders')).toBeInTheDocument()
    expect(screen.getByText('Notifications')).toBeInTheDocument()
    expect(screen.queryByText('Appointments')).not.toBeInTheDocument()
  })

  it('renders queue with transition actions by state', () => {
    renderDiagnosticRoute('/diagnostic/lab-orders', <div />)

    const assignButtons = screen.getAllByRole('button', { name: 'Assign' })
    const enabledAssign = assignButtons.filter((btn) => !btn.hasAttribute('disabled'))
    expect(enabledAssign).toHaveLength(1)

    expect(screen.queryByText('Provide a result file URL before uploading.')).not.toBeInTheDocument()
  })

  it('filters unread notifications and marks one as read', async () => {
    patchMock.mockResolvedValue({ data: {} })
    renderDiagnosticRoute('/diagnostic/notifications', <div />)

    fireEvent.click(screen.getByRole('button', { name: /unread/i }))
    expect(screen.getByText('Unread lab event')).toBeInTheDocument()
    expect(screen.queryByText('Read lab event')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /mark read/i }))
    await waitFor(() => {
      expect(patchMock).toHaveBeenCalledWith('/notifications/n-1/read')
    })
  })
})
