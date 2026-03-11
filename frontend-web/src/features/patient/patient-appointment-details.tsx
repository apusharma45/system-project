import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../lib/api'
import type { Appointment, LabOrder, LabReport, Prescription } from '../../types'

function getOrderReports(order: LabOrder): LabReport[] {
  if (order.labReports?.length) {
    return order.labReports
  }
  if (order.latestReport) {
    return [order.latestReport]
  }
  if (order.labResult) {
    return [order.labResult]
  }
  return []
}

export function PatientAppointmentDetailsPage() {
  const { appointmentId = '' } = useParams()
  const appointmentsQuery = useQuery({
    queryKey: ['appointments', 'patient'],
    queryFn: async () => (await api.get<Appointment[]>('/appointments/me')).data,
  })
  const prescriptionsQuery = useQuery({
    queryKey: ['prescriptions', 'patient'],
    queryFn: async () => (await api.get<Prescription[]>('/prescriptions/me')).data,
  })
  const labsQuery = useQuery({
    queryKey: ['labs', 'patient'],
    queryFn: async () => (await api.get<LabOrder[]>('/labs/orders/me')).data,
  })

  const loading = appointmentsQuery.isLoading || prescriptionsQuery.isLoading || labsQuery.isLoading
  const appointment = useMemo(
    () => (appointmentsQuery.data ?? []).find((item) => item.id === appointmentId),
    [appointmentsQuery.data, appointmentId],
  )
  const appointmentPrescriptions = useMemo(
    () => (prescriptionsQuery.data ?? []).filter((item) => item.appointmentId === appointmentId),
    [prescriptionsQuery.data, appointmentId],
  )
  const appointmentLabOrders = useMemo(
    () => (labsQuery.data ?? []).filter((item) => item.appointmentId === appointmentId),
    [labsQuery.data, appointmentId],
  )
  const groupedReports = useMemo(
    () =>
      appointmentLabOrders
        .map((order) => ({
          order,
          reports: getOrderReports(order),
        }))
        .filter((item) => item.reports.length > 0),
    [appointmentLabOrders],
  )

  return (
    <div className="page">
      <div className="page-head">
        <h1>Appointment Details</h1>
        <p>Review doctor, prescriptions, lab orders, and reports for this appointment.</p>
      </div>

      {loading ? <p className="state">Loading appointment details...</p> : null}

      {!loading && !appointment ? (
        <section className="card">
          <h3>Appointment not found</h3>
          <p className="muted">This appointment is unavailable or does not belong to your account.</p>
          <Link to="/patient/appointments" className="quick-link">
            Back to appointments
          </Link>
        </section>
      ) : null}

      {!loading && appointment ? (
        <div className="stack">
          <section className="card">
            <h3>Overview</h3>
            <p>Status: {appointment.status}</p>
            <p className="muted">
              {appointment.scheduledAt
                ? `Scheduled: ${new Date(appointment.scheduledAt).toLocaleString()}`
                : 'Pending doctor schedule'}
            </p>
            <p className="muted">
              Preferred:{' '}
              {appointment.preferredDateFrom
                ? new Date(appointment.preferredDateFrom).toLocaleString()
                : '-'}
              {' -> '}
              {appointment.preferredDateTo ? new Date(appointment.preferredDateTo).toLocaleString() : '-'}
            </p>
            {appointment.preferredTimeNote ? (
              <p className="muted">Preferred Time: {appointment.preferredTimeNote}</p>
            ) : null}
            <p className="muted">Reason: {appointment.reason || 'Not provided'}</p>
          </section>

          <section className="card">
            <h3>Doctor</h3>
            <p>
              {appointment.doctorSnapshot?.fullName?.trim() ||
                appointment.doctorSnapshot?.email?.trim() ||
                'Not provided'}
            </p>
            <p className="muted">Email: {appointment.doctorSnapshot?.email || 'Not provided'}</p>
          </section>

          <section className="card">
            <h3>Prescriptions ({appointmentPrescriptions.length})</h3>
            <ul className="list">
              {appointmentPrescriptions.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>Prescription #{item.id}</strong>
                    <p>Status: {item.status}</p>
                    <p className="muted">Notes: {item.notes || 'Not provided'}</p>
                    <p className="muted">Diagnosis: {item.diagnosis || 'Not provided'}</p>
                  </div>
                  {item.documentUrl ? (
                    <a href={item.documentUrl} target="_blank" rel="noreferrer">
                      Open Document
                    </a>
                  ) : (
                    <span className="muted">No document</span>
                  )}
                </li>
              ))}
              {appointmentPrescriptions.length === 0 ? (
                <li className="empty">No prescriptions for this appointment.</li>
              ) : null}
            </ul>
          </section>

          <section className="card">
            <h3>Lab Orders ({appointmentLabOrders.length})</h3>
            <ul className="list">
              {appointmentLabOrders.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>Lab Order #{item.id}</strong>
                    <p>Status: {item.status}</p>
                    <p className="muted">Lab: {item.diagnosticSnapshot?.name || 'Not provided'}</p>
                    <p className="muted">Address: {item.diagnosticSnapshot?.address || 'Not provided'}</p>
                    <p className="muted">Phone: {item.diagnosticSnapshot?.phone || 'Not provided'}</p>
                    <div className="muted">
                      <strong>Tests</strong>
                      {item.tests?.length ? (
                        <ul>
                          {item.tests.map((test, index) => (
                            <li key={`${item.id}-test-${index}`}>
                              {test.title}: {test.description?.trim() || 'Not specified'}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No tests listed</p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
              {appointmentLabOrders.length === 0 ? (
                <li className="empty">No lab orders for this appointment.</li>
              ) : null}
            </ul>
          </section>

          <section className="card">
            <h3>Reports</h3>
            <ul className="list">
              {groupedReports.map(({ order, reports }) => (
                <li key={order.id}>
                  <div>
                    <strong>Lab Order #{order.id}</strong>
                    <p className="muted">Reports: {reports.length}</p>
                    <div className="stack">
                      {reports.map((report, index) => (
                        <a key={report.id} href={report.fileUrl} target="_blank" rel="noreferrer">
                          Open Report {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
              {groupedReports.length === 0 ? (
                <li className="empty">No reports uploaded for this appointment.</li>
              ) : null}
            </ul>
          </section>
        </div>
      ) : null}
    </div>
  )
}
