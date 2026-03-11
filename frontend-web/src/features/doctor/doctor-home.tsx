import { Link } from 'react-router-dom'
import { Calendar, FileText, FlaskConical, Users } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useDoctorAppointments, useDoctorLabOrders, useDoctorNotifications, useDoctorPrescriptions } from './doctor-shared'

type ChartPoint = {
  label: string
  value: number
}

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function buildWeeklyAppointments(scheduledAtList: Array<string | null>): ChartPoint[] {
  const counts = new Map<string, number>()
  for (const day of weekDays) {
    counts.set(day, 0)
  }
  for (const scheduledAt of scheduledAtList) {
    if (!scheduledAt) continue
    const date = new Date(scheduledAt)
    const day = weekDays[date.getDay()]
    counts.set(day, (counts.get(day) ?? 0) + 1)
  }
  return weekDays.map((label) => ({ label, value: counts.get(label) ?? 0 }))
}

function buildPatientGrowth(patientEvents: Array<{ patientId: string; scheduledAt: string | null }>): ChartPoint[] {
  const byMonth = new Map<string, Set<string>>()
  for (const event of patientEvents) {
    if (!event.scheduledAt) continue
    const date = new Date(event.scheduledAt)
    const label = date.toLocaleString('en-US', { month: 'short' })
    if (!byMonth.has(label)) byMonth.set(label, new Set())
    byMonth.get(label)?.add(event.patientId)
  }
  const order = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  let running = 0
  return order.map((label) => {
    running += byMonth.get(label)?.size ?? 0
    return { label, value: running }
  })
}

function timeAgo(dateValue: string): string {
  const ms = Date.now() - new Date(dateValue).getTime()
  const minutes = Math.max(1, Math.floor(ms / 60000))
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export function DoctorHome() {
  const appointmentsQuery = useDoctorAppointments()
  const labOrdersQuery = useDoctorLabOrders()
  const prescriptionsQuery = useDoctorPrescriptions()
  const notificationsQuery = useDoctorNotifications()
  const appointments = appointmentsQuery.data ?? []
  const labOrders = labOrdersQuery.data ?? []
  const prescriptions = prescriptionsQuery.data ?? []
  const notifications = notificationsQuery.data ?? []

  const statItems = [
    {
      label: "Today's Appointments",
      value: String(appointments.length),
      icon: Calendar,
      accent: 'blue',
    },
    {
      label: 'Total Patients',
      value: String(new Set(appointments.map((item) => item.patientId)).size),
      icon: Users,
      accent: 'green',
    },
    {
      label: 'Pending Prescriptions',
      value: String(prescriptions.filter((item) => item.status === 'DRAFT' || item.status === 'SIGNED').length),
      icon: FileText,
      accent: 'purple',
    },
    {
      label: 'Lab Reports',
      value: String(labOrders.filter((item) => item.status === 'SENT').length),
      icon: FlaskConical,
      accent: 'orange',
    },
  ]
  const weeklyAppointments = buildWeeklyAppointments(appointments.map((item) => item.scheduledAt))
  const patientGrowth = buildPatientGrowth(
    appointments.map((item) => ({ patientId: item.patientId, scheduledAt: item.scheduledAt })),
  )
  const activities = notifications.slice(0, 3)

  return (
    <div className="page">
      <div className="page-head">
        <h1>Dashboard</h1>
        <p>Welcome back. Here is what is happening with your care workflow today.</p>
      </div>

      <section className="kpi-grid">
        {statItems.map((item) => (
          <article key={item.label} className="kpi">
            <div className="kpi-row">
              <div>
                <p>{item.label}</p>
                <h3>{item.value}</h3>
              </div>
              <div className={`icon-chip ${item.accent}`}>
                <item.icon size={22} />
              </div>
            </div>
          </article>
        ))}
      </section>

      <div className="metric-grid">
        <section className="card" data-testid="weekly-appointments-chart">
          <div className="card-head">
            <h3>Weekly Appointments</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyAppointments}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="card" data-testid="patient-growth-chart">
          <div className="card-head">
            <h3>Patient Growth</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={patientGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </section>
      </div>

      <section className="card">
        <div className="card-head">
          <h3>Recent Activity</h3>
          <Link to="/doctor/notifications" className="quick-link">
            Open notifications center
          </Link>
        </div>
        <div className="stack">
          {activities.map((item) => (
            <div key={item.id} className="activity-item">
              <span className="activity-dot" />
              <div>
                <p>{item.message}</p>
                <p className="muted">{timeAgo(item.createdAt)}</p>
              </div>
            </div>
          ))}
          {activities.length === 0 ? <p className="empty">No recent events.</p> : null}
        </div>
      </section>
    </div>
  )
}
