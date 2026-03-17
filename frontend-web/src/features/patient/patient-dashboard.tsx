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
    <div className="page patient-page patient-dashboard-page">
      <section className="patient-hero">
        <div className="page-head">
          <div>
            <p className="patient-eyebrow">Patient Dashboard</p>
            <h1>Patient Dashboard</h1>
            <p>Book visits, track appointment status, and receive realtime notifications.</p>
          </div>
          <div className="patient-hero-note">
            <strong>Daily snapshot</strong>
            <span>Your overview is designed to match the rest of the patient portal.</span>
          </div>
        </div>
      </section>

      <section className="kpi-grid kpi-three patient-kpi-grid">
        {statItems.map((item) => (
          <article key={item.label} className="kpi patient-kpi">
            <p>{item.label}</p>
            <h3>{item.value}</h3>
          </article>
        ))}
      </section>

      <section className="card patient-card">
        <div className="patient-card-head">
          <div>
            <p className="patient-kicker">Orientation</p>
            <h3>Quick Snapshot</h3>
          </div>
        </div>
        <p className="muted">
          Use the sidebar to manage appointments and notifications in dedicated pages.
        </p>
      </section>
    </div>
  )
}
