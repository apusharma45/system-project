import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api, getApiErrorMessage } from '../../lib/api'
import type { Appointment, UserSummary } from '../../types'

const cancellableStatuses = new Set(['REQUESTED', 'CONFIRMED'])

function formatDateTime(value?: string | null) {
  if (!value) return '-'
  return new Date(value).toLocaleString()
}

export function PatientAppointmentsPage() {
  const queryClient = useQueryClient()
  const [selectedDoctorId, setSelectedDoctorId] = useState('')
  const [preferredDateFrom, setPreferredDateFrom] = useState('')
  const [preferredDateTo, setPreferredDateTo] = useState('')
  const [preferredTimeNote, setPreferredTimeNote] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  const doctorsQuery = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => (await api.get<UserSummary[]>('/users/doctors')).data,
  })
  const appointmentsQuery = useQuery({
    queryKey: ['appointments', 'patient'],
    queryFn: async () => (await api.get<Appointment[]>('/appointments/me')).data,
  })

  const createAppointment = useMutation({
    mutationFn: async () => {
      const payload = {
        doctorId: selectedDoctorId,
        preferredDateFrom: preferredDateFrom || undefined,
        preferredDateTo: preferredDateTo || undefined,
        preferredTimeNote: preferredTimeNote.trim() || undefined,
        reason: reason.trim() || undefined,
      }
      return (await api.post<Appointment>('/appointments', payload)).data
    },
    onSuccess: () => {
      setError(null)
      setPreferredDateFrom('')
      setPreferredDateTo('')
      setPreferredTimeNote('')
      setReason('')
      void queryClient.invalidateQueries({ queryKey: ['appointments', 'patient'] })
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  })

  const cancelAppointment = useMutation({
    mutationFn: async (id: string) =>
      (await api.patch<Appointment>(`/appointments/${id}/cancel`)).data,
    onSuccess: () => {
      setError(null)
      void queryClient.invalidateQueries({ queryKey: ['appointments', 'patient'] })
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  })

  const loading = doctorsQuery.isLoading || appointmentsQuery.isLoading
  const queryErrorMessage = doctorsQuery.error
    ? getApiErrorMessage(doctorsQuery.error)
    : appointmentsQuery.error
      ? getApiErrorMessage(appointmentsQuery.error)
      : null
  const upcomingAppointments = useMemo(
    () => appointmentsQuery.data ?? [],
    [appointmentsQuery.data],
  )
  const statItems = useMemo(
    () => [
      { label: 'Available Doctors', value: String((doctorsQuery.data ?? []).length) },
      {
        label: 'Scheduled Visits',
        value: String(upcomingAppointments.filter((item) => Boolean(item.scheduledAt)).length),
      },
      {
        label: 'Pending Requests',
        value: String(
          upcomingAppointments.filter(
            (item) => !item.scheduledAt && item.status !== 'CANCELLED' && item.status !== 'CLOSED',
          ).length,
        ),
      },
      {
        label: 'Lab Follow-ups',
        value: String(upcomingAppointments.filter((item) => item.requiresLab).length),
      },
    ],
    [doctorsQuery.data, upcomingAppointments],
  )

  const onCreate = (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    if (!selectedDoctorId) {
      setError('Select doctor.')
      return
    }
    if (preferredTimeNote.trim() && !reason.trim()) {
      setError('Reason is required when preferred time is provided.')
      return
    }
    createAppointment.mutate()
  }

  return (
    <div className="page patient-page patient-appointments-page">
      <section className="patient-hero">
        <div className="page-head">
          <div>
            <p className="patient-eyebrow">Patient Dashboard</p>
            <h1>Appointments</h1>
            <p>Request appointments, monitor updates, and keep every doctor visit in one calm place.</p>
          </div>
          <div className="patient-hero-note">
            <strong>Care planning</strong>
            <span>Book a new visit and track every status change without leaving this page.</span>
          </div>
        </div>
        {!loading && !queryErrorMessage ? (
          <div className="patient-hero-stats">
            {statItems.map((item) => (
              <article key={item.label} className="patient-hero-stat">
                <p>{item.label}</p>
                <h3>{item.value}</h3>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      {error ? <p className="patient-feedback error">{error}</p> : null}
      {queryErrorMessage ? <p className="patient-feedback error">{queryErrorMessage}</p> : null}
      {loading ? <p className="patient-feedback info">Loading appointments...</p> : null}

      {!loading && !queryErrorMessage ? (
        <div className="grid two-col patient-main-grid">
          <section className="card patient-card">
            <div className="patient-card-head">
              <div>
                <p className="patient-kicker">New Request</p>
                <h3>Request Appointment</h3>
                <p className="muted">Choose a doctor, add timing preferences, and send a structured request.</p>
              </div>
              <span className="patient-chip soft">Form</span>
            </div>
            <form onSubmit={onCreate} className="stack patient-form">
              <label htmlFor="doctorId">Doctor</label>
              <select
                id="doctorId"
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
              >
                <option value="">Select doctor</option>
                {(doctorsQuery.data ?? []).map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.fullName ? `${doctor.fullName} (${doctor.email})` : doctor.email}
                    {doctor.specialization ? ` - ${doctor.specialization}` : ''}
                    {doctor.yearsOfExperience != null ? ` - ${doctor.yearsOfExperience}y exp` : ''}
                  </option>
                ))}
              </select>
              {selectedDoctorId ? (
                <p>
                  <Link
                    to={`/patient/doctors/${selectedDoctorId}`}
                    className="quick-link patient-action-link"
                  >
                    View Doctor Details
                  </Link>
                </p>
              ) : null}
              <label htmlFor="preferredDateFrom">Preferred From (optional)</label>
              <input
                id="preferredDateFrom"
                type="datetime-local"
                value={preferredDateFrom}
                onChange={(e) => setPreferredDateFrom(e.target.value)}
              />
              <label htmlFor="preferredDateTo">Preferred To (optional)</label>
              <input
                id="preferredDateTo"
                type="datetime-local"
                value={preferredDateTo}
                onChange={(e) => setPreferredDateTo(e.target.value)}
              />
              <label htmlFor="preferredTimeNote">Preferred Time (optional)</label>
              <input
                id="preferredTimeNote"
                type="text"
                value={preferredTimeNote}
                onChange={(e) => setPreferredTimeNote(e.target.value)}
                placeholder="e.g. Evening preferred"
              />
              <label htmlFor="reason">Reason</label>
              <textarea
                id="reason"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly describe the concern"
              />
              <button type="submit" disabled={createAppointment.isPending || loading}>
                {createAppointment.isPending ? 'Requesting...' : 'Send Request'}
              </button>
            </form>
          </section>

          <section className="card patient-card">
            <div className="patient-card-head">
              <div>
                <p className="patient-kicker">Appointment Timeline</p>
                <h3>My Appointments</h3>
                <p className="muted">Recent requests, scheduled visits, and lab-related follow-ups.</p>
              </div>
              <span className="patient-chip">{upcomingAppointments.length} total</span>
            </div>
            <ul className="list patient-list">
              {upcomingAppointments.length === 0 ? (
                <li className="empty">No appointments yet.</li>
              ) : null}
              {upcomingAppointments.map((appointment) => (
                <li key={appointment.id}>
                  <div className="patient-list-content">
                    <div className="patient-list-top">
                      <strong>
                        {appointment.scheduledAt
                          ? `Scheduled: ${new Date(appointment.scheduledAt).toLocaleString()}`
                          : 'Pending doctor schedule'}
                      </strong>
                      <span className="patient-chip soft">{appointment.status}</span>
                    </div>
                    <div className="patient-chip-row">
                      <span
                        className={`patient-chip ${
                          appointment.requiresLab
                            ? appointment.labFlowLocked
                              ? 'alert'
                              : 'success'
                            : 'neutral'
                        }`}
                      >
                        {appointment.requiresLab
                          ? appointment.labFlowLocked
                            ? 'Result pending'
                            : 'Test required'
                          : 'No test required'}
                      </span>
                    </div>
                    <p className="muted">
                      Doctor:{' '}
                      {appointment.doctorSnapshot?.fullName?.trim() ||
                        appointment.doctorSnapshot?.email?.trim() ||
                        'Not provided'}
                    </p>
                    {appointment.doctorSnapshot?.email ? (
                      <p className="muted">Email: {appointment.doctorSnapshot.email}</p>
                    ) : null}
                    <p className="muted">Status: {appointment.status}</p>
                    {!appointment.scheduledAt ? (
                      <>
                        <p className="muted">
                          Preferred: {formatDateTime(appointment.preferredDateFrom)}
                          {' -> '}
                          {formatDateTime(appointment.preferredDateTo)}
                        </p>
                        {appointment.preferredTimeNote ? (
                          <p className="muted">Preferred Time: {appointment.preferredTimeNote}</p>
                        ) : null}
                      </>
                    ) : null}
                    <div className="patient-link-row">
                      <Link
                        to={`/patient/appointments/${appointment.id}`}
                        className="quick-link patient-action-link"
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/patient/doctors/${appointment.doctorId}`}
                        className="quick-link patient-action-link"
                      >
                        View Doctor Details
                      </Link>
                    </div>
                  </div>
                  <div className="patient-side-actions">
                    {cancellableStatuses.has(appointment.status) ? (
                      <button
                        type="button"
                        onClick={() => cancelAppointment.mutate(appointment.id)}
                        disabled={cancelAppointment.isPending}
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="muted">
                        {appointment.status === 'CANCELLED'
                          ? 'Already cancelled'
                          : appointment.status === 'CLOSED'
                            ? 'Completed'
                            : 'Not cancellable'}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}
    </div>
  )
}
