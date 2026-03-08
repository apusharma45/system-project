import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PatientProfilePage } from './patient-profile'

const getMock = vi.fn()
const patchMock = vi.fn()
const refreshUserMock = vi.fn()

vi.mock('../../lib/api', () => ({
  api: {
    get: (...args: unknown[]) => getMock(...args),
    patch: (...args: unknown[]) => patchMock(...args),
  },
  getApiErrorMessage: () => 'api-error',
}))

vi.mock('../auth/auth-context', () => ({
  useAuth: () => ({
    refreshUser: refreshUserMock,
  }),
}))

function renderProfilePage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <PatientProfilePage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('PatientProfilePage', () => {
  beforeEach(() => {
    getMock.mockReset()
    patchMock.mockReset()
    refreshUserMock.mockReset()

    getMock.mockResolvedValue({
      data: {
        patient: {
          id: 'patient-1',
          fullName: 'Patient Demo',
          email: 'patient@example.com',
          role: 'PATIENT',
          phone: '+8801700000000',
          address: 'Dhaka',
          joinedAt: '2026-01-01T00:00:00.000Z',
          profile: {
            gender: 'MALE',
            dateOfBirth: '1990-01-01T00:00:00.000Z',
            allergies: 'Dust',
          },
        },
      },
    })
    patchMock.mockResolvedValue({ data: {} })
  })

  it('renders read-only identity fields', async () => {
    renderProfilePage()

    expect(await screen.findByDisplayValue('patient@example.com')).toBeDisabled()
    expect(screen.getByDisplayValue('PATIENT')).toBeDisabled()
    expect(screen.getByDisplayValue('patient-1')).toBeDisabled()
    expect(screen.getByDisplayValue('1990-01-01')).toBeDisabled()
    expect(screen.getByDisplayValue('MALE')).toBeDisabled()

    expect(screen.getByLabelText(/^full name$/i)).toBeEnabled()
    expect(screen.getByLabelText(/^phone$/i)).toBeEnabled()
    expect(screen.getByLabelText(/^address$/i)).toBeEnabled()
  })

  it('submits only editable profile fields', async () => {
    const user = userEvent.setup()
    renderProfilePage()

    await screen.findByDisplayValue('Patient Demo')
    await user.clear(screen.getByLabelText(/full name/i))
    await user.type(screen.getByLabelText(/full name/i), 'Updated Patient')
    await user.click(screen.getByRole('button', { name: /save profile/i }))

    await waitFor(() => {
      expect(patchMock).toHaveBeenCalledWith('/patients/me/profile', {
        fullName: 'Updated Patient',
        phone: '+8801700000000',
        address: 'Dhaka',
        allergies: 'Dust',
        chronicConditions: '',
        currentMedications: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelation: '',
      })
    })
  })
})
