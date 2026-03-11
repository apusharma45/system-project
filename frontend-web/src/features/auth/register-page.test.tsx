import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RegisterPage } from './register-page'

const postMock = vi.fn()
const loginMock = vi.fn().mockResolvedValue(undefined)
const navigateMock = vi.fn()

vi.mock('../../lib/api', () => ({
  api: {
    post: (...args: unknown[]) => postMock(...args),
  },
  getApiErrorMessage: () => 'api-error',
}))

vi.mock('./auth-context', () => ({
  useAuth: () => ({
    login: loginMock,
  }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

describe('RegisterPage', () => {
  beforeEach(() => {
    postMock.mockReset()
    loginMock.mockClear()
    navigateMock.mockClear()
  })

  it('renders role selector before identity fields', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    const roleSelect = screen.getByLabelText(/^Role$/i)
    const fullNameInput = screen.getByLabelText(/^Full Name$/i)
    expect(roleSelect.compareDocumentPosition(fullNameInput) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('supports PHARMACY role and submits valid payload', async () => {
    postMock.mockResolvedValue({ data: { access_token: 'token-1' } })
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    await user.selectOptions(screen.getByLabelText(/^role$/i), 'PHARMACY')
    const roleSelect = screen.getByLabelText(/^Role$/i)
    const pharmacyNameInput = screen.getByLabelText(/pharmacy name/i)
    const requesterNameInput = screen.getByLabelText(/requester name \(on behalf of pharmacy\)/i)
    expect(roleSelect.compareDocumentPosition(pharmacyNameInput) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(pharmacyNameInput.compareDocumentPosition(requesterNameInput) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    await user.type(requesterNameInput, 'Pharmacy User')
    await user.type(screen.getByLabelText(/email/i), 'pharm@example.com')
    await user.type(screen.getByLabelText(/password/i), 'strongpass')
    await user.type(screen.getByLabelText(/^Phone$/i), '+8801700000000')
    await user.type(screen.getByLabelText(/^Address$/i), 'Dhaka')
    await user.type(screen.getByLabelText(/license number/i), 'PH-12345')
    await user.type(pharmacyNameInput, 'City Pharmacy')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith('/auth/register', {
        fullName: 'Pharmacy User',
        email: 'pharm@example.com',
        password: 'strongpass',
        phone: '+8801700000000',
        address: 'Dhaka',
        role: 'PHARMACY',
        professionalProfile: {
          gender: undefined,
          dateOfBirth: undefined,
          licenseNumber: 'PH-12345',
          specialization: undefined,
          pharmacyName: 'City Pharmacy',
          labName: undefined,
          degrees: undefined,
          certifications: undefined,
          yearsOfExperience: undefined,
          licenseAuthority: undefined,
          accreditations: undefined,
          availableTests: undefined,
        },
      })
    })
  }, 15000)

  it('supports DIAGNOSTIC role and submits required lab fields', async () => {
    postMock.mockResolvedValue({ data: { access_token: 'token-2' } })
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    await user.selectOptions(screen.getByLabelText(/^role$/i), 'DIAGNOSTIC')
    const roleSelect = screen.getByLabelText(/^Role$/i)
    const labNameInput = screen.getByLabelText(/lab name/i)
    const requesterNameInput = screen.getByLabelText(/requester name \(on behalf of lab\)/i)
    expect(roleSelect.compareDocumentPosition(labNameInput) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(labNameInput.compareDocumentPosition(requesterNameInput) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    await user.type(requesterNameInput, 'Lab User')
    await user.type(screen.getByLabelText(/email/i), 'lab@example.com')
    await user.type(screen.getByLabelText(/password/i), 'strongpass')
    await user.type(screen.getByLabelText(/^Phone$/i), '+8801700000001')
    await user.type(screen.getByLabelText(/^Address$/i), 'Dhaka')
    await user.type(screen.getByLabelText(/license number/i), 'LAB-7788')
    await user.type(labNameInput, 'Prime Lab')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith(
        '/auth/register',
        expect.objectContaining({
          role: 'DIAGNOSTIC',
          professionalProfile: expect.objectContaining({
            licenseNumber: 'LAB-7788',
            labName: 'Prime Lab',
          }),
        }),
      )
    })
  }, 15000)

  it('shows validation error when doctor required fields are missing', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    await user.selectOptions(screen.getByLabelText(/role/i), 'DOCTOR')
    await user.type(screen.getByLabelText(/^full name$/i), 'Doctor User')
    await user.type(screen.getByLabelText(/email/i), 'doctor@example.com')
    await user.type(screen.getByLabelText(/password/i), 'strongpass')
    await user.type(screen.getByLabelText(/^Phone$/i), '+8801700000002')
    await user.type(screen.getByLabelText(/^Address$/i), 'Dhaka')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByText(/gender is required for doctor registration/i)).toBeInTheDocument()
    expect(postMock).not.toHaveBeenCalled()
  })
})
