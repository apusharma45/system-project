import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api, getApiErrorMessage } from '../../lib/api'
import type { Appointment, UserSummary } from '../../types'

const cancellableStatuses = new Set(['REQUESTED', 'CONFIRMED'])

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
    <div className="page">
      <div className="page-head">
        <h1>Appointments</h1>
        <p>Request appointments and track your status updates.</p>
      </div>
      {error ? <p className="error">{error}</p> : null}
      {queryErrorMessage ? <p className="error">{queryErrorMessage}</p> : null}
      {loading ? <p className="state">Loading appointments...</p> : null}

      {!loading && !queryErrorMessage ? (
        <div className="grid two-col">
          <section className="card">
            <h3>Request Appointment</h3>
            <form onSubmit={onCreate} className="stack">
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
                  </option>
                ))}
              </select>
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

          <section className="card">
            <h3>My Appointments</h3>
            <ul className="list">
              {upcomingAppointments.length === 0 ? (
                <li className="empty">No appointments yet.</li>
              ) : null}
              {upcomingAppointments.map((appointment) => (
                <li key={appointment.id}>
                  <div>
                    <strong>
                      {appointment.scheduledAt
                        ? `Scheduled: ${new Date(appointment.scheduledAt).toLocaleString()}`
                        : 'Pending doctor schedule'}
                    </strong>
                    <p>Status: {appointment.status}</p>
                    <p className="muted">
                      Doctor:{' '}
                      {appointment.doctorSnapshot?.fullName?.trim() ||
                        appointment.doctorSnapshot?.email?.trim() ||
                        'Not provided'}
                    </p>
                    {appointment.doctorSnapshot?.email ? (
                      <p className="muted">Email: {appointment.doctorSnapshot.email}</p>
                    ) : null}
                    <p className="muted">
                      {appointment.requiresLab
                        ? appointment.labFlowLocked
                          ? 'Result pending'
                          : 'Test required'
                        : 'No test required'}
                    </p>
                    {!appointment.scheduledAt ? (
                      <>
                        <p className="muted">
                          Preferred:{' '}
                          {appointment.preferredDateFrom
                            ? new Date(appointment.preferredDateFrom).toLocaleString()
                            : '-'}
                          {' -> '}
                          {appointment.preferredDateTo
                            ? new Date(appointment.preferredDateTo).toLocaleString()
                            : '-'}
                        </p>
                        {appointment.preferredTimeNote ? (
                          <p className="muted">Preferred Time: {appointment.preferredTimeNote}</p>
                        ) : null}
                      </>
                    ) : null}
                    <p>
                      <Link to={`/patient/appointments/${appointment.id}`} className="quick-link">
                        View Details
                      </Link>
                    </p>
                  </div>
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
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}
    </div>
  )
}
