import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { LabOrderStatus } from '../../types'
import { useDiagnosticLabOrders } from './diagnostic-shared'

export function DiagnosticLabOrdersPage() {
  const labOrdersQuery = useDiagnosticLabOrders()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | LabOrderStatus>('all')

  const visible = useMemo(() => {
    const text = search.toLowerCase()
    return (labOrdersQuery.data ?? []).filter((item) => {
      const patientName = item.appointment?.patient?.fullName ?? item.patientClinicalSnapshot?.fullName ?? ''
      const patientEmail = item.appointment?.patient?.email ?? item.patientClinicalSnapshot?.email ?? ''
      const haystack = `${item.id} ${item.appointmentId} ${patientName} ${patientEmail}`.toLowerCase()
      const matchesSearch = haystack.includes(text)
      const matchesFilter = filter === 'all' || item.status === filter
      return matchesSearch && matchesFilter
    })
  }, [filter, labOrdersQuery.data, search])

  const getReportCount = (orderId: string) => {
    const order = (labOrdersQuery.data ?? []).find((item) => item.id === orderId)
    if (!order) return 0
    if (order.labReports?.length) {
      return order.labReports.length
    }
    return order.latestReport || order.labResult ? 1 : 0
  }

  return (
    <div className="page diagnostic-page diagnostic-lab-orders-page">
      <div className="page-head">
        <h1>Lab Orders</h1>
        <p>Review assigned orders quickly and open details for status updates, tests, and report uploads.</p>
      </div>

      <section className="card diagnostic-toolbar">
        <div className="diagnostic-search-wrap">
          <Search size={16} />
          <input
            placeholder="Search by patient, order ref or appointment ref"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="diagnostic-filter-wrap">
          <label htmlFor="diagnostic-status-filter">Status</label>
          <select
            id="diagnostic-status-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as LabOrderStatus | 'all')}
          >
            <option value="all">All Status</option>
            <option value="CREATED">Created</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="SAMPLE_COLLECTED">Sample Collected</option>
            <option value="SENT">Sent</option>
          </select>
        </div>
      </section>

      <section className="stack">
        <ul className="list">
          {visible.map((order) => {
            const patientName =
              order.appointment?.patient?.fullName ||
              order.patientClinicalSnapshot?.fullName ||
              order.appointment?.patient?.email ||
              order.patientClinicalSnapshot?.email ||
              'Unknown patient'
            const patientEmail =
              order.appointment?.patient?.email || order.patientClinicalSnapshot?.email || 'No email'
            const reportCount = getReportCount(order.id)

            return (
              <li key={order.id}>
                <div>
                  <strong>{patientName}</strong>
                  <p className="muted">{patientEmail}</p>
                  <p>
                    <span className={labStatusClass(order.status)}>{order.status}</span>
                  </p>
                  <p className="muted">Order Ref: {order.id}</p>
                  <p className="muted">Appointment Ref: {order.appointmentId}</p>
                  <p className="muted">
                    Reports: {reportCount} {reportCount > 0 ? '(uploaded)' : '(pending)'}
                  </p>
                </div>

                <div className="actions">
                  <Link to={`/diagnostic/lab-orders/${order.id}`} className="quick-link">
                    View Details
                  </Link>
                </div>
              </li>
            )
          })}
          {visible.length === 0 ? <li className="empty">No lab orders found.</li> : null}
        </ul>
      </section>
    </div>
  )
}

const labStatusClass = (status: LabOrderStatus) => {
  if (status === 'SENT') return 'status status-green'
  if (status === 'ASSIGNED' || status === 'SAMPLE_COLLECTED') return 'status status-blue'
  if (status === 'CREATED') return 'status status-yellow'
  return 'status status-gray'
}
