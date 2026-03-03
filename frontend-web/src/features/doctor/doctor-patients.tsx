import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useDoctorAppointments, useDoctorLabOrders, useDoctorPrescriptions } from './doctor-shared'

type PatientAggregate = {
  patientId: string
  appointmentCount: number
  latestAppointmentAt: string
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
      const existing = map.get(appointment.patientId)
      if (existing) {
        existing.appointmentCount += 1
        if (new Date(appointment.scheduledAt) > new Date(existing.latestAppointmentAt)) {
          existing.latestAppointmentAt = appointment.scheduledAt
        }
      } else {
        map.set(appointment.patientId, {
          patientId: appointment.patientId,
          appointmentCount: 1,
          latestAppointmentAt: appointment.scheduledAt,
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

    return [...map.values()].filter((item) =>
      `${item.patientId}`.toLowerCase().includes(search.toLowerCase()),
    )
  }, [appointmentsQuery.data, labsQuery.data, prescriptionsQuery.data, search])

  return (
    <div className="page">
      <div className="page-head">
        <h1>Patients</h1>
        <p>View and track patient treatment engagement from your doctor workflow.</p>
      </div>

      <section className="card search-card">
        <Search size={16} />
        <input
          placeholder="Search by patient ID"
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
          <article key={item.patientId} className="card">
            <div className="card-head">
              <div className="row-title">
                <div className="avatar">{item.patientId.slice(0, 2).toUpperCase()}</div>
                <div>
                  <strong>{item.patientId}</strong>
                  <p className="muted">Last seen {new Date(item.latestAppointmentAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="stack">
              <p>Appointments: {item.appointmentCount}</p>
              <p>Prescriptions: {item.prescriptionCount}</p>
              <p>Lab Orders: {item.labOrderCount}</p>
            </div>
          </article>
        ))}
        {rows.length === 0 ? <article className="card empty">No patient records found.</article> : null}
      </section>
    </div>
  )
}
