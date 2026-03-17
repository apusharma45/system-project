import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../../lib/api'
import type { LabOrder, LabReport, Prescription } from '../../types'

type RecordsTab = 'prescriptions' | 'labs' | 'reports'

function getOrderReports(order: LabOrder): LabReport[] {
  if (order.labReports?.length) return order.labReports
  if (order.latestReport) return [order.latestReport]
  if (order.labResult) return [order.labResult]
  return []
}

function getInitialTab(value: string | null): RecordsTab {
  if (value === 'labs' || value === 'reports') return value
  return 'prescriptions'
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

export function PatientRecordsPage() {
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<RecordsTab>(getInitialTab(searchParams.get('tab')))

  const prescriptionsQuery = useQuery({
    queryKey: ['prescriptions', 'patient'],
    queryFn: async () => (await api.get<Prescription[]>('/prescriptions/me')).data,
  })
  const labsQuery = useQuery({
    queryKey: ['labs', 'patient'],
    queryFn: async () => (await api.get<LabOrder[]>('/labs/orders/me')).data,
  })

  const reports = useMemo(() => {
    return (labsQuery.data ?? [])
      .map((item) => ({
        order: item,
        reports: getOrderReports(item),
      }))
      .filter((item) => item.reports.length > 0)
  }, [labsQuery.data])
  const totalReportCount = useMemo(
    () => reports.reduce((sum, item) => sum + item.reports.length, 0),
    [reports],
  )
  const loading = prescriptionsQuery.isLoading || labsQuery.isLoading
  const statItems = [
    { label: 'Prescriptions', value: String((prescriptionsQuery.data ?? []).length) },
    { label: 'Lab Orders', value: String((labsQuery.data ?? []).length) },
    { label: 'Reports', value: String(totalReportCount) },
  ]

  return (
    <div className="page patient-page patient-records-page">
      <section className="patient-hero">
        <div className="page-head">
          <div>
            <p className="patient-eyebrow">Medical Library</p>
            <h1>Records</h1>
            <p>View prescriptions, lab orders, and uploaded reports in a single consistent workspace.</p>
          </div>
          <div className="patient-hero-note">
            <strong>Organized for follow-up</strong>
            <span>Switch tabs to move between medication, diagnostics, and reports without leaving the page.</span>
          </div>
        </div>
        {!loading ? (
          <div className="patient-hero-stats patient-hero-stats-three">
            {statItems.map((item) => (
              <article key={item.label} className="patient-hero-stat">
                <p>{item.label}</p>
                <h3>{item.value}</h3>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section className="card patient-card">
        <div className="actions patient-tabs">
          <button
            type="button"
            className={activeTab === 'prescriptions' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('prescriptions')}
          >
            Prescriptions ({(prescriptionsQuery.data ?? []).length})
          </button>
          <button
            type="button"
            className={activeTab === 'labs' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('labs')}
          >
            Lab Orders ({(labsQuery.data ?? []).length})
          </button>
          <button
            type="button"
            className={activeTab === 'reports' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('reports')}
          >
            Reports ({totalReportCount})
          </button>
        </div>
      </section>

      {loading ? <p className="patient-feedback info">Loading records...</p> : null}

      {activeTab === 'prescriptions' && !loading ? (
        <section className="card patient-card">
          <div className="patient-card-head">
            <div>
              <p className="patient-kicker">Medication History</p>
              <h3>Prescriptions</h3>
            </div>
          </div>
          <ul className="list patient-list">
            {(prescriptionsQuery.data ?? []).map((item) => (
              <li key={item.id}>
                <div className="patient-list-content">
                  <div className="patient-list-top">
                    <strong>Prescription #{item.id}</strong>
                    <span className="patient-chip soft">{item.status}</span>
                  </div>
                  <p>Status: {item.status}</p>
                  <p className="muted">Appointment: #{item.appointmentId}</p>
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
                  <div className="patient-link-row">
                    <Link
                      to={`/patient/appointments/${item.appointmentId}`}
                      className="quick-link patient-action-link"
                    >
                      Open Appointment
                    </Link>
                  </div>
                </div>
                <div className="actions patient-side-actions">
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
            {(prescriptionsQuery.data ?? []).length === 0 ? (
              <li className="empty">No prescriptions found.</li>
            ) : null}
          </ul>
        </section>
      ) : null}

      {activeTab === 'labs' && !loading ? (
        <section className="card patient-card">
          <div className="patient-card-head">
            <div>
              <p className="patient-kicker">Diagnostics</p>
              <h3>Lab Orders</h3>
            </div>
          </div>
          <ul className="list patient-list">
            {(labsQuery.data ?? []).map((item) => (
              <li key={item.id}>
                <div className="patient-list-content">
                  <div className="patient-list-top">
                    <strong>Lab Order #{item.id}</strong>
                    <span className="patient-chip soft">{item.status}</span>
                  </div>
                  <p>Status: {item.status}</p>
                  <p className="muted">Appointment: #{item.appointmentId}</p>
                  <p className="muted">
                    Lab: {item.diagnosticSnapshot?.name || 'Not provided'}
                  </p>
                  <p className="muted">
                    Address: {item.diagnosticSnapshot?.address?.trim() || 'Not provided'}
                  </p>
                  <p className="muted">
                    Phone: {item.diagnosticSnapshot?.phone?.trim() || 'Not provided'}
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
                <div className="stack patient-link-stack">
                  <Link
                    to={`/patient/appointments/${item.appointmentId}`}
                    className="quick-link patient-action-link"
                  >
                    Open Appointment
                  </Link>
                  {getOrderReports(item).length > 0 ? (
                    getOrderReports(item).map((report, index) => (
                      <a
                        key={report.id}
                        href={report.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="patient-action-link"
                      >
                        View Report {index + 1}
                      </a>
                    ))
                  ) : (
                    <span className="muted">Report pending</span>
                  )}
                </div>
              </li>
            ))}
            {(labsQuery.data ?? []).length === 0 ? (
              <li className="empty">No lab orders found.</li>
            ) : null}
          </ul>
        </section>
      ) : null}

      {activeTab === 'reports' && !loading ? (
        <section className="card patient-card">
          <div className="patient-card-head">
            <div>
              <p className="patient-kicker">Uploaded Results</p>
              <h3>Reports</h3>
            </div>
          </div>
          <ul className="list patient-list">
            {reports.map(({ order, reports: orderReports }) => (
              <li key={order.id}>
                <div className="patient-list-content">
                  <strong>Reports for Lab Order #{order.id}</strong>
                  <p className="muted">Appointment: #{order.appointmentId}</p>
                </div>
                <div className="stack patient-link-stack">
                  <Link
                    to={`/patient/appointments/${order.appointmentId}`}
                    className="quick-link patient-action-link"
                  >
                    Open Appointment
                  </Link>
                  {orderReports.map((report, index) => (
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
            {reports.length === 0 ? <li className="empty">No reports uploaded yet.</li> : null}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
