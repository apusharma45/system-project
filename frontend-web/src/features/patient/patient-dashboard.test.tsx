import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PatientAppointmentsPage } from './patient-appointments'
import { createTestQueryClient } from '../../test/query-client'

const getMock = vi.fn()
const postMock = vi.fn()
const patchMock = vi.fn()

vi.mock('../../lib/api', () => ({
  api: {
    get: (...args: unknown[]) => getMock(...args),
    post: (...args: unknown[]) => postMock(...args),
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

vi.mock('../auth/auth-context', () => ({
  useAuth: () => ({
    token: 'patient-token',
  }),
}))

function renderAppointmentsPage() {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <PatientAppointmentsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('PatientAppointmentsPage', () => {
  beforeEach(() => {
    getMock.mockReset()
    postMock.mockReset()
    patchMock.mockReset()
    getMock.mockImplementation((url: string) => {
      if (url === '/users/doctors') {
        return Promise.resolve({
          data: [{ id: 'doctor-1', fullName: 'Dr Alice', email: 'alice@example.com', role: 'DOCTOR' }],
        })
      }
      if (url === '/appointments/me') {
        return Promise.resolve({ data: [] })
      }
      if (url === '/notifications/me') {
        return Promise.resolve({ data: [] })
      }
      return Promise.resolve({ data: [] })
    })
    postMock.mockResolvedValue({ data: { id: 'apt-1' } })
  })

  it('shows doctor full name with email in selector', async () => {
    renderAppointmentsPage()

    expect(await screen.findByRole('option', { name: 'Dr Alice (alice@example.com)' })).toBeInTheDocument()
  })

  it('requires reason when preferred time is provided', async () => {
    const user = userEvent.setup()
    renderAppointmentsPage()

    await screen.findByRole('option', { name: 'Dr Alice (alice@example.com)' })
    await user.selectOptions(screen.getByLabelText(/doctor/i), 'doctor-1')
    await user.type(screen.getByLabelText(/preferred time \(optional\)/i), 'Evening')
    await user.click(screen.getByRole('button', { name: /send request/i }))

    expect(await screen.findByText(/reason is required when preferred time is provided/i)).toBeInTheDocument()
    expect(postMock).not.toHaveBeenCalled()
  })

  it('allows appointment request without preferred from/to', async () => {
    const user = userEvent.setup()
    renderAppointmentsPage()

    await screen.findByRole('option', { name: 'Dr Alice (alice@example.com)' })
    await user.selectOptions(screen.getByLabelText(/doctor/i), 'doctor-1')
    await user.click(screen.getByRole('button', { name: /send request/i }))

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith('/appointments', {
        doctorId: 'doctor-1',
        preferredDateFrom: undefined,
        preferredDateTo: undefined,
        preferredTimeNote: undefined,
        reason: undefined,
      })
    })
  })

  it('shows loading and then empty state for appointments list', async () => {
    renderAppointmentsPage()

    expect(screen.getByText('Loading appointments...')).toBeInTheDocument()
    expect(await screen.findByText('No appointments yet.')).toBeInTheDocument()
  })

  it('shows error state when appointments query fails', async () => {
    getMock.mockImplementation((url: string) => {
      if (url === '/users/doctors') return Promise.resolve({ data: [] })
      if (url === '/appointments/me') return Promise.reject(new Error('boom'))
      return Promise.resolve({ data: [] })
    })

    renderAppointmentsPage()

    expect(await screen.findByText('api-error')).toBeInTheDocument()
  })

  it('shows test-needed badges based on requiresLab and labFlowLocked', async () => {
    getMock.mockImplementation((url: string) => {
      if (url === '/users/doctors') return Promise.resolve({ data: [] })
      if (url === '/appointments/me') {
        return Promise.resolve({
          data: [
            {
              id: 'a1',
              status: 'REQUESTED',
              doctorId: 'd1',
              patientId: 'p1',
              scheduledAt: null,
              requiresLab: true,
              labFlowLocked: true,
            },
            {
              id: 'a2',
              status: 'REQUESTED',
              doctorId: 'd1',
              patientId: 'p1',
              scheduledAt: null,
              requiresLab: true,
              labFlowLocked: false,
            },
            {
              id: 'a3',
              status: 'REQUESTED',
              doctorId: 'd1',
              patientId: 'p1',
              scheduledAt: null,
              requiresLab: false,
              labFlowLocked: false,
            },
          ],
        })
      }
      return Promise.resolve({ data: [] })
    })

    renderAppointmentsPage()

    expect(await screen.findByText('Result pending')).toBeInTheDocument()
    expect(screen.getByText('Test required')).toBeInTheDocument()
    expect(screen.getByText('No test required')).toBeInTheDocument()
  })

  it('shows doctor identity in appointment list and details link', async () => {
    getMock.mockImplementation((url: string) => {
      if (url === '/users/doctors') return Promise.resolve({ data: [] })
      if (url === '/appointments/me') {
        return Promise.resolve({
          data: [
            {
              id: 'a1',
              status: 'REQUESTED',
              doctorId: 'd1',
              patientId: 'p1',
              scheduledAt: null,
              requiresLab: false,
              labFlowLocked: false,
              doctorSnapshot: { id: 'd1', fullName: 'Dr. Alice', email: 'alice@example.com' },
            },
          ],
        })
      }
      return Promise.resolve({ data: [] })
    })

    renderAppointmentsPage()

    expect(await screen.findByText('Doctor: Dr. Alice')).toBeInTheDocument()
    expect(screen.getByText('Email: alice@example.com')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View Details' })).toHaveAttribute(
      'href',
      '/patient/appointments/a1',
    )
  })
})
