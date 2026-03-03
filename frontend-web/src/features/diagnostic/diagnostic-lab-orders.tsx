import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { CheckCircle2, Clock3, FlaskConical, Search } from 'lucide-react'
import { api, getApiErrorMessage } from '../../lib/api'
import type { LabOrder, LabOrderStatus } from '../../types'
import { diagnosticInvalidateKeys, labTransitionActions, useDiagnosticLabOrders } from './diagnostic-shared'

export function DiagnosticLabOrdersPage() {
  const queryClient = useQueryClient()
  const labOrdersQuery = useDiagnosticLabOrders()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | LabOrderStatus>('all')
  const [error, setError] = useState<string | null>(null)
  const [resultUrls, setResultUrls] = useState<Record<string, string>>({})

  const actionMutation = useMutation({
    mutationFn: async (payload: { id: string; action: string; fileUrl?: string }) => {
      if (payload.action === 'result-uploaded') {
        return (await api.patch<LabOrder>(`/labs/orders/${payload.id}/result-uploaded`, { fileUrl: payload.fileUrl })).data
      }
      return (await api.patch<LabOrder>(`/labs/orders/${payload.id}/${payload.action}`)).data
    },
    onSuccess: () => {
      setError(null)
      void queryClient.invalidateQueries({ queryKey: diagnosticInvalidateKeys.labs })
      void queryClient.invalidateQueries({ queryKey: diagnosticInvalidateKeys.notifications })
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  })

  const filtered = useMemo(
    () =>
      (labOrdersQuery.data ?? []).filter((item) => {
        const text = `${item.id} ${item.status} ${item.appointmentId} ${item.appointment?.patientId ?? ''}`.toLowerCase()
        const matchesSearch = text.includes(search.toLowerCase())
        const matchesFilter = filter === 'all' || item.status === filter
        return matchesSearch && matchesFilter
      }),
    [filter, labOrdersQuery.data, search],
  )

  const stats = useMemo(() => {
    const list = labOrdersQuery.data ?? []
    return {
      created: list.filter((item) => item.status === 'CREATED').length,
      assigned: list.filter((item) => item.status === 'ASSIGNED').length,
      sample: list.filter((item) => item.status === 'SAMPLE_COLLECTED').length,
      uploaded: list.filter((item) => item.status === 'RESULT_UPLOADED').length,
      sent: list.filter((item) => item.status === 'SENT').length,
    }
  }, [labOrdersQuery.data])

  return (
    <div className="page">
      <div className="page-head">
        <h1>Lab Orders</h1>
        <p>Manage diagnostic queue and advance each order through the result workflow.</p>
      </div>
      {error ? <p className="error">{error}</p> : null}

      <section className="card search-card">
        <Search size={16} />
        <input
          placeholder="Search by order ID, appointment ID or patient ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
          <option value="all">All Status</option>
          <option value="CREATED">Created</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="SAMPLE_COLLECTED">Sample Collected</option>
          <option value="RESULT_UPLOADED">Result Uploaded</option>
          <option value="SENT">Sent</option>
        </select>
      </section>

      <section className="kpi-grid kpi-three">
        <article className="kpi">
          <p>Created / Assigned</p>
          <h3>{stats.created + stats.assigned}</h3>
        </article>
        <article className="kpi">
          <p>Sample / Uploaded</p>
          <h3>{stats.sample + stats.uploaded}</h3>
        </article>
        <article className="kpi">
          <p>Sent</p>
          <h3>{stats.sent}</h3>
        </article>
      </section>

      <section className="card">
        <ul className="list">
          {filtered.map((item) => (
            <li key={item.id}>
              <div>
                <strong className="row-title">
                  <FlaskConical size={14} /> {item.id}
                </strong>
                <p>
                  <span className={statusClass(item.status)}>{item.status}</span>
                </p>
                <p className="muted">Appointment: {item.appointmentId}</p>
                <p className="muted">Patient: {item.appointment?.patientId ?? 'N/A'}</p>
                <p className="muted row-meta">
                  {item.labResult?.fileUrl ? <CheckCircle2 size={14} /> : <Clock3 size={14} />}
                  Result: {item.labResult?.fileUrl ?? 'Not uploaded yet'}
                </p>
                {item.status === 'SAMPLE_COLLECTED' ? (
                  <div className="stack" style={{ marginTop: '0.45rem' }}>
                    <input
                      placeholder="Result file URL"
                      value={resultUrls[item.id] ?? ''}
                      onChange={(e) => setResultUrls((prev) => ({ ...prev, [item.id]: e.target.value }))}
                    />
                  </div>
                ) : null}
              </div>
              <div className="actions">
                {labTransitionActions.map((action) => (
                  <button
                    key={action.action}
                    type="button"
                    disabled={!action.from.includes(item.status) || actionMutation.isPending}
                    onClick={() => {
                      if (action.action === 'result-uploaded') {
                        const fileUrl = (resultUrls[item.id] ?? '').trim()
                        if (!fileUrl) {
                          setError('Provide a result file URL before uploading.')
                          return
                        }
                        actionMutation.mutate({ id: item.id, action: action.action, fileUrl })
                        return
                      }
                      actionMutation.mutate({ id: item.id, action: action.action })
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </li>
          ))}
          {filtered.length === 0 ? <li className="empty">No lab orders found.</li> : null}
        </ul>
      </section>
    </div>
  )
}

const statusClass = (status: LabOrderStatus) => {
  if (status === 'SENT' || status === 'RESULT_UPLOADED') return 'status status-green'
  if (status === 'ASSIGNED' || status === 'SAMPLE_COLLECTED') return 'status status-blue'
  if (status === 'CREATED') return 'status status-yellow'
  return 'status status-gray'
}
