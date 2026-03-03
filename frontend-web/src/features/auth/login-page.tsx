import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { api, getApiErrorMessage } from '../../lib/api'
import { useAuth } from './auth-context'

const loginSchema = z.object({
  email: z.email('Provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export function LoginPage() {
  const navigate = useNavigate()
  const { login, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      if (user.role === 'DOCTOR') {
        navigate('/doctor')
      } else if (user.role === 'PATIENT') {
        navigate('/patient')
      } else if (user.role === 'DIAGNOSTIC') {
        navigate('/diagnostic')
      }
    }
  }, [user, navigate])

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid credentials payload')
      return
    }

    setSubmitting(true)
    try {
      const response = await api.post<{ access_token: string }>('/auth/login', parsed.data)
      await login(response.data.access_token)
      const me = await api.get<{ role: string }>('/users/me')
      if (me.data.role === 'DOCTOR') {
        navigate('/doctor')
      } else if (me.data.role === 'PATIENT') {
        navigate('/patient')
      } else if (me.data.role === 'DIAGNOSTIC') {
        navigate('/diagnostic')
      } else {
        setError('This web app currently supports PATIENT, DOCTOR and DIAGNOSTIC roles only.')
      }
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>MedFlow Sign In</h1>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error ? <p className="error">{error}</p> : null}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
        <p>
          No account yet? <Link to="/register">Create one</Link>
        </p>
      </form>
    </div>
  )
}
