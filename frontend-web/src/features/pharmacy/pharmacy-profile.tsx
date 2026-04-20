import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { api, getApiErrorMessage } from '../../lib/api'
import type { MyPharmacyProfileResponse } from '../../types'
import { useAuth } from '../auth/auth-context'
import { ProfileAvatarEditor } from '../profile/profile-avatar-editor'
import { usePharmacyMyProfile } from './pharmacy-shared'

type PharmacyProfileForm = {
  fullName: string
  phone: string
  address: string
}

const emptyForm: PharmacyProfileForm = {
  fullName: '',
  phone: '',
  address: '',
}

function formatDateOnly(value?: string | null) {
  if (!value) return 'Not provided'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not provided'
  return date.toISOString().slice(0, 10)
}

export function PharmacyProfilePage() {
  const queryClient = useQueryClient()
  const { refreshUser } = useAuth()
  const profileQuery = usePharmacyMyProfile()
  const [form, setForm] = useState<PharmacyProfileForm>(emptyForm)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!profileQuery.data) return
    const pharmacy = profileQuery.data.pharmacy
    setForm({
      fullName: pharmacy.fullName ?? '',
      phone: pharmacy.phone ?? '',
      address: pharmacy.address ?? '',
    })
  }, [profileQuery.data])

  const updateMutation = useMutation({
    mutationFn: async () =>
      (
        await api.patch<MyPharmacyProfileResponse>('/pharmacies/me/profile', {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
        })
      ).data,
    onSuccess: async () => {
      setError(null)
      setStatus('Profile updated successfully.')
      await queryClient.invalidateQueries({ queryKey: ['pharmacy-profile', 'me'] })
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

  const pharmacy = profileQuery.data?.pharmacy

  return (
    <div className="page">
      <div className="page-head">
        <h1>Profile</h1>
        <p>Manage your pharmacy contact information.</p>
      </div>
      {status ? <p>{status}</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {profileQuery.isLoading ? <p className="state">Loading profile...</p> : null}
      {profileQuery.isError ? <p className="error">Failed to load profile.</p> : null}

      {pharmacy ? (
        <section className="card">
          <h3>Pharmacy Profile</h3>
          <ProfileAvatarEditor
            fullName={pharmacy.fullName}
            avatarUrl={pharmacy.avatarUrl}
            queryKey={['pharmacy-profile', 'me']}
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
            <input id="email" value={pharmacy.email} disabled />

            <label htmlFor="role">Role</label>
            <input id="role" value={pharmacy.role} disabled />

            <label htmlFor="pharmacyId">Pharmacy ID</label>
            <input id="pharmacyId" value={pharmacy.id} disabled />

            <label htmlFor="pharmacyName">Pharmacy Name</label>
            <input id="pharmacyName" value={pharmacy.profile?.pharmacyName ?? 'Not provided'} disabled />

            <label htmlFor="licenseNumber">License Number</label>
            <input id="licenseNumber" value={pharmacy.profile?.licenseNumber ?? 'Not provided'} disabled />

            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input id="dateOfBirth" value={formatDateOnly(pharmacy.profile?.dateOfBirth)} disabled />

            <label htmlFor="gender">Gender</label>
            <input id="gender" value={pharmacy.profile?.gender ?? 'Not provided'} disabled />

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
