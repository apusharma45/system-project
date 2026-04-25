import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { AlertCircle, ArrowLeft, Eye, EyeOff, Heart, Lock, Mail, RefreshCw, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { api, getApiErrorMessage } from '../../lib/api'
import { useAuth } from './auth-context'

const loginSchema = z.object({
  email: z.email('Provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const forgotPasswordSchema = z.object({
  email: z.email('Provide a valid email address'),
})

const resetPasswordSchema = z.object({
  email: z.email('Provide a valid email address'),
  resetCode: z.string().regex(/^\d{6}$/, 'Enter the 6-digit reset code'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
})

type AuthMode = 'signin' | 'reset'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, user } = useAuth()
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetMessage, setResetMessage] = useState<string | null>(null)
  const [resetCodeSent, setResetCodeSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [resetSubmitting, setResetSubmitting] = useState(false)

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
    setResetMessage(null)
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

  const requestResetCode = async () => {
    setError(null)
    setResetMessage(null)
    const parsed = forgotPasswordSchema.safeParse({ email })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Enter a valid email address')
      return
    }

    setResetSubmitting(true)
    try {
      const response = await api.post<{ message: string }>('/auth/forgot-password', parsed.data)
      setResetCodeSent(true)
      setResetMessage(response.data.message || 'If the email exists, a reset code has been sent.')
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setResetSubmitting(false)
    }
  }

  const onResetPassword = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setResetMessage(null)
    const parsed = resetPasswordSchema.safeParse({ email, resetCode, newPassword })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid reset payload')
      return
    }

    setSubmitting(true)
    try {
      const response = await api.post<{ message: string }>('/auth/reset-password', parsed.data)
      setPassword('')
      setNewPassword('')
      setResetCode('')
      setResetCodeSent(false)
      setMode('signin')
      setResetMessage(response.data.message || 'Password reset successful. You can sign in now.')
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const openResetFlow = () => {
    setMode('reset')
    setError(null)
    setResetMessage(null)
  }

  const closeResetFlow = () => {
    setMode('signin')
    setError(null)
    setResetMessage(null)
    setResetCode('')
    setNewPassword('')
    setResetCodeSent(false)
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
          <h2>{mode === 'signin' ? 'Welcome Back' : 'Reset Password'}</h2>
          <p>{mode === 'signin' ? 'Sign in to continue to MedFlow' : 'Use your email reset code to set a new password'}</p>
        </div>

        <form className="auth-card auth-card-figma" onSubmit={mode === 'signin' ? onSubmit : onResetPassword}>
          <div className="auth-card-head">
            {mode === 'reset' ? (
              <button type="button" className="auth-back-link" onClick={closeResetFlow}>
                <ArrowLeft size={16} aria-hidden="true" />
                Back to sign in
              </button>
            ) : null}
            <h3>{mode === 'signin' ? 'Sign In' : 'Password Recovery'}</h3>
            <p>
              {mode === 'signin'
                ? 'Use your account credentials'
                : 'Send a code to your email, then enter it below'}
            </p>
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

            {mode === 'signin' ? (
              <>
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
                  <button type="button" className="auth-text-link" onClick={openResetFlow}>
                    Forgot password?
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="auth-code-button"
                  disabled={resetSubmitting}
                  onClick={requestResetCode}
                >
                  {resetCodeSent ? <RefreshCw size={17} aria-hidden="true" /> : <Mail size={17} aria-hidden="true" />}
                  {resetSubmitting ? 'Sending code...' : resetCodeSent ? 'Resend code' : 'Send reset code'}
                </button>

                <label className="auth-field" htmlFor="reset-code">
                  <span className="auth-label">Reset Code</span>
                  <span className="auth-input-wrap">
                    <ShieldCheck className="auth-input-icon" size={18} aria-hidden="true" />
                    <input
                      id="reset-code"
                      className="auth-control auth-control-icon"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter 6-digit code"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    />
                  </span>
                </label>

                <label className="auth-field" htmlFor="new-password">
                  <span className="auth-label">New Password</span>
                  <span className="auth-input-wrap">
                    <Lock className="auth-input-icon" size={18} aria-hidden="true" />
                    <input
                      id="new-password"
                      className="auth-control auth-control-icon auth-control-icon-trailing"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Create a new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="auth-input-toggle"
                      aria-label={showNewPassword ? 'Hide reset secret text' : 'Show reset secret text'}
                      onClick={() => setShowNewPassword((current) => !current)}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </span>
                </label>
              </>
            )}

            {error ? (
              <div className="auth-error-banner" role="alert">
                <AlertCircle size={18} aria-hidden="true" />
                <p>{error}</p>
              </div>
            ) : null}

            {resetMessage ? (
              <div className="auth-success-banner" role="status">
                <ShieldCheck size={18} aria-hidden="true" />
                <p>{resetMessage}</p>
              </div>
            ) : null}

            <button className="auth-submit" type="submit" disabled={submitting}>
              {mode === 'signin'
                ? submitting
                  ? 'Signing in...'
                  : 'Sign In'
                : submitting
                  ? 'Updating password...'
                  : 'Reset Password'}
            </button>

            <p className="auth-switch-copy">
              {mode === 'signin' ? (
                <>
                  <span>No account yet? </span>
                  <Link to="/register">Create one</Link>
                </>
              ) : (
                <button type="button" className="auth-text-link" onClick={closeResetFlow}>
                  I remembered my password
                </button>
              )}
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
