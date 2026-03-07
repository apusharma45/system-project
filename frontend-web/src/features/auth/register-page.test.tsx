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

  it('supports PHARMACY role and submits valid payload', async () => {
    postMock.mockResolvedValue({ data: { access_token: 'token-1' } })
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/full name/i), 'Pharmacy User')
    await user.type(screen.getByLabelText(/email/i), 'pharm@example.com')
    await user.type(screen.getByLabelText(/password/i), 'strongpass')
    await user.selectOptions(screen.getByLabelText(/role/i), 'PHARMACY')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith('/auth/register', {
        fullName: 'Pharmacy User',
        email: 'pharm@example.com',
        password: 'strongpass',
        role: 'PHARMACY',
      })
    })
  })
})
