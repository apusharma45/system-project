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

function getPharmacyName(item: Prescription) {
  return (
    item.pharmacySnapshot?.name?.trim() ||
    item.pharmacySnapshot?.pharmacyName?.trim() ||
    item.pharmacySnapshot?.fullName?.trim() ||
    item.pharmacySnapshot?.email?.trim() ||
    'Not assigned'
  )
}

function getDocumentLabel(item: Prescription) {
  if (!item.documentUrl) return 'No document'
  return item.documentMimeType?.toLowerCase() === 'application/pdf'
    ? 'Download Prescription PDF'
    : 'Open Document'
}

function formatDateTime(value?: string | null) {
  if (!value) return '-'
  return new Date(value).toLocaleString()
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
  const statItems = appointment
    ? [
        { label: 'Status', value: appointment.status },
        { label: 'Prescriptions', value: String(appointmentPrescriptions.length) },
        { label: 'Lab Orders', value: String(appointmentLabOrders.length) },
        {
          label: 'Reports',
          value: String(groupedReports.reduce((sum, item) => sum + item.reports.length, 0)),
        },
      ]
    : []

  return (
    <div className="page patient-page patient-appointment-details-page">
      <section className="patient-hero">
        <div className="page-head">
          <div>
            <p className="patient-eyebrow">Visit Summary</p>
            <h1>Appointment Details</h1>
            <p>Review doctor notes, prescriptions, lab requests, and uploaded reports for this appointment.</p>
          </div>
          {appointment ? (
            <div className="patient-hero-note">
              <strong>Appointment #{appointment.id}</strong>
              <span>{appointment.scheduledAt ? formatDateTime(appointment.scheduledAt) : 'Pending doctor schedule'}</span>
            </div>
          ) : null}
        </div>
        {!loading && appointment ? (
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

      {loading ? <p className="patient-feedback info">Loading appointment details...</p> : null}

      {!loading && !appointment ? (
        <section className="card patient-card">
          <div className="patient-card-head">
            <div>
              <p className="patient-kicker">Unavailable</p>
              <h3>Appointment not found</h3>
              <p className="muted">This appointment is unavailable or does not belong to your account.</p>
            </div>
          </div>
          <Link to="/patient/appointments" className="quick-link patient-action-link">
            Back to appointments
          </Link>
        </section>
      ) : null}

      {!loading && appointment ? (
        <div className="stack">
          <section className="card patient-card">
            <div className="patient-card-head">
              <div>
                <p className="patient-kicker">Overview</p>
                <h3>Overview</h3>
              </div>
              <span className="patient-chip soft">{appointment.status}</span>
            </div>
            <div className="patient-summary-grid">
              <article className="patient-summary-item">
                <span>Scheduled</span>
                <strong>
                  {appointment.scheduledAt
                    ? new Date(appointment.scheduledAt).toLocaleString()
                    : 'Pending doctor schedule'}
                </strong>
              </article>
              <article className="patient-summary-item">
                <span>Preferred</span>
                <strong>
                  {formatDateTime(appointment.preferredDateFrom)}
                  {' -> '}
                  {formatDateTime(appointment.preferredDateTo)}
                </strong>
              </article>
              <article className="patient-summary-item">
                <span>Preferred Time</span>
                <strong>{appointment.preferredTimeNote || 'Not provided'}</strong>
              </article>
              <article className="patient-summary-item">
                <span>Reason</span>
                <strong>{appointment.reason || 'Not provided'}</strong>
              </article>
            </div>
          </section>

          <section className="card patient-card">
            <div className="patient-card-head">
              <div>
                <p className="patient-kicker">Assigned Doctor</p>
                <h3>Doctor</h3>
              </div>
            </div>
            <div className="patient-summary-grid patient-summary-grid-two">
              <article className="patient-summary-item">
                <span>Name</span>
                <strong>
                  {appointment.doctorSnapshot?.fullName?.trim() ||
                    appointment.doctorSnapshot?.email?.trim() ||
                    'Not provided'}
                </strong>
              </article>
              <article className="patient-summary-item">
                <span>Email</span>
                <strong>{appointment.doctorSnapshot?.email || 'Not provided'}</strong>
              </article>
            </div>
          </section>

          <section className="card patient-card">
            <div className="patient-card-head">
              <div>
                <p className="patient-kicker">Medications</p>
                <h3>Prescriptions ({appointmentPrescriptions.length})</h3>
              </div>
            </div>
            <ul className="list patient-list">
              {appointmentPrescriptions.map((item) => (
                <li key={item.id}>
                  <div className="patient-list-content">
                    <div className="patient-list-top">
                      <strong>Prescription #{item.id}</strong>
                      <span className="patient-chip soft">{item.status}</span>
                    </div>
                    <p className="muted">Status: {item.status}</p>
                    <p className="muted">Notes: {item.notes || 'Not provided'}</p>
                    <p className="muted">Doctor Advice: {item.notes || 'Not provided'}</p>
                    <p className="muted">Diagnosis: {item.diagnosis || 'Not provided'}</p>
                    <p className="muted">Instructions: {item.instructions || 'Not provided'}</p>
                    <div className="muted patient-rich-block">
                      <strong>Medications</strong>
                      {item.medications?.length ? (
                        <ul className="patient-bullet-list">
                          {item.medications.map((medication, index) => (
                            <li key={`${item.id}-med-${index}`}>
                              {medication.name}
                              {medication.dosage ? `, Dosage: ${medication.dosage}` : ''}
                              {medication.frequency ? `, Frequency: ${medication.frequency}` : ''}
                              {medication.duration ? `, Duration: ${medication.duration}` : ''}
                              {medication.route ? `, Route: ${medication.route}` : ''}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No medications listed</p>
                      )}
                    </div>
                    <p className="muted">Pharmacy: {getPharmacyName(item)}</p>
                    <p className="muted">
                      Address: {item.pharmacySnapshot?.address?.trim() || 'Not provided'}
                    </p>
                    <p className="muted">
                      Phone: {item.pharmacySnapshot?.phone?.trim() || 'Not provided'}
                    </p>
                  </div>
                  <div className="patient-side-actions">
                    {item.documentUrl ? (
                      <a
                        href={item.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="patient-action-link"
                      >
                        {getDocumentLabel(item)}
                      </a>
                    ) : (
                      <span className="muted">No document</span>
                    )}
                  </div>
                </li>
              ))}
              {appointmentPrescriptions.length === 0 ? (
                <li className="empty">No prescriptions for this appointment.</li>
              ) : null}
            </ul>
          </section>

          <section className="card patient-card">
            <div className="patient-card-head">
              <div>
                <p className="patient-kicker">Diagnostics</p>
                <h3>Lab Orders ({appointmentLabOrders.length})</h3>
              </div>
            </div>
            <ul className="list patient-list">
              {appointmentLabOrders.map((item) => (
                <li key={item.id}>
                  <div className="patient-list-content">
                    <div className="patient-list-top">
                      <strong>Lab Order #{item.id}</strong>
                      <span className="patient-chip soft">{item.status}</span>
                    </div>
                    <p className="muted">Status: {item.status}</p>
                    <p className="muted">Lab: {item.diagnosticSnapshot?.name || 'Not provided'}</p>
                    <p className="muted">
                      Address: {item.diagnosticSnapshot?.address || 'Not provided'}
                    </p>
                    <p className="muted">
                      Phone: {item.diagnosticSnapshot?.phone || 'Not provided'}
                    </p>
                    <div className="muted patient-rich-block">
                      <strong>Tests</strong>
                      {item.tests?.length ? (
                        <ul className="patient-bullet-list">
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

          <section className="card patient-card">
            <div className="patient-card-head">
              <div>
                <p className="patient-kicker">Uploaded Files</p>
                <h3>Reports</h3>
              </div>
            </div>
            <ul className="list patient-list">
              {groupedReports.map(({ order, reports }) => (
                <li key={order.id}>
                  <div className="patient-list-content">
                    <strong>Lab Order #{order.id}</strong>
                    <p className="muted">Reports: {reports.length}</p>
                  </div>
                  <div className="stack patient-link-stack">
                    {reports.map((report, index) => (
                      <a
                        key={report.id}
                        href={report.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="patient-action-link"
                      >
                        Open Report {index + 1}
                      </a>
                    ))}
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
