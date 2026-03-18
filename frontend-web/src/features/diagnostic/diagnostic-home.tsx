import { Link } from 'react-router-dom'
import { useDiagnosticLabOrders, useDiagnosticNotifications } from './diagnostic-shared'

export function DiagnosticHome() {
  const labOrdersQuery = useDiagnosticLabOrders()
  const notificationsQuery = useDiagnosticNotifications()

  const orders = labOrdersQuery.data ?? []
  const unread = (notificationsQuery.data ?? []).filter((item) => !item.read).length
  const pendingUpload = orders.filter((item) => !(item.latestReport || item.labResult || item.labReports?.length)).length
  const completed = orders.filter((item) => item.status === 'SENT').length
  const priorityQueue = orders.filter((item) => !(item.latestReport || item.labResult || item.labReports?.length)).slice(0, 5)

  return (
    <div className="page diagnostic-page diagnostic-dashboard-page">
      <div className="page-head">
        <h1>Diagnostic Dashboard</h1>
        <p>Track pending reports and complete lab workflows quickly.</p>
      </div>

      <section className="kpi-grid kpi-three">
        <article className="kpi">
          <p>Total Lab Orders</p>
          <h3>{orders.length}</h3>
        </article>
        <article className="kpi">
          <p>Pending Upload</p>
          <h3>{pendingUpload}</h3>
        </article>
        <article className="kpi">
          <p>Completed/Sent</p>
          <h3>{completed}</h3>
        </article>
      </section>

      <section className="grid two-col">
        <article className="card">
          <div className="card-head">
            <h3>Priority Queue</h3>
            <Link to="/diagnostic/lab-orders" className="quick-link">
              Open Lab Orders
            </Link>
          </div>
          <ul className="list">
            {priorityQueue.map((order) => (
              <li key={order.id}>
                <div>
                  <strong>Order #{order.id}</strong>
                  <p className="muted">Appointment #{order.appointmentId}</p>
                  <p className="muted">
                    Patient: {order.appointment?.patient?.fullName || order.appointment?.patient?.email || order.patientClinicalSnapshot?.fullName || 'Unknown'}
                  </p>
                </div>
                <span className="status status-yellow">Needs upload</span>
              </li>
            ))}
            {priorityQueue.length === 0 ? <li className="empty">No pending uploads.</li> : null}
          </ul>
        </article>

        <article className="card">
          <div className="card-head">
            <h3>Recent Activity</h3>
            <Link to="/diagnostic/notifications" className="quick-link">
              View Notifications
            </Link>
          </div>
          <p className="muted">Unread notifications: {unread}</p>
          <p className="muted">
            Last completed order:{' '}
            {orders.find((item) => item.latestReport || item.labResult || item.labReports?.length)?.id
              ? `#${orders.find((item) => item.latestReport || item.labResult || item.labReports?.length)?.id}`
              : 'Not available'}
          </p>
        </article>
      </section>
    </div>
  )
}
