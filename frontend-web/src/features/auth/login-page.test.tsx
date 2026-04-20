import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LoginPage } from './login-page'

const postMock = vi.fn()
const getMock = vi.fn()
const loginMock = vi.fn().mockResolvedValue(undefined)
const navigateMock = vi.fn()
const authState = {
  user: null as null | { role: 'PATIENT' | 'DOCTOR' | 'PHARMACY' | 'DIAGNOSTIC' },
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
})
