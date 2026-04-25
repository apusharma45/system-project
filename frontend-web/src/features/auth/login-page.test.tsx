import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LoginPage } from './login-page'

const postMock = vi.fn()
const getMock = vi.fn()
const loginMock = vi.fn().mockResolvedValue(undefined)
const navigateMock = vi.fn()
const authState = {
  user: null as null | { role: 'PATIENT' | 'DOCTOR' | 'PHARMACY' | 'DIAGNOSTIC' | 'ADMIN' },
}

vi.mock('../../lib/api', () => ({
  api: {
    post: (...args: unknown[]) => postMock(...args),
    get: (...args: unknown[]) => getMock(...args),
  },
  getApiErrorMessage: () => 'api-error',
}))

vi.mock('./auth-context', () => ({
  useAuth: () => ({
    user: authState.user,
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

describe('LoginPage', () => {
  beforeEach(() => {
    postMock.mockReset()
    getMock.mockReset()
    loginMock.mockClear()
    navigateMock.mockClear()
    authState.user = null
  })

  it('validates email and password before API call', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bad-email' } })
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/email/i)).toBeInTheDocument()
    expect(postMock).not.toHaveBeenCalled()
  })

  it('redirects diagnostic role to diagnostic route after login', async () => {
    postMock.mockResolvedValue({ data: { access_token: 'token' } })
    getMock.mockResolvedValue({ data: { role: 'DIAGNOSTIC' } })

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'diag@example.com' } })
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/diagnostic')
    })
  })

  it('redirects admin role to admin route after login', async () => {
    postMock.mockResolvedValue({ data: { access_token: 'token' } })
    getMock.mockResolvedValue({ data: { role: 'ADMIN' } })

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'admin@example.com' } })
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/admin')
    })
  })

  it('requests and submits password reset code', async () => {
    postMock
      .mockResolvedValueOnce({ data: { message: 'If the email exists, a reset code has been sent.' } })
      .mockResolvedValueOnce({ data: { message: 'Password reset successful' } })

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'patient@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /forgot password/i }))
    fireEvent.click(screen.getByRole('button', { name: /send reset code/i }))

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith('/auth/forgot-password', { email: 'patient@example.com' })
    })

    fireEvent.change(screen.getByLabelText(/reset code/i), { target: { value: '123456' } })
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }))

    await waitFor(() => {
      expect(postMock).toHaveBeenLastCalledWith('/auth/reset-password', {
        email: 'patient@example.com',
        resetCode: '123456',
        newPassword: 'secret123',
      })
    })
  })
})
