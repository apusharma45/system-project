import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bell, CheckCircle2, FileText, Pill } from 'lucide-react'
import { usePharmacyNotifications, usePharmacyPrescriptions } from './pharmacy-shared'

export function PharmacyHome() {
  const prescriptionsQuery = usePharmacyPrescriptions()
  const notificationsQuery = usePharmacyNotifications()

  const stats = useMemo(() => {
    const prescriptions = prescriptionsQuery.data ?? []
    const notifications = notificationsQuery.data ?? []
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    return {
      total: prescriptions.length,
      ready: prescriptions.filter((item) => item.status === 'SENT_TO_PHARMACY').length,
      dispensed: prescriptions.filter((item) => item.status === 'DISPENSED').length,
      dispensedRecent: prescriptions.filter(
        (item) =>
          item.status === 'DISPENSED' &&
          new Date((item as any).updatedAt ?? (item as any).createdAt ?? 0).getTime() >= weekAgo,
      ).length,
      unread: notifications.filter((item) => !item.read).length,
    }
  }, [notificationsQuery.data, prescriptionsQuery.data])

  const queue = useMemo(
    () =>
      (prescriptionsQuery.data ?? [])
        .filter((item) => item.status === 'SENT_TO_PHARMACY')
        .slice(0, 5),
    [prescriptionsQuery.data],
  )

  return (
    <div className="page pharmacy-page pharmacy-dashboard-page">
      <div className="page-head">
        <h1>Pharmacy Dashboard</h1>
        <p>Operational summary for prescription dispensing workflow.</p>
      </div>

      <section className="kpi-grid">
        <article className="kpi">
          <div className="kpi-row">
            <div>
              <p>Total Prescriptions</p>
              <h3>{stats.total}</h3>
            </div>
            <div className="icon-chip blue">
              <FileText size={22} />
            </div>
          </div>
        </article>
        <article className="kpi">
          <div className="kpi-row">
            <div>
              <p>Ready to Dispense</p>
              <h3>{stats.ready}</h3>
            </div>
            <div className="icon-chip yellow">
              <Pill size={22} />
            </div>
          </div>
        </article>
        <article className="kpi">
          <div className="kpi-row">
            <div>
              <p>Dispensed (Total)</p>
              <h3>{stats.dispensed}</h3>
            </div>
            <div className="icon-chip green">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </article>
        <article className="kpi">
          <div className="kpi-row">
            <div>
              <p>Dispensed (Last 7 days)</p>
              <h3>{stats.dispensedRecent}</h3>
            </div>
            <div className="icon-chip purple">
              <Bell size={22} />
            </div>
          </div>
        </article>
        <article className="kpi">
          <div className="kpi-row">
            <div>
              <p>Unread Notifications</p>
              <h3>{stats.unread}</h3>
            </div>
            <div className="icon-chip orange">
              <Bell size={22} />
            </div>
          </div>
        </article>
      </section>

      <section className="card">
        <div className="card-head">
          <h3>Recent Queue</h3>
          <div className="actions">
            <Link to="/pharmacy/prescriptions" className="quick-link">
              Open prescriptions queue
            </Link>
            <Link to="/pharmacy/notifications" className="quick-link">
              Open notifications
            </Link>
          </div>
        </div>
        <ul className="list">
          {queue.map((item) => (
            <li key={item.id}>
              <div>
                <strong>
                  {item.appointment?.patient?.fullName ||
                    item.appointment?.patient?.email ||
                    'Unknown patient'}
                </strong>
                <p className="muted">{item.appointment?.patient?.email || 'No patient email'}</p>
                <p>
                  <span className="status status-blue">{item.status}</span>
                </p>
                <p className="muted">
                  Doctor:{' '}
                  {item.appointment?.doctor?.fullName ||
                    item.appointment?.doctor?.email ||
                    'Unknown doctor'}
                </p>
                <p className="muted">Appointment Ref: {item.appointmentId}</p>
                <Link to={`/pharmacy/prescriptions/${item.id}`} className="quick-link">
                  View Details
                </Link>
              </div>
            </li>
          ))}
          {queue.length === 0 ? <li className="empty">No prescriptions waiting for dispense.</li> : null}
        </ul>
      </section>
    </div>
  )
}
