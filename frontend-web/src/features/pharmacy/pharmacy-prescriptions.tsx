import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { FileText, Pill, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api, getApiErrorMessage } from '../../lib/api'
import type { Prescription, PrescriptionStatus } from '../../types'
import { pharmacyInvalidateKeys, pharmacyPrescriptionActions, usePharmacyPrescriptions } from './pharmacy-shared'

export function PharmacyPrescriptionsPage() {
  const queryClient = useQueryClient()
  const prescriptionsQuery = usePharmacyPrescriptions()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | PrescriptionStatus>('all')
  const [error, setError] = useState<string | null>(null)

  const actionMutation = useMutation({
    mutationFn: async (payload: { id: string; action: string }) =>
      (await api.patch<Prescription>(`/prescriptions/${payload.id}/${payload.action}`)).data,
    onSuccess: () => {
      setError(null)
      void queryClient.invalidateQueries({ queryKey: pharmacyInvalidateKeys.prescriptions })
      void queryClient.invalidateQueries({ queryKey: pharmacyInvalidateKeys.notifications })
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  })

  const filtered = useMemo(
    () =>
      (prescriptionsQuery.data ?? []).filter((item) => {
        const text = `${item.id} ${item.status} ${item.appointmentId} ${item.notes} ${
          item.appointment?.patient?.fullName ?? ''
        } ${item.appointment?.patient?.email ?? ''} ${item.appointment?.doctor?.fullName ?? ''} ${
          item.appointment?.doctor?.email ?? ''
        }`.toLowerCase()
        const matchesSearch = text.includes(search.toLowerCase())
        const matchesFilter = filter === 'all' || item.status === filter
        return matchesSearch && matchesFilter
      }),
    [filter, prescriptionsQuery.data, search],
  )

  return (
    <div className="page">
      <div className="page-head">
        <h1>Prescriptions</h1>
        <p>Review queue and dispense prescriptions that are sent to your pharmacy.</p>
      </div>
      {error ? <p className="error">{error}</p> : null}

      <section className="card search-card pharmacy-prescriptions-toolbar">
        <div className="pharmacy-search-wrap">
          <Search size={16} />
          <input
            placeholder="Search by patient, doctor, notes or reference"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="pharmacy-status-filter">
          <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
            <option value="all">All Status</option>
            <option value="SENT_TO_PHARMACY">Sent To Pharmacy</option>
            <option value="DISPENSED">Dispensed</option>
            <option value="DRAFT">Draft</option>
            <option value="SIGNED">Signed</option>
            <option value="SENT_TO_PATIENT">Sent To Patient</option>
          </select>
        </div>
      </section>

      <section className="card">
        <ul className="list">
          {filtered.map((item) => (
            <li key={item.id}>
              <div>
                <strong className="row-title">
                  <FileText size={14} /> {item.id}
                </strong>
                <p className="muted">
                  Patient:{' '}
                  {item.appointment?.patient?.fullName ||
                    item.appointment?.patient?.email ||
                    'Unknown patient'}
                </p>
                <p className="muted">
                  Doctor:{' '}
                  {item.appointment?.doctor?.fullName ||
                    item.appointment?.doctor?.email ||
                    'Unknown doctor'}
                </p>
                <p>
                  <span className={statusClass(item.status)}>{item.status}</span>
                </p>
                <p className="muted">Appointment Ref: {item.appointmentId}</p>
                <p className="muted row-meta">
                  <Pill size={14} /> {item.notes}
                </p>
                <Link to={`/pharmacy/prescriptions/${item.id}`} className="quick-link">
                  View Details
                </Link>
              </div>
              <div className="actions">
                {pharmacyPrescriptionActions.map((action) => (
                  <button
                    key={action.action}
                    type="button"
                    disabled={!action.from.includes(item.status) || actionMutation.isPending}
                    onClick={() => actionMutation.mutate({ id: item.id, action: action.action })}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </li>
          ))}
          {filtered.length === 0 ? <li className="empty">No prescriptions found.</li> : null}
        </ul>
      </section>
    </div>
  )
}

function statusClass(status: PrescriptionStatus) {
  if (status === 'DISPENSED') return 'status status-green'
  if (status === 'SENT_TO_PHARMACY') return 'status status-blue'
  if (status === 'SENT_TO_PATIENT') return 'status status-yellow'
  if (status === 'DRAFT') return 'status status-gray'
  return 'status status-gray'
}
