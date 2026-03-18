import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import type { Appointment, AppointmentStatus } from '../../types'
import { useDoctorAppointments } from './doctor-shared'

export function DoctorAppointmentsPage() {
  const appointmentsQuery = useDoctorAppointments()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | AppointmentStatus>('all')

  const filtered = useMemo(
    () =>
      (appointmentsQuery.data ?? []).filter((item) => {
        const fullName = item.patientSnapshot?.fullName?.trim() ?? ''
        const email = item.patientSnapshot?.email?.trim() ?? ''
        const text = `${fullName} ${email}`.toLowerCase()
        const matchesSearch = text.includes(search.toLowerCase())
        const matchesFilter = filter === 'all' || item.status === filter
        return matchesSearch && matchesFilter
      }),
    [appointmentsQuery.data, filter, search],
  )

  const statusClass = (status: AppointmentStatus) => {
    if (status === 'CONFIRMED' || status === 'CALLED') return 'status status-blue'
    if (status === 'IN_VISIT') return 'status status-yellow'
    if (status === 'EXAM_DONE' || status === 'CLOSED') return 'status status-green'
    if (status === 'CANCELLED') return 'status status-red'
    return 'status status-gray'
  }

  const getPatientLabel = (appointment: Appointment) => {
    const fullName = appointment.patientSnapshot?.fullName?.trim()
    const email = appointment.patientSnapshot?.email?.trim()
    if (fullName) return fullName
    if (email) return email
    return appointment.patientId
  }

  const getPatientEmail = (appointment: Appointment) => {
    const fullName = appointment.patientSnapshot?.fullName?.trim()
    const email = appointment.patientSnapshot?.email?.trim()
    if (fullName && email) return email
    return null
  }

  return (
    <div className="page doctor-page doctor-appointments-page">
      <div className="page-head">
        <h1>Appointments</h1>
        <p>Manage and advance appointment workflow with quick actions.</p>
      </div>
      <section className="card search-card">
        <Search size={16} />
        <input
          placeholder="Search by patient name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value as AppointmentStatus | 'all')}>
          <option value="all">All Status</option>
          <option value="REQUESTED">Requested</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CALLED">Called</option>
          <option value="IN_VISIT">In Visit</option>
          <option value="EXAM_DONE">Exam Done</option>
          <option value="CLOSED">Closed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </section>

      <section className="stack">
        <ul className="list">
          {filtered.map((appointment) => {
            const patientEmail = getPatientEmail(appointment)
            return (
              <li key={appointment.id}>
                <div>
                  <strong>{getPatientLabel(appointment)}</strong>
                  {patientEmail ? <p className="muted">{patientEmail}</p> : null}
                  <p>
                    <span className={statusClass(appointment.status)}>{appointment.status}</span>
                  </p>
                  <p className="muted">
                    {appointment.scheduledAt
                      ? new Date(appointment.scheduledAt).toLocaleString()
                      : 'Pending doctor schedule'}
                  </p>
                  <p className="muted">Appointment Ref: {appointment.id}</p>
                </div>
                <div className="actions">
                  <Link to={`/doctor/appointments/${appointment.id}`} className="quick-link">
                    View Details
                  </Link>
                </div>
              </li>
            )
          })}
          {filtered.length === 0 ? <li className="empty">No appointments found.</li> : null}
        </ul>
      </section>
    </div>
  )
}
