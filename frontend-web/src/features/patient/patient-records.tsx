import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { api } from '../../lib/api'
import type { LabOrder, Prescription } from '../../types'

type RecordsTab = 'prescriptions' | 'labs' | 'reports'

function getInitialTab(value: string | null): RecordsTab {
  if (value === 'labs' || value === 'reports') return value
  return 'prescriptions'
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

  const reports = useMemo(
    () => (labsQuery.data ?? []).filter((item) => item.labResult?.fileUrl),
    [labsQuery.data],
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
            Reports ({reports.length})
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
                  <p className="muted">Notes: {item.notes || 'Not provided'}</p>
                  <p className="muted">Diagnosis: {item.diagnosis || 'Not provided'}</p>
                  <p className="muted">Instructions: {item.instructions || 'Not provided'}</p>
                </div>
                <div className="actions">
                  {item.documentUrl ? (
                    <a href={item.documentUrl} target="_blank" rel="noreferrer">
                      Open Document
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
                    Tests:{' '}
                    {item.tests?.length
                      ? item.tests.map((test) => test.title).join(', ')
                      : 'No tests listed'}
                  </p>
                </div>
                {item.labResult?.fileUrl ? (
                  <a href={item.labResult.fileUrl} target="_blank" rel="noreferrer">
                    View Report
                  </a>
                ) : (
                  <span className="muted">Report pending</span>
                )}
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
            {reports.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>Report for Lab Order #{item.id}</strong>
                  <p className="muted">Appointment: #{item.appointmentId}</p>
                </div>
                <a href={item.labResult!.fileUrl} target="_blank" rel="noreferrer">
                  Open Report
                </a>
              </li>
            ))}
            {reports.length === 0 ? <li className="empty">No reports uploaded yet.</li> : null}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
