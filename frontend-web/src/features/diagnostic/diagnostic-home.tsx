import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Clock3, FlaskConical, Send, Upload } from 'lucide-react'
import { useDiagnosticLabOrders } from './diagnostic-shared'

export function DiagnosticHome() {
  const labOrdersQuery = useDiagnosticLabOrders()

  const stats = useMemo(() => {
    const list = labOrdersQuery.data ?? []
    return {
      total: list.length,
      queue: list.filter((item) => item.status === 'CREATED' || item.status === 'ASSIGNED').length,
      uploadsPending: list.filter((item) => item.status === 'SAMPLE_COLLECTED').length,
      sent: list.filter((item) => item.status === 'SENT').length,
    }
  }, [labOrdersQuery.data])

  const createdOrAssigned = useMemo(
    () =>
      (labOrdersQuery.data ?? [])
        .filter((item) => item.status === 'CREATED' || item.status === 'ASSIGNED')
        .slice(0, 6),
    [labOrdersQuery.data],
  )

  return (
    <div className="page">
      <div className="page-head">
        <h1>Diagnostic Dashboard</h1>
        <p>Operational overview for the lab center queue and result delivery pipeline.</p>
      </div>

      <section className="kpi-grid">
        <article className="kpi">
          <div className="kpi-row">
            <div>
              <p>Total Orders</p>
              <h3>{stats.total}</h3>
            </div>
            <div className="icon-chip blue">
              <FlaskConical size={22} />
            </div>
          </div>
        </article>
        <article className="kpi">
          <div className="kpi-row">
            <div>
              <p>Needs Action</p>
              <h3>{stats.queue}</h3>
            </div>
            <div className="icon-chip yellow">
              <Clock3 size={22} />
            </div>
          </div>
        </article>
        <article className="kpi">
          <div className="kpi-row">
            <div>
              <p>Uploads Pending</p>
              <h3>{stats.uploadsPending}</h3>
            </div>
            <div className="icon-chip purple">
              <Upload size={22} />
            </div>
          </div>
        </article>
        <article className="kpi">
          <div className="kpi-row">
            <div>
              <p>Sent</p>
              <h3>{stats.sent}</h3>
            </div>
            <div className="icon-chip green">
              <Send size={22} />
            </div>
          </div>
        </article>
      </section>

      <section className="card">
        <div className="card-head">
          <h3>Orders Needing Action</h3>
          <Link to="/diagnostic/lab-orders" className="quick-link">
            Open lab queue
          </Link>
        </div>
        <ul className="list">
          {createdOrAssigned.map((item) => (
            <li key={item.id}>
              <div>
                <strong>{item.id}</strong>
                <p>
                  <span className={item.status === 'CREATED' ? 'status status-yellow' : 'status status-blue'}>
                    {item.status}
                  </span>
                </p>
                <p className="muted">Appointment: {item.appointmentId}</p>
              </div>
            </li>
          ))}
          {createdOrAssigned.length === 0 ? <li className="empty">No active queue items.</li> : null}
        </ul>
      </section>
    </div>
  )
}
