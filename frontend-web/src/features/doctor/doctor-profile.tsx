import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { api, getApiErrorMessage } from '../../lib/api'
import type { MyDoctorProfileResponse } from '../../types'
import { useAuth } from '../auth/auth-context'
import { ProfileAvatarEditor } from '../profile/profile-avatar-editor'
import { useDoctorMyProfile } from './doctor-shared'

type DoctorProfileForm = {
  fullName: string
  phone: string
  address: string
}

const emptyForm: DoctorProfileForm = {
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

export function DoctorProfilePage() {
  const queryClient = useQueryClient()
  const { refreshUser } = useAuth()
  const profileQuery = useDoctorMyProfile()
  const [form, setForm] = useState<DoctorProfileForm>(emptyForm)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!profileQuery.data) return
    const doctor = profileQuery.data.doctor
    setForm({
      fullName: doctor.fullName ?? '',
      phone: doctor.phone ?? '',
      address: doctor.address ?? '',
    })
  }, [profileQuery.data])

  const updateMutation = useMutation({
    mutationFn: async () =>
      (
        await api.patch<MyDoctorProfileResponse>('/doctors/me/profile', {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
        })
      ).data,
    onSuccess: async () => {
      setError(null)
      setStatus('Profile updated successfully.')
      await queryClient.invalidateQueries({ queryKey: ['doctor-profile', 'me'] })
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

  const doctor = profileQuery.data?.doctor

  return (
    <div className="page doctor-page doctor-profile-page">
      <div className="page-head">
        <h1>Profile</h1>
        <p>Manage your doctor contact information.</p>
      </div>
      {status ? <p>{status}</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {profileQuery.isLoading ? <p className="state">Loading profile...</p> : null}
      {profileQuery.isError ? <p className="error">Failed to load profile.</p> : null}

      {doctor ? (
        <section className="card">
          <h3>Doctor Profile</h3>
          <ProfileAvatarEditor
            fullName={doctor.fullName}
            avatarUrl={doctor.avatarUrl}
            queryKey={['doctor-profile', 'me']}
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
            <input id="email" value={doctor.email} disabled />

            <label htmlFor="role">Role</label>
            <input id="role" value={doctor.role} disabled />

            <label htmlFor="doctorId">Doctor ID</label>
            <input id="doctorId" value={doctor.id} disabled />

            <label htmlFor="specialization">Specialization</label>
            <input id="specialization" value={doctor.profile?.specialization ?? 'Not provided'} disabled />

            <label htmlFor="licenseNumber">License Number</label>
            <input id="licenseNumber" value={doctor.profile?.licenseNumber ?? 'Not provided'} disabled />

            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input id="dateOfBirth" value={formatDateOnly(doctor.profile?.dateOfBirth)} disabled />

            <label htmlFor="gender">Gender</label>
            <input id="gender" value={doctor.profile?.gender ?? 'Not provided'} disabled />

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
