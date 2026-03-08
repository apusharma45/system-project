import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { CheckCircle2, Clock3, FlaskConical, Plus, Trash2 } from 'lucide-react'
import { api, getApiErrorMessage } from '../../lib/api'
import type { LabOrder, LabTestItem } from '../../types'
import { useDoctorAppointments, useDoctorDiagnostics, useDoctorLabOrders } from './doctor-shared'

type LabTestDraft = {
  title: string
  description: string
}

const emptyTest = (index: number): LabTestDraft => ({
  title: `Test ${index + 1}`,
  description: '',
})

function getAppointmentPatientLabel(order: { appointment?: { patient?: { fullName?: string | null; email?: string | null }; patientId?: string } } | null | undefined, fallbackAppointmentId: string): string {
  const fullName = order?.appointment?.patient?.fullName?.trim()
  const email = order?.appointment?.patient?.email?.trim()
  const patientId = order?.appointment?.patientId
  const identity = fullName && email ? `${fullName} (${email})` : fullName || email || patientId || 'Unknown'
  return `${identity} • #${fallbackAppointmentId}`
}

function summarizeTests(tests: LabTestItem[] | null | undefined): string {
  if (!tests || tests.length === 0) return 'No test definitions'
  return tests
    .slice(0, 2)
    .map((item, idx) => `Test ${idx + 1}: ${item.title}`)
    .join(' | ')
}

export function DoctorLabOrdersPage() {
  const queryClient = useQueryClient()
  const appointmentsQuery = useDoctorAppointments()
  const diagnosticsQuery = useDoctorDiagnostics()
  const labOrdersQuery = useDoctorLabOrders()
  const [error, setError] = useState<string | null>(null)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('')
  const [selectedDiagnosticId, setSelectedDiagnosticId] = useState('')
  const [tests, setTests] = useState<LabTestDraft[]>([emptyTest(0)])

  const appointmentOptions = useMemo(
    () =>
      (appointmentsQuery.data ?? []).filter(
        (item) => item.status === 'IN_VISIT' || item.status === 'EXAM_DONE',
      ),
    [appointmentsQuery.data],
  )

  const createMutation = useMutation({
    mutationFn: async () =>
      (
        await api.post<LabOrder>('/labs/orders', {
          appointmentId: selectedAppointmentId,
          diagnosticId: selectedDiagnosticId,
          tests: tests.map((item, index) => ({
            title: item.title.trim() || `Test ${index + 1}`,
            description: item.description.trim(),
          })),
        })
      ).data,
    onSuccess: () => {
      setError(null)
      setSelectedAppointmentId('')
      setSelectedDiagnosticId('')
      setTests([emptyTest(0)])
      void queryClient.invalidateQueries({ queryKey: ['labs'] })
      void queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  })

  const onCreate = (event: FormEvent) => {
    event.preventDefault()
    if (!selectedAppointmentId || !selectedDiagnosticId) {
      setError('Select appointment and diagnostic user.')
      return
    }
    if (tests.some((item) => !item.description.trim())) {
      setError('Each test must include a description.')
      return
    }
    createMutation.mutate()
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Lab Orders</h1>
          <p>Define requested tests, assign diagnostics, and track result delivery.</p>
        </div>
      </div>
      {error ? <p className="error">{error}</p> : null}

      <div className="grid two-col">
        <section className="card">
          <h3>Create New Lab Order</h3>
          <form className="stack" onSubmit={onCreate}>
            <select value={selectedAppointmentId} onChange={(e) => setSelectedAppointmentId(e.target.value)}>
              <option value="">Select appointment</option>
              {appointmentOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {getAppointmentPatientLabel({ appointment: { patient: item.patientSnapshot ? { fullName: item.patientSnapshot.fullName, email: item.patientSnapshot.email } : undefined, patientId: item.patientId } }, item.id)}
                </option>
              ))}
            </select>
            <select value={selectedDiagnosticId} onChange={(e) => setSelectedDiagnosticId(e.target.value)}>
              <option value="">Select diagnostic user</option>
              {(diagnosticsQuery.data ?? []).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.fullName ? `${item.fullName} (${item.email})` : item.email}
                </option>
              ))}
            </select>

            <section className="stack" aria-label="lab-test-builder">
              <strong>Requested Tests</strong>
              {tests.map((item, index) => (
                <div key={`lab-test-${index}`} className="grid two-col">
                  <input
                    value={item.title}
                    placeholder={`Test ${index + 1}`}
                    onChange={(e) =>
                      setTests((current) =>
                        current.map((test, idx) => (idx === index ? { ...test, title: e.target.value } : test)),
                      )
                    }
                  />
                  <div className="actions">
                    <input
                      value={item.description}
                      placeholder={`Description for Test ${index + 1}`}
                      onChange={(e) =>
                        setTests((current) =>
                          current.map((test, idx) =>
                            idx === index ? { ...test, description: e.target.value } : test,
                          ),
                        )
                      }
                    />
                    <button
                      type="button"
                      className="icon-btn"
                      disabled={tests.length === 1}
                      onClick={() =>
                        setTests((current) =>
                          current
                            .filter((_, idx) => idx !== index)
                            .map((test, idx) => ({ ...test, title: test.title || `Test ${idx + 1}` })),
                        )
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setTests((current) => [...current, emptyTest(current.length)])}
              >
                <Plus size={14} />
                Add Test
              </button>
            </section>

            <button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Lab Order'}
            </button>
          </form>
        </section>

        <section className="kpi-grid kpi-three">
          <article className="kpi">
            <p>Pending</p>
            <h3>{(labOrdersQuery.data ?? []).filter((item) => item.status === 'CREATED').length}</h3>
          </article>
          <article className="kpi">
            <p>In Progress</p>
            <h3>
              {
                (labOrdersQuery.data ?? []).filter(
                  (item) => item.status === 'ASSIGNED' || item.status === 'SAMPLE_COLLECTED',
                ).length
              }
            </h3>
          </article>
          <article className="kpi">
            <p>Completed</p>
            <h3>{(labOrdersQuery.data ?? []).filter((item) => item.status === 'SENT').length}</h3>
          </article>
        </section>
      </div>

      <section className="kpi-grid kpi-three">
        <article className="kpi">
          <p>Total Orders</p>
          <h3>{(labOrdersQuery.data ?? []).length}</h3>
        </article>
        <article className="kpi">
          <p>Results Uploaded</p>
          <h3>{(labOrdersQuery.data ?? []).filter((item) => item.status === 'RESULT_UPLOADED').length}</h3>
        </article>
        <article className="kpi">
          <p>Shared</p>
          <h3>{(labOrdersQuery.data ?? []).filter((item) => item.status === 'SENT').length}</h3>
        </article>
      </section>

      <section className="card">
        <h3>Lab Orders List</h3>
        <ul className="list">
          {(labOrdersQuery.data ?? []).map((item) => (
            <li key={item.id}>
              <div>
                <strong className="row-title">
                  <FlaskConical size={14} /> {item.id}
                </strong>
                <p>
                  <span className={statusClass(item.status)}>{item.status}</span>
                </p>
                {item.labResult?.fileUrl ? <p>Result URL: {item.labResult.fileUrl}</p> : null}
                <p className="muted">Patient: {getAppointmentPatientLabel(item, item.appointmentId)}</p>
                <p className="muted">Tests: {summarizeTests(item.tests)}</p>
                <p className="muted row-meta">
                  {item.labResult?.fileUrl ? <CheckCircle2 size={14} /> : <Clock3 size={14} />}
                  appointment: {item.appointmentId}
                </p>
              </div>
            </li>
          ))}
          {(labOrdersQuery.data ?? []).length === 0 ? <li className="empty">No lab orders yet.</li> : null}
        </ul>
      </section>
    </div>
  )
}

const statusClass = (status: string) => {
  if (status === 'SENT' || status === 'RESULT_UPLOADED') return 'status status-green'
  if (status === 'ASSIGNED' || status === 'SAMPLE_COLLECTED') return 'status status-blue'
  if (status === 'CREATED') return 'status status-yellow'
  return 'status status-gray'
}
