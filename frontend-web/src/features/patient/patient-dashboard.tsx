import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { api } from '../../lib/api'
import type { AppNotification, Appointment } from '../../types'

export function PatientDashboard() {
  const appointmentsQuery = useQuery({
    queryKey: ['appointments', 'patient'],
    queryFn: async () => (await api.get<Appointment[]>('/appointments/me')).data,
  })
  const notificationsQuery = useQuery({
    queryKey: ['notifications', 'patient'],
    queryFn: async () => (await api.get<AppNotification[]>('/notifications/me')).data,
  })

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
  ]

  return (
    <div className="page">
      <div className="page-head">
        <h1>Patient Dashboard</h1>
        <p>Book visits, track appointment status, and receive realtime notifications.</p>
      </div>

      <section className="kpi-grid kpi-three">
        {statItems.map((item) => (
          <article key={item.label} className="kpi">
            <p>{item.label}</p>
            <h3>{item.value}</h3>
          </article>
        ))}
      </section>

      <section className="card">
        <h3>Quick Snapshot</h3>
        <p className="muted">
          Use the sidebar to manage appointments and notifications in dedicated pages.
        </p>
      </section>
    </div>
  )
}
