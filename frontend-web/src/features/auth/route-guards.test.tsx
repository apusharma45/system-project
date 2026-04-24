import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { RequireAuth, RequireRole } from './route-guards'

const authState = {
  user: null as null | { role: 'PATIENT' | 'DOCTOR' | 'PHARMACY' | 'DIAGNOSTIC' | 'ADMIN' },
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

  it('RequireRole allows pharmacy role', () => {
    authState.user = { role: 'PHARMACY' }
    authState.loading = false

    render(
      <MemoryRouter initialEntries={['/pharmacy']}>
        <Routes>
          <Route element={<RequireRole roles={['PHARMACY']} />}>
            <Route path="/pharmacy" element={<div>Pharmacy Home</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Pharmacy Home')).toBeInTheDocument()
  })

  it('RequireRole allows diagnostic role', () => {
    authState.user = { role: 'DIAGNOSTIC' }
    authState.loading = false

    render(
      <MemoryRouter initialEntries={['/diagnostic']}>
        <Routes>
          <Route element={<RequireRole roles={['DIAGNOSTIC']} />}>
            <Route path="/diagnostic" element={<div>Diagnostic Home</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Diagnostic Home')).toBeInTheDocument()
  })

  it('RequireRole allows admin role', () => {
    authState.user = { role: 'ADMIN' }
    authState.loading = false

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<RequireRole roles={['ADMIN']} />}>
            <Route path="/admin" element={<div>Admin Home</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Admin Home')).toBeInTheDocument()
  })
})
