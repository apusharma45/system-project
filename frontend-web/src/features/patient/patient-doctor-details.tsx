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

  return (
    <div className="page">
      <div className="page-head">
        <h1>Doctor Details</h1>
        <p>Review specialization, clinic information, and available time slots.</p>
      </div>

      {detailsQuery.isLoading ? <p className="state">Loading doctor details...</p> : null}
      {detailsQuery.isError ? <p className="error">Failed to load doctor details.</p> : null}

      {!detailsQuery.isLoading && !detailsQuery.isError && !doctor ? (
        <section className="card">
          <h3>Doctor not found</h3>
          <p className="muted">This doctor is unavailable or no longer accessible.</p>
          <Link to="/patient/appointments" className="quick-link">
            Back to appointments
          </Link>
        </section>
      ) : null}

      {doctor ? (
        <div className="stack">
          <section className="card">
            <h3>
              {doctor.fullName?.trim() || doctor.email}
            </h3>
            <p className="muted">Email: {doctor.email}</p>
            <p className="muted">Specialization: {doctor.specialization || 'Not provided'}</p>
            <p className="muted">
              Experience:{' '}
              {doctor.yearsOfExperience != null ? `${doctor.yearsOfExperience} years` : 'Not provided'}
            </p>
          </section>

          <section className="card">
            <h3>Qualifications</h3>
            {doctor.degrees?.length ? (
              <ul className="list">
                {doctor.degrees.map((degree, index) => (
                  <li key={`${doctor.id}-degree-${index}`}>{degree}</li>
                ))}
              </ul>
            ) : (
              <p className="muted">No qualification details available.</p>
            )}
          </section>

          <section className="card">
            <h3>About</h3>
            <p className="muted">{doctor.about || 'No about information provided yet.'}</p>
          </section>

          <section className="card">
            <h3>Clinic Information</h3>
            <p className="muted">Clinic: {doctor.clinicName || 'Not provided'}</p>
            <p className="muted">Address: {doctor.clinicAddress || doctor.address || 'Not provided'}</p>
            <p className="muted">Phone: {doctor.clinicPhone || doctor.phone || 'Not provided'}</p>
          </section>

          <section className="card">
            <h3>Available Time Slots</h3>
            {doctor.availableTimeSlots?.length ? (
              <ul className="list">
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
