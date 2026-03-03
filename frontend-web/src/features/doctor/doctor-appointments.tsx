import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Calendar, Clock3, Search } from 'lucide-react'
import { api, getApiErrorMessage } from '../../lib/api'
import type { Appointment, AppointmentStatus } from '../../types'
import { useDoctorAppointments } from './doctor-shared'

const appointmentActions: Array<{ label: string; action: string; from: AppointmentStatus[] }> = [
  { label: 'Confirm', action: 'confirm', from: ['REQUESTED'] },
  { label: 'Call', action: 'call', from: ['CONFIRMED'] },
  { label: 'In Visit', action: 'in-visit', from: ['CONFIRMED', 'CALLED'] },
  { label: 'Exam Done', action: 'exam-done', from: ['IN_VISIT'] },
  { label: 'Close', action: 'close', from: ['EXAM_DONE'] },
  { label: 'Cancel', action: 'cancel', from: ['REQUESTED', 'CONFIRMED', 'CALLED', 'IN_VISIT'] },
]

export function DoctorAppointmentsPage() {
  const queryClient = useQueryClient()
  const appointmentsQuery = useDoctorAppointments()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | AppointmentStatus>('all')
  const [error, setError] = useState<string | null>(null)

  const appointmentMutation = useMutation({
    mutationFn: async (payload: { id: string; action: string }) =>
      (await api.patch<Appointment>(`/appointments/${payload.id}/${payload.action}`)).data,
    onSuccess: () => {
      setError(null)
      void queryClient.invalidateQueries({ queryKey: ['appointments'] })
      void queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  })

  const filtered = useMemo(
    () =>
      (appointmentsQuery.data ?? []).filter((item) => {
        const text = `${item.id} ${item.status}`.toLowerCase()
        const matchesSearch = text.includes(search.toLowerCase())
        const matchesFilter = filter === 'all' || item.status === filter
        return matchesSearch && matchesFilter
      }),
    [appointmentsQuery.data, filter, search],
  )

  const statusClass = (status: AppointmentStatus) => {
    if (status === 'CONFIRMED' || status === 'CALLED') return 'status status-blue'
    if (status === 'IN_VISIT') return 'status status-yellow'
    if (status === 'EXAM_DONE' || status === 'CLOSED') return 'status status-green'
    if (status === 'CANCELLED') return 'status status-red'
    return 'status status-gray'
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Appointments</h1>
        <p>Manage and advance appointment workflow with quick actions.</p>
      </div>
      {error ? <p className="error">{error}</p> : null}

      <section className="card search-card">
        <Search size={16} />
        <input
          placeholder="Search by appointment ID or status"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value as AppointmentStatus | 'all')}>
          <option value="all">All Status</option>
          <option value="REQUESTED">Requested</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CALLED">Called</option>
          <option value="IN_VISIT">In Visit</option>
          <option value="EXAM_DONE">Exam Done</option>
          <option value="CLOSED">Closed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </section>

      <section className="stack">
        <ul className="list">
          {filtered.map((appointment) => (
            <li key={appointment.id}>
              <div>
                <strong>{new Date(appointment.scheduledAt).toLocaleString()}</strong>
                <p>
                  <span className={statusClass(appointment.status)}>{appointment.status}</span> #{appointment.id}
                </p>
                <p className="muted">Patient ID: {appointment.patientId}</p>
                <p className="muted row-meta">
                  <Calendar size={14} /> requiresLab: {String(appointment.requiresLab)}
                  <Clock3 size={14} /> lock: {String(appointment.labFlowLocked)}
                </p>
              </div>
              <div className="actions">
                {appointmentActions.map((item) => (
                  <button
                    key={item.action}
                    type="button"
                    disabled={!item.from.includes(appointment.status) || appointmentMutation.isPending}
                    onClick={() => appointmentMutation.mutate({ id: appointment.id, action: item.action })}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </li>
          ))}
          {filtered.length === 0 ? <li className="empty">No appointments found.</li> : null}
        </ul>
      </section>
    </div>
  )
}
