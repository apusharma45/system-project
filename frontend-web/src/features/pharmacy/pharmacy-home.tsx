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
    return {
      total: prescriptions.length,
      ready: prescriptions.filter((item) => item.status === 'SENT_TO_PHARMACY').length,
      dispensed: prescriptions.filter((item) => item.status === 'DISPENSED').length,
      unread: notifications.filter((item) => !item.read).length,
    }
  }, [notificationsQuery.data, prescriptionsQuery.data])

  const queue = useMemo(
    () => (prescriptionsQuery.data ?? []).filter((item) => item.status === 'SENT_TO_PHARMACY').slice(0, 5),
    [prescriptionsQuery.data],
  )

  return (
    <div className="page">
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
              <p>Dispensed</p>
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
              <p>Unread Notifications</p>
              <h3>{stats.unread}</h3>
            </div>
            <div className="icon-chip purple">
              <Bell size={22} />
            </div>
          </div>
        </article>
      </section>

      <section className="card">
        <div className="card-head">
          <h3>Recent Queue</h3>
          <Link to="/pharmacy/prescriptions" className="quick-link">
            Open prescriptions queue
          </Link>
        </div>
        <ul className="list">
          {queue.map((item) => (
            <li key={item.id}>
              <div>
                <strong>{item.id}</strong>
                <p>
                  <span className="status status-blue">{item.status}</span>
                </p>
                <p className="muted">Appointment: {item.appointmentId}</p>
              </div>
            </li>
          ))}
          {queue.length === 0 ? <li className="empty">No prescriptions waiting for dispense.</li> : null}
        </ul>
      </section>
    </div>
  )
}
