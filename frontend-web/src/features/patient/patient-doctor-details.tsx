import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../lib/api'
import type { DoctorAvailabilitySlot, PatientDoctorDetailsResponse } from '../../types'

function formatSlot(slot: DoctorAvailabilitySlot) {
  return `${slot.day}: ${slot.startTime} - ${slot.endTime}`
}

export function PatientDoctorDetailsPage() {
  const { doctorId = '' } = useParams()

  const detailsQuery = useQuery({
    queryKey: ['doctor', 'patient', doctorId],
    queryFn: async () => (await api.get<PatientDoctorDetailsResponse>(`/users/doctors/${doctorId}`)).data,
    enabled: Boolean(doctorId),
  })

  const doctor = detailsQuery.data?.doctor
  const statItems = doctor
    ? [
        { label: 'Specialization', value: doctor.specialization || 'Not provided' },
        {
          label: 'Experience',
          value: doctor.yearsOfExperience != null ? `${doctor.yearsOfExperience} years` : 'Not provided',
        },
        {
          label: 'Open Slots',
          value: String(doctor.availableTimeSlots?.length ?? 0),
        },
      ]
    : []

  return (
    <div className="page patient-page patient-doctor-details-page">
      <section className="patient-hero">
        <div className="page-head">
          <div>
            <p className="patient-eyebrow">Provider Profile</p>
            <h1>Doctor Details</h1>
            <p>Review specialization, clinic information, qualifications, and available time slots.</p>
          </div>
          {doctor ? (
            <div className="patient-hero-note">
              <strong>{doctor.fullName?.trim() || doctor.email}</strong>
              <span>{doctor.email}</span>
            </div>
          ) : null}
        </div>
        {!detailsQuery.isLoading && !detailsQuery.isError && doctor ? (
          <div className="patient-hero-stats patient-hero-stats-three">
            {statItems.map((item) => (
              <article key={item.label} className="patient-hero-stat">
                <p>{item.label}</p>
                <h3>{item.value}</h3>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      {detailsQuery.isLoading ? <p className="patient-feedback info">Loading doctor details...</p> : null}
      {detailsQuery.isError ? <p className="patient-feedback error">Failed to load doctor details.</p> : null}

      {!detailsQuery.isLoading && !detailsQuery.isError && !doctor ? (
        <section className="card patient-card">
          <div className="patient-card-head">
            <div>
              <p className="patient-kicker">Unavailable</p>
              <h3>Doctor not found</h3>
              <p className="muted">This doctor is unavailable or no longer accessible.</p>
            </div>
          </div>
          <Link to="/patient/appointments" className="quick-link patient-action-link">
            Back to appointments
          </Link>
        </section>
      ) : null}

      {doctor ? (
        <div className="stack">
          <section className="card patient-card">
            <div className="patient-card-head">
              <div>
                <p className="patient-kicker">Overview</p>
                <h3>{doctor.fullName?.trim() || doctor.email}</h3>
              </div>
            </div>
            <div className="patient-summary-grid patient-summary-grid-two">
              <article className="patient-summary-item">
                <span>Email</span>
                <strong>{doctor.email}</strong>
              </article>
              <article className="patient-summary-item">
                <span>Specialization</span>
                <strong>{doctor.specialization || 'Not provided'}</strong>
              </article>
              <article className="patient-summary-item">
                <span>Experience</span>
                <strong>
                  {doctor.yearsOfExperience != null ? `${doctor.yearsOfExperience} years` : 'Not provided'}
                </strong>
              </article>
            </div>
            <p className="muted">Email: {doctor.email}</p>
            <p className="muted">Specialization: {doctor.specialization || 'Not provided'}</p>
            <p className="muted">
              Experience:{' '}
              {doctor.yearsOfExperience != null ? `${doctor.yearsOfExperience} years` : 'Not provided'}
            </p>
          </section>

          <section className="card patient-card">
            <div className="patient-card-head">
              <div>
                <p className="patient-kicker">Academic Background</p>
                <h3>Qualifications</h3>
              </div>
            </div>
            {doctor.degrees?.length ? (
              <ul className="list patient-list">
                {doctor.degrees.map((degree, index) => (
                  <li key={`${doctor.id}-degree-${index}`}>{degree}</li>
                ))}
              </ul>
            ) : (
              <p className="muted">No qualification details available.</p>
            )}
          </section>

          <section className="card patient-card">
            <div className="patient-card-head">
              <div>
                <p className="patient-kicker">Doctor Bio</p>
                <h3>About</h3>
              </div>
            </div>
            <p className="muted">{doctor.about || 'No about information provided yet.'}</p>
          </section>

          <section className="card patient-card">
            <div className="patient-card-head">
              <div>
                <p className="patient-kicker">Practice Details</p>
                <h3>Clinic Information</h3>
              </div>
            </div>
            <div className="patient-summary-grid patient-summary-grid-two">
              <article className="patient-summary-item">
                <span>Clinic</span>
                <strong>{doctor.clinicName || 'Not provided'}</strong>
              </article>
              <article className="patient-summary-item">
                <span>Phone</span>
                <strong>{doctor.clinicPhone || doctor.phone || 'Not provided'}</strong>
              </article>
            </div>
            <p className="muted">Clinic: {doctor.clinicName || 'Not provided'}</p>
            <p className="muted">Address: {doctor.clinicAddress || doctor.address || 'Not provided'}</p>
            <p className="muted">Phone: {doctor.clinicPhone || doctor.phone || 'Not provided'}</p>
          </section>

          <section className="card patient-card">
            <div className="patient-card-head">
              <div>
                <p className="patient-kicker">Availability</p>
                <h3>Available Time Slots</h3>
              </div>
            </div>
            {doctor.availableTimeSlots?.length ? (
              <ul className="list patient-list">
                {doctor.availableTimeSlots.map((slot, index) => (
                  <li key={`${doctor.id}-slot-${index}`}>{formatSlot(slot)}</li>
                ))}
              </ul>
            ) : (
              <p className="muted">No available time slots shared yet.</p>
            )}
          </section>
        </div>
      ) : null}
    </div>
  )
}
