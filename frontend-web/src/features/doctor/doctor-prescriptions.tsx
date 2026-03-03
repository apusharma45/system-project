import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { FileText, Pill } from 'lucide-react'
import { api, getApiErrorMessage } from '../../lib/api'
import type { Prescription, PrescriptionStatus } from '../../types'
import { useDoctorAppointments, useDoctorPharmacies, useDoctorPrescriptions } from './doctor-shared'

const prescriptionActions: Array<{ label: string; action: string; from: PrescriptionStatus[] }> = [
  { label: 'Sign', action: 'sign', from: ['DRAFT'] },
  { label: 'Send Patient', action: 'send-patient', from: ['SIGNED'] },
  { label: 'Send Pharmacy', action: 'send-pharmacy', from: ['SENT_TO_PATIENT'] },
]

export function DoctorPrescriptionsPage() {
  const queryClient = useQueryClient()
  const appointmentsQuery = useDoctorAppointments()
  const pharmaciesQuery = useDoctorPharmacies()
  const prescriptionsQuery = useDoctorPrescriptions()

  const [error, setError] = useState<string | null>(null)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('')
  const [selectedPharmacyId, setSelectedPharmacyId] = useState('')
  const [notes, setNotes] = useState('')

  const appointmentOptions = useMemo(
    () =>
      (appointmentsQuery.data ?? []).filter(
        (item) => item.status === 'EXAM_DONE' || item.status === 'CLOSED',
      ),
    [appointmentsQuery.data],
  )

  const createMutation = useMutation({
    mutationFn: async () =>
      (
        await api.post('/prescriptions', {
          appointmentId: selectedAppointmentId,
          pharmacyId: selectedPharmacyId,
          notes,
        })
      ).data,
    onSuccess: () => {
      setError(null)
      setSelectedAppointmentId('')
      setSelectedPharmacyId('')
      setNotes('')
      void queryClient.invalidateQueries({ queryKey: ['prescriptions'] })
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  })

  const actionMutation = useMutation({
    mutationFn: async (payload: { id: string; action: string }) => {
      if (payload.action === 'sign') {
        return (await api.patch<Prescription>(`/prescriptions/${payload.id}/sign`, { notes })).data
      }
      return (await api.patch<Prescription>(`/prescriptions/${payload.id}/${payload.action}`)).data
    },
    onSuccess: () => {
      setError(null)
      void queryClient.invalidateQueries({ queryKey: ['prescriptions'] })
      void queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  })

  const onCreate = (event: FormEvent) => {
    event.preventDefault()
    if (!selectedAppointmentId || !selectedPharmacyId || !notes.trim()) {
      setError('Select appointment, pharmacy and notes.')
      return
    }
    createMutation.mutate()
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Prescriptions</h1>
          <p>Create drafts and move prescriptions through your medication workflow.</p>
        </div>
      </div>
      {error ? <p className="error">{error}</p> : null}

      <div className="grid two-col">
        <section className="card">
          <div className="card-head">
            <h3>Create New Prescription</h3>
          </div>
          <form className="stack" onSubmit={onCreate}>
            <select value={selectedAppointmentId} onChange={(e) => setSelectedAppointmentId(e.target.value)}>
              <option value="">Select appointment</option>
              {appointmentOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id} ({item.status})
                </option>
              ))}
            </select>
            <select value={selectedPharmacyId} onChange={(e) => setSelectedPharmacyId(e.target.value)}>
              <option value="">Select pharmacy</option>
              {(pharmaciesQuery.data ?? []).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.email}
                </option>
              ))}
            </select>
            <textarea
              rows={4}
              placeholder="Prescription notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Prescription'}
            </button>
          </form>
        </section>

        <section className="card">
          <h3>Summary</h3>
          <section className="kpi-grid kpi-three">
            <article className="kpi">
              <p>Drafts</p>
              <h3>{(prescriptionsQuery.data ?? []).filter((item) => item.status === 'DRAFT').length}</h3>
            </article>
            <article className="kpi">
              <p>Signed</p>
              <h3>{(prescriptionsQuery.data ?? []).filter((item) => item.status === 'SIGNED').length}</h3>
            </article>
            <article className="kpi">
              <p>Dispensed</p>
              <h3>{(prescriptionsQuery.data ?? []).filter((item) => item.status === 'DISPENSED').length}</h3>
            </article>
          </section>
        </section>
      </div>

      <section className="card">
        <h3>Prescription List</h3>
        <ul className="list">
          {(prescriptionsQuery.data ?? []).map((item) => (
            <li key={item.id}>
              <div>
                <strong className="row-title"><FileText size={14} /> {item.id}</strong>
                <p><span className={statusClass(item.status)}>{item.status}</span></p>
                <p className="muted row-meta"><Pill size={14} /> {item.notes}</p>
              </div>
              <div className="actions">
                {prescriptionActions.map((action) => (
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
          {(prescriptionsQuery.data ?? []).length === 0 ? <li className="empty">No prescriptions yet.</li> : null}
        </ul>
      </section>
    </div>
  )
}
  const statusClass = (status: PrescriptionStatus) => {
    if (status === 'SIGNED') return 'status status-blue'
    if (status === 'SENT_TO_PATIENT' || status === 'SENT_TO_PHARMACY') return 'status status-yellow'
    if (status === 'DISPENSED') return 'status status-green'
    return 'status status-gray'
  }
