import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { api, getApiErrorMessage } from '../../lib/api'
import type { MyPatientProfileResponse } from '../../types'
import { useAuth } from '../auth/auth-context'

type ProfileFormState = {
  fullName: string
  phone: string
  address: string
  allergies: string
  chronicConditions: string
  currentMedications: string
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelation: string
}

const emptyForm: ProfileFormState = {
  fullName: '',
  phone: '',
  address: '',
  allergies: '',
  chronicConditions: '',
  currentMedications: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelation: '',
}

function formatDateOnly(value?: string | null) {
  if (!value) return 'Not provided'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not provided'
  return date.toISOString().slice(0, 10)
}

export function PatientProfilePage() {
  const queryClient = useQueryClient()
  const { refreshUser } = useAuth()
  const [form, setForm] = useState<ProfileFormState>(emptyForm)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const profileQuery = useQuery({
    queryKey: ['patient-profile', 'me'],
    queryFn: async () => (await api.get<MyPatientProfileResponse>('/patients/me/profile')).data,
  })

  useEffect(() => {
    if (!profileQuery.data) return
    const patient = profileQuery.data.patient
    setForm({
      fullName: patient.fullName ?? '',
      phone: patient.phone ?? '',
      address: patient.address ?? '',
      allergies: patient.profile?.allergies ?? '',
      chronicConditions: patient.profile?.chronicConditions ?? '',
      currentMedications: patient.profile?.currentMedications ?? '',
      emergencyContactName: patient.profile?.emergencyContactName ?? '',
      emergencyContactPhone: patient.profile?.emergencyContactPhone ?? '',
      emergencyContactRelation: patient.profile?.emergencyContactRelation ?? '',
    })
  }, [profileQuery.data])

  const updateMutation = useMutation({
    mutationFn: async () =>
      (
        await api.patch<MyPatientProfileResponse>('/patients/me/profile', {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          allergies: form.allergies.trim(),
          chronicConditions: form.chronicConditions.trim(),
          currentMedications: form.currentMedications.trim(),
          emergencyContactName: form.emergencyContactName.trim(),
          emergencyContactPhone: form.emergencyContactPhone.trim(),
          emergencyContactRelation: form.emergencyContactRelation.trim(),
        })
      ).data,
    onSuccess: async () => {
      setError(null)
      setStatus('Profile updated successfully.')
      await queryClient.invalidateQueries({ queryKey: ['patient-profile', 'me'] })
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

  const patient = profileQuery.data?.patient

  return (
    <div className="page">
      <div className="page-head">
        <h1>Profile</h1>
        <p>Manage your personal and medical contact information.</p>
      </div>
      {status ? <p>{status}</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {profileQuery.isLoading ? <p className="state">Loading profile...</p> : null}
      {profileQuery.isError ? <p className="error">Failed to load profile.</p> : null}

      {patient ? (
        <section className="card">
          <h3>Patient Profile</h3>
          <form onSubmit={onSubmit} className="stack">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              value={form.fullName}
              onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
            />

            <label htmlFor="email">Email</label>
            <input id="email" value={patient.email} disabled />

            <label htmlFor="role">Role</label>
            <input id="role" value={patient.role} disabled />

            <label htmlFor="patientId">Patient ID</label>
            <input id="patientId" value={patient.id} disabled />

            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input id="dateOfBirth" value={formatDateOnly(patient.profile?.dateOfBirth)} disabled />

            <label htmlFor="gender">Gender</label>
            <input id="gender" value={patient.profile?.gender ?? 'Not provided'} disabled />

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
            <label htmlFor="allergies">Allergies</label>
            <textarea
              id="allergies"
              rows={2}
              value={form.allergies}
              onChange={(e) => setForm((prev) => ({ ...prev, allergies: e.target.value }))}
            />
            <label htmlFor="chronicConditions">Chronic Conditions</label>
            <textarea
              id="chronicConditions"
              rows={2}
              value={form.chronicConditions}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, chronicConditions: e.target.value }))
              }
            />
            <label htmlFor="currentMedications">Current Medications</label>
            <textarea
              id="currentMedications"
              rows={2}
              value={form.currentMedications}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, currentMedications: e.target.value }))
              }
            />
            <label htmlFor="emergencyContactName">Emergency Contact Name</label>
            <input
              id="emergencyContactName"
              value={form.emergencyContactName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, emergencyContactName: e.target.value }))
              }
            />
            <label htmlFor="emergencyContactPhone">Emergency Contact Phone</label>
            <input
              id="emergencyContactPhone"
              value={form.emergencyContactPhone}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, emergencyContactPhone: e.target.value }))
              }
            />
            <label htmlFor="emergencyContactRelation">Emergency Contact Relation</label>
            <input
              id="emergencyContactRelation"
              value={form.emergencyContactRelation}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, emergencyContactRelation: e.target.value }))
              }
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
