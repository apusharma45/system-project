import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { api, getApiErrorMessage } from '../../lib/api'
import type { MyDiagnosticProfileResponse } from '../../types'
import { useAuth } from '../auth/auth-context'
import { ProfileAvatarEditor } from '../profile/profile-avatar-editor'
import { useDiagnosticMyProfile } from './diagnostic-shared'

type DiagnosticProfileForm = {
  fullName: string
  phone: string
  address: string
}

const emptyForm: DiagnosticProfileForm = {
  fullName: '',
  phone: '',
  address: '',
}

function joinArray(value?: string[] | null) {
  if (!value || value.length === 0) return 'Not provided'
  return value.join(', ')
}

export function DiagnosticProfilePage() {
  const queryClient = useQueryClient()
  const { refreshUser } = useAuth()
  const profileQuery = useDiagnosticMyProfile()
  const [form, setForm] = useState<DiagnosticProfileForm>(emptyForm)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!profileQuery.data) return
    const diagnostic = profileQuery.data.diagnostic
    setForm({
      fullName: diagnostic.fullName ?? '',
      phone: diagnostic.phone ?? '',
      address: diagnostic.address ?? '',
    })
  }, [profileQuery.data])

  const updateMutation = useMutation({
    mutationFn: async () =>
      (
        await api.patch<MyDiagnosticProfileResponse>('/diagnostic/me/profile', {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
        })
      ).data,
    onSuccess: async () => {
      setError(null)
      setStatus('Profile updated successfully.')
      await queryClient.invalidateQueries({ queryKey: ['diagnostic-profile', 'me'] })
      await refreshUser()
    },
    onError: (err) => {
      setStatus(null)
      setError(getApiErrorMessage(err))
    },
  })

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    setStatus(null)
    setError(null)
    updateMutation.mutate()
  }

  const diagnostic = profileQuery.data?.diagnostic

  return (
    <div className="page diagnostic-page diagnostic-profile-page">
      <div className="page-head">
        <h1>Profile</h1>
        <p>Manage diagnostic contact details and view lab identity information.</p>
      </div>
      {status ? <p>{status}</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {profileQuery.isLoading ? <p className="state">Loading profile...</p> : null}
      {profileQuery.isError ? <p className="error">Failed to load profile.</p> : null}

      {diagnostic ? (
        <section className="card">
          <h3>Diagnostic Profile</h3>
          <ProfileAvatarEditor
            fullName={diagnostic.fullName}
            avatarUrl={diagnostic.avatarUrl}
            queryKey={['diagnostic-profile', 'me']}
            refreshUser={refreshUser}
          />
          <form onSubmit={onSubmit} className="stack">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              value={form.fullName}
              onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
            />

            <label htmlFor="email">Email</label>
            <input id="email" value={diagnostic.email} disabled />

            <label htmlFor="role">Role</label>
            <input id="role" value={diagnostic.role} disabled />

            <label htmlFor="diagnosticId">Diagnostic ID</label>
            <input id="diagnosticId" value={diagnostic.id} disabled />

            <label htmlFor="labName">Lab Name</label>
            <input id="labName" value={diagnostic.profile?.labName ?? 'Not provided'} disabled />

            <label htmlFor="licenseNumber">License Number</label>
            <input id="licenseNumber" value={diagnostic.profile?.licenseNumber ?? 'Not provided'} disabled />

            <label htmlFor="accreditations">Accreditations</label>
            <input id="accreditations" value={joinArray(diagnostic.profile?.accreditations)} disabled />

            <label htmlFor="availableTests">Available Tests</label>
            <input id="availableTests" value={joinArray(diagnostic.profile?.availableTests)} disabled />

            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            />

            <label htmlFor="address">Address</label>
            <input
              id="address"
              value={form.address}
              onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
            />

            <button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </section>
      ) : null}
    </div>
  )
}
