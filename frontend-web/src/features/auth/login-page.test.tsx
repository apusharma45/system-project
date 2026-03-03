import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LoginPage } from './login-page'

const postMock = vi.fn()

vi.mock('../../lib/api', () => ({
  api: {
    post: (...args: unknown[]) => postMock(...args),
    get: vi.fn(),
  },
  getApiErrorMessage: () => 'api-error',
}))

vi.mock('./auth-context', () => ({
  useAuth: () => ({
    user: null,
    login: vi.fn().mockResolvedValue(undefined),
  }),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    postMock.mockReset()
  })

  it('validates email and password before API call', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bad-email' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/email/i)).toBeInTheDocument()
    expect(postMock).not.toHaveBeenCalled()
  })
})
