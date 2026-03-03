import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { RequireAuth, RequireRole } from './route-guards'

const authState = {
  user: null as null | { role: 'PATIENT' | 'DOCTOR' },
  loading: false,
}

vi.mock('./auth-context', () => ({
  useAuth: () => authState,
}))

describe('route guards', () => {
  it('RequireAuth blocks anonymous user', () => {
    authState.user = null
    authState.loading = false

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route element={<RequireAuth />}>
            <Route path="/private" element={<div>Private</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('RequireRole allows matching role', () => {
    authState.user = { role: 'DOCTOR' }
    authState.loading = false

    render(
      <MemoryRouter initialEntries={['/doctor']}>
        <Routes>
          <Route element={<RequireRole roles={['DOCTOR']} />}>
            <Route path="/doctor" element={<div>Doctor Home</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Doctor Home')).toBeInTheDocument()
  })
})
