import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { Socket } from 'socket.io-client'
import { api, getApiErrorMessage } from '../../lib/api'
import { connectNotificationsSocket } from '../../lib/socket'
import { useAuth } from '../auth/auth-context'
import { NotificationsPanel } from '../notifications/notifications-panel'
import type { AppNotification, Appointment, UserSummary } from '../../types'

const cancellableStatuses = new Set(['REQUESTED', 'CONFIRMED'])

export function PatientDashboard() {
  const queryClient = useQueryClient()
  const { token } = useAuth()
  const [selectedDoctorId, setSelectedDoctorId] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [realtimeEvents, setRealtimeEvents] = useState<string[]>([])

  const doctorsQuery = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => (await api.get<UserSummary[]>('/users/doctors')).data,
  })
  const appointmentsQuery = useQuery({
    queryKey: ['appointments', 'patient'],
    queryFn: async () => (await api.get<Appointment[]>('/appointments/me')).data,
  })
  const notificationsQuery = useQuery({
    queryKey: ['notifications', 'patient'],
    queryFn: async () => (await api.get<AppNotification[]>('/notifications/me')).data,
  })

  useEffect(() => {
    if (!token) return
    const socket: Socket = connectNotificationsSocket(token)
    const onEvent = (eventName: string) => {
      setRealtimeEvents((prev) => [eventName, ...prev].slice(0, 10))
      void queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
    socket.on('appointment.called', () => onEvent('appointment.called'))
    socket.on('lab.result_uploaded', () => onEvent('lab.result_uploaded'))
    socket.on('prescription.ready', () => onEvent('prescription.ready'))
    return () => {
      socket.disconnect()
    }
  }, [queryClient, token])

  const createAppointment = useMutation({
    mutationFn: async () =>
      (
        await api.post<Appointment>('/appointments', {
          doctorId: selectedDoctorId,
          scheduledAt,
        })
      ).data,
    onSuccess: () => {
      setError(null)
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

  const markRead = useMutation({
    mutationFn: async (id: string) => (await api.patch(`/notifications/${id}/read`)).data,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })
  const markAllRead = useMutation({
    mutationFn: async () => (await api.patch('/notifications/read-all')).data,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const loading =
    doctorsQuery.isLoading || appointmentsQuery.isLoading || notificationsQuery.isLoading

  const upcomingAppointments = useMemo(
    () => appointmentsQuery.data ?? [],
    [appointmentsQuery.data],
  )
  const statItems = [
    { label: 'Upcoming Appointments', value: String(upcomingAppointments.length) },
    {
      label: 'Unread Notifications',
      value: String((notificationsQuery.data ?? []).filter((item) => !item.read).length),
    },
    { label: 'Realtime Events', value: String(realtimeEvents.length) },
  ]

  const onCreate = (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    if (!selectedDoctorId || !scheduledAt) {
      setError('Select a doctor and schedule time.')
      return
    }
    createAppointment.mutate()
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Patient Dashboard</h1>
        <p>Book visits, track appointment status, and receive realtime notifications.</p>
      </div>
      {error ? <p className="error">{error}</p> : null}

      <section className="kpi-grid kpi-three">
        {statItems.map((item) => (
          <article key={item.label} className="kpi">
            <p>{item.label}</p>
            <h3>{item.value}</h3>
          </article>
        ))}
      </section>

      <div className="grid two-col" id="appointments">
        <section className="card">
          <h3>Book Appointment</h3>
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
                  {doctor.email}
                </option>
              ))}
            </select>
            <label htmlFor="scheduledAt">Schedule</label>
            <input
              id="scheduledAt"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
            <button type="submit" disabled={createAppointment.isPending || loading}>
              {createAppointment.isPending ? 'Booking...' : 'Book'}
            </button>
          </form>
        </section>

        <section className="card">
          <h3>My Appointments</h3>
          <ul className="list">
            {upcomingAppointments.length === 0 ? <li className="empty">No appointments yet.</li> : null}
            {upcomingAppointments.map((appointment) => (
              <li key={appointment.id}>
                <div>
                  <strong>{new Date(appointment.scheduledAt).toLocaleString()}</strong>
                  <p>Status: {appointment.status}</p>
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
                  <span className="muted">Not cancellable</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div id="notifications">
        <NotificationsPanel
          title="Patient Notifications"
          notifications={notificationsQuery.data ?? []}
          realtimeEvents={realtimeEvents}
          onMarkRead={(id) => markRead.mutate(id)}
          onMarkAllRead={() => markAllRead.mutate()}
          busy={markRead.isPending || markAllRead.isPending}
        />
      </div>
    </div>
  )
}
