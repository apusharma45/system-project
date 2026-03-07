import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { api, getApiErrorMessage } from '../../lib/api'
import { useAuth } from './auth-context'

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.email('Provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['PATIENT', 'DOCTOR', 'PHARMACY']),
})

export function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'PATIENT' | 'DOCTOR' | 'PHARMACY'>('PATIENT')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    const parsed = registerSchema.safeParse({ fullName, email, password, role })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid registration payload')
      return
    }

    setSubmitting(true)
    try {
      const response = await api.post<{ access_token: string }>('/auth/register', parsed.data)
      await login(response.data.access_token)
      if (role === 'DOCTOR') navigate('/doctor')
      else if (role === 'PHARMACY') navigate('/pharmacy')
      else navigate('/patient')
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>Create MedFlow Account</h1>
        <label htmlFor="fullName">Full Name</label>
        <input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="role">Role</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as 'PATIENT' | 'DOCTOR' | 'PHARMACY')}
        >
          <option value="PATIENT">PATIENT</option>
          <option value="DOCTOR">DOCTOR</option>
          <option value="PHARMACY">PHARMACY</option>
        </select>
        {error ? <p className="error">{error}</p> : null}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Account'}
        </button>
        <p>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  )
}
