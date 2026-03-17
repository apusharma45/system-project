import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { api, getApiErrorMessage } from '../../lib/api'
import type { MyPatientProfileResponse } from '../../types'
import { useAuth } from '../auth/auth-context'
import { ProfileAvatarEditor } from '../profile/profile-avatar-editor'

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
    <div className="page patient-page patient-profile-page">
      <section className="patient-hero">
        <div className="page-head">
          <div>
            <p className="patient-eyebrow">Personal Details</p>
            <h1>Profile</h1>
            <p>Manage your personal details, medical notes, and emergency contact information.</p>
          </div>
          {patient ? (
            <div className="patient-hero-note">
              <strong>{patient.fullName || patient.email}</strong>
              <span>{patient.email}</span>
            </div>
          ) : null}
        </div>
      </section>
      {status ? <p className="patient-feedback success">{status}</p> : null}
      {error ? <p className="patient-feedback error">{error}</p> : null}
      {profileQuery.isLoading ? <p className="patient-feedback info">Loading profile...</p> : null}
      {profileQuery.isError ? <p className="patient-feedback error">Failed to load profile.</p> : null}

      {patient ? (
        <section className="card patient-card patient-profile-card">
          <div className="patient-card-head">
            <div>
              <p className="patient-kicker">Health Identity</p>
              <h3>Patient Profile</h3>
              <p className="muted">Keep this information current so appointments and follow-ups stay accurate.</p>
            </div>
          </div>

          <div className="patient-summary-grid patient-profile-summary">
            <article className="patient-summary-item">
              <span>Patient ID</span>
              <strong>{patient.id}</strong>
            </article>
            <article className="patient-summary-item">
              <span>Role</span>
              <strong>{patient.role}</strong>
            </article>
            <article className="patient-summary-item">
              <span>Date of Birth</span>
              <strong>{formatDateOnly(patient.profile?.dateOfBirth)}</strong>
            </article>
            <article className="patient-summary-item">
              <span>Gender</span>
              <strong>{patient.profile?.gender ?? 'Not provided'}</strong>
            </article>
          </div>

          <ProfileAvatarEditor
            fullName={patient.fullName}
            avatarUrl={patient.avatarUrl}
            queryKey={['patient-profile', 'me']}
            refreshUser={refreshUser}
          />

          <form onSubmit={onSubmit} className="stack patient-form patient-profile-form">
            <div className="patient-form-section">
              <div className="patient-form-section-head">
                <h4>Account</h4>
                <p className="muted">Your core account and contact details.</p>
              </div>

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
            </div>

            <div className="patient-form-section">
              <div className="patient-form-section-head">
                <h4>Medical Notes</h4>
                <p className="muted">Information that can help with safer care decisions.</p>
              </div>

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
            </div>

            <div className="patient-form-section">
              <div className="patient-form-section-head">
                <h4>Emergency Contact</h4>
                <p className="muted">Who providers should reach if urgent coordination is needed.</p>
              </div>

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
            </div>

            <button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </section>
      ) : null}
    </div>
  )
}
