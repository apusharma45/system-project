import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDoctorAppointments, useDoctorLabOrders, useDoctorPrescriptions } from './doctor-shared'

type PatientAggregate = {
  patientId: string
  patientName: string
  patientEmail: string
  appointmentCount: number
  latestAppointmentAt: string | null
  prescriptionCount: number
  labOrderCount: number
}

export function DoctorPatientsPage() {
  const [search, setSearch] = useState('')
  const appointmentsQuery = useDoctorAppointments()
  const prescriptionsQuery = useDoctorPrescriptions()
  const labsQuery = useDoctorLabOrders()

  const rows = useMemo(() => {
    const map = new Map<string, PatientAggregate>()
    for (const appointment of appointmentsQuery.data ?? []) {
      const snapshot = appointment.patientSnapshot
      const patientName = snapshot?.fullName?.trim() || snapshot?.email?.trim() || 'Unknown patient'
      const patientEmail = snapshot?.email?.trim() || ''
      const existing = map.get(appointment.patientId)
      if (existing) {
        existing.appointmentCount += 1
        if (!existing.patientName || existing.patientName === 'Unknown patient') {
          existing.patientName = patientName
        }
        if (!existing.patientEmail && patientEmail) {
          existing.patientEmail = patientEmail
        }
        if (
          appointment.scheduledAt &&
          (!existing.latestAppointmentAt || new Date(appointment.scheduledAt) > new Date(existing.latestAppointmentAt))
        ) {
          existing.latestAppointmentAt = appointment.scheduledAt
        }
      } else {
        map.set(appointment.patientId, {
          patientId: appointment.patientId,
          patientName,
          patientEmail,
          appointmentCount: 1,
          latestAppointmentAt: appointment.scheduledAt ?? null,
          prescriptionCount: 0,
          labOrderCount: 0,
        })
      }
    }

    for (const prescription of prescriptionsQuery.data ?? []) {
      const patientId = prescription.appointment?.patientId
      if (!patientId) continue
      const item = map.get(patientId)
      if (item) item.prescriptionCount += 1
    }

    for (const order of labsQuery.data ?? []) {
      const patientId = order.appointment?.patientId
      if (!patientId) continue
      const item = map.get(patientId)
      if (item) item.labOrderCount += 1
    }

    const normalizedSearch = search.trim().toLowerCase()
    return [...map.values()].filter((item) => {
      if (!normalizedSearch) return true
      return (
        item.patientName.toLowerCase().includes(normalizedSearch) ||
        item.patientEmail.toLowerCase().includes(normalizedSearch)
      )
    })
  }, [appointmentsQuery.data, labsQuery.data, prescriptionsQuery.data, search])

  return (
    <div className="page doctor-page doctor-patients-page">
      <div className="page-head">
        <h1>Patients</h1>
        <p>View and track patient treatment engagement from your doctor workflow.</p>
      </div>

      <section className="card search-card">
        <Search size={16} />
        <input
          placeholder="Search by patient name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      <section className="kpi-grid kpi-three">
        <article className="kpi">
          <p>Total Patients</p>
          <h3>{rows.length}</h3>
        </article>
        <article className="kpi">
          <p>Total Prescriptions</p>
          <h3>{(prescriptionsQuery.data ?? []).length}</h3>
        </article>
        <article className="kpi">
          <p>Total Lab Orders</p>
          <h3>{(labsQuery.data ?? []).length}</h3>
        </article>
      </section>

      <section className="grid two-col">
        {rows.map((item) => (
          <article key={item.patientId} className="card patient-card">
            <Link
              to={`/doctor/patients/${item.patientId}/profile`}
              className="patient-card-top patient-profile-link"
              aria-label={`View profile for ${item.patientName}`}
            >
              <div className="avatar patient-avatar">{item.patientName.slice(0, 2).toUpperCase()}</div>
              <div className="patient-identity">
                <h3>{item.patientName}</h3>
                {item.patientEmail ? <p className="muted patient-email">{item.patientEmail}</p> : null}
              </div>
            </Link>

            <div className="patient-metrics">
              <div className="patient-metric">
                <span className="status status-blue">Appointments</span>
                <strong>{item.appointmentCount}</strong>
              </div>
              <div className="patient-metric">
                <span className="status status-green">Prescriptions</span>
                <strong>{item.prescriptionCount}</strong>
              </div>
              <div className="patient-metric">
                <span className="status status-yellow">Lab Orders</span>
                <strong>{item.labOrderCount}</strong>
              </div>
            </div>

            <p className="muted patient-meta">
              Last seen{' '}
              {item.latestAppointmentAt
                ? new Date(item.latestAppointmentAt).toLocaleString()
                : 'Pending doctor schedule'}
            </p>
          </article>
        ))}
        {rows.length === 0 ? <article className="card empty patient-empty">No patient records found.</article> : null}
      </section>
    </div>
  )
}
