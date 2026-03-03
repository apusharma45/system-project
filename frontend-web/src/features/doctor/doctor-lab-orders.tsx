import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { CheckCircle2, Clock3, FlaskConical } from 'lucide-react'
import { api, getApiErrorMessage } from '../../lib/api'
import { useDoctorAppointments, useDoctorDiagnostics, useDoctorLabOrders } from './doctor-shared'

export function DoctorLabOrdersPage() {
  const queryClient = useQueryClient()
  const appointmentsQuery = useDoctorAppointments()
  const diagnosticsQuery = useDoctorDiagnostics()
  const labOrdersQuery = useDoctorLabOrders()
  const [error, setError] = useState<string | null>(null)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('')
  const [selectedDiagnosticId, setSelectedDiagnosticId] = useState('')

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
        await api.post('/labs/orders', {
          appointmentId: selectedAppointmentId,
          diagnosticId: selectedDiagnosticId,
        })
      ).data,
    onSuccess: () => {
      setError(null)
      setSelectedAppointmentId('')
      setSelectedDiagnosticId('')
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
    createMutation.mutate()
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Lab Orders</h1>
          <p>Order diagnostics and track result delivery status.</p>
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
                  {item.id} ({item.status})
                </option>
              ))}
            </select>
            <select value={selectedDiagnosticId} onChange={(e) => setSelectedDiagnosticId(e.target.value)}>
              <option value="">Select diagnostic user</option>
              {(diagnosticsQuery.data ?? []).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.email}
                </option>
              ))}
            </select>
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
                <strong className="row-title"><FlaskConical size={14} /> {item.id}</strong>
                <p><span className={statusClass(item.status)}>{item.status}</span></p>
                {item.labResult?.fileUrl ? <p>Result URL: {item.labResult.fileUrl}</p> : null}
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
