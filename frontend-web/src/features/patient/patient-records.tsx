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

  return (
    <div className="page">
      <div className="page-head">
        <h1>Records</h1>
        <p>View prescriptions, lab orders, and uploaded reports.</p>
      </div>

      <section className="card">
        <div className="actions">
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

      {loading ? <p className="state">Loading records...</p> : null}

      {activeTab === 'prescriptions' && !loading ? (
        <section className="card">
          <h3>Prescriptions</h3>
          <ul className="list">
            {(prescriptionsQuery.data ?? []).map((item) => (
              <li key={item.id}>
                <div>
                  <strong>Prescription #{item.id}</strong>
                  <p>Status: {item.status}</p>
                  <p className="muted">Appointment: #{item.appointmentId}</p>
                  <Link to={`/patient/appointments/${item.appointmentId}`} className="quick-link">
                    Open Appointment
                  </Link>
                  <p className="muted">Notes: {item.notes || 'Not provided'}</p>
                  <p className="muted">Doctor Advice: {item.notes || 'Not provided'}</p>
                  <p className="muted">Diagnosis: {item.diagnosis || 'Not provided'}</p>
                  <p className="muted">Instructions: {item.instructions || 'Not provided'}</p>
                  <div className="muted">
                    <strong>Medications</strong>
                    {item.medications?.length ? (
                      <ul>
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
                <div className="actions">
                  {item.documentUrl ? (
                    <a href={item.documentUrl} target="_blank" rel="noreferrer">
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
        <section className="card">
          <h3>Lab Orders</h3>
          <ul className="list">
            {(labsQuery.data ?? []).map((item) => (
              <li key={item.id}>
                <div>
                  <strong>Lab Order #{item.id}</strong>
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
                <div className="stack">
                  <Link to={`/patient/appointments/${item.appointmentId}`} className="quick-link">
                    Open Appointment
                  </Link>
                  {getOrderReports(item).length > 0 ? (
                    getOrderReports(item).map((report, index) => (
                      <a key={report.id} href={report.fileUrl} target="_blank" rel="noreferrer">
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
        <section className="card">
          <h3>Reports</h3>
          <ul className="list">
            {reports.map(({ order, reports: orderReports }) => (
              <li key={order.id}>
                <div>
                  <strong>Reports for Lab Order #{order.id}</strong>
                  <p className="muted">Appointment: #{order.appointmentId}</p>
                </div>
                <div className="stack">
                  <Link to={`/patient/appointments/${order.appointmentId}`} className="quick-link">
                    Open Appointment
                  </Link>
                  {orderReports.map((report, index) => (
                    <a key={report.id} href={report.fileUrl} target="_blank" rel="noreferrer">
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
