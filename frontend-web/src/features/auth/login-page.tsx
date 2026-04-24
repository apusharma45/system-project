import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { AlertCircle, Eye, EyeOff, Heart, Lock, Mail } from 'lucide-react'
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
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      if (user.role === 'DOCTOR') {
        navigate('/doctor')
      } else if (user.role === 'PATIENT') {
        navigate('/patient')
      } else if (user.role === 'PHARMACY') {
        navigate('/pharmacy')
      } else if (user.role === 'DIAGNOSTIC') {
        navigate('/diagnostic')
      } else if (user.role === 'ADMIN') {
        navigate('/admin')
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
      } else if (me.data.role === 'PHARMACY') {
        navigate('/pharmacy')
      } else if (me.data.role === 'DIAGNOSTIC') {
        navigate('/diagnostic')
      } else if (me.data.role === 'ADMIN') {
        navigate('/admin')
      } else {
        setError('This account role is not available in the web dashboard right now.')
      }
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-shell auth-shell-blue">
      <div className="auth-panel">
        <div className="auth-brand">
          <div className="auth-brand-mark" aria-hidden="true">
            <Heart size={28} />
          </div>
          <h1>MedFlow</h1>
          <p>Your Complete Healthcare Platform</p>
        </div>

        <div className="auth-hero-copy">
          <h2>Welcome Back</h2>
          <p>Sign in to continue to MedFlow</p>
        </div>

        <form className="auth-card auth-card-figma" onSubmit={onSubmit}>
          <div className="auth-card-head">
            <h3>Sign In</h3>
            <p>Use your account credentials</p>
          </div>

          <div className="auth-form-grid">
            <label className="auth-field" htmlFor="email">
              <span className="auth-label">Email Address</span>
              <span className="auth-input-wrap">
                <Mail className="auth-input-icon" size={18} aria-hidden="true" />
                <input
                  id="email"
                  className="auth-control auth-control-icon"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </span>
            </label>

            <label className="auth-field" htmlFor="password">
              <span className="auth-label">Password</span>
              <span className="auth-input-wrap">
                <Lock className="auth-input-icon" size={18} aria-hidden="true" />
                <input
                  id="password"
                  className="auth-control auth-control-icon auth-control-icon-trailing"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="auth-input-toggle"
                  aria-label={showPassword ? 'Hide secret text' : 'Show secret text'}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            <div className="auth-row-end">
              <button
                type="button"
                className="auth-text-link"
                onClick={() => setError('Forgot password is not available yet.')}
              >
                Forgot password?
              </button>
            </div>

            {error ? (
              <div className="auth-error-banner" role="alert">
                <AlertCircle size={18} aria-hidden="true" />
                <p>{error}</p>
              </div>
            ) : null}

            <button className="auth-submit" type="submit" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="auth-switch-copy">
              <span>No account yet? </span>
              <Link to="/register">Create one</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
