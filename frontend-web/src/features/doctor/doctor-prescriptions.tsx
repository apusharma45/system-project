import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { FileText, Pill } from 'lucide-react'
import { api, getApiErrorMessage } from '../../lib/api'
import type { Prescription } from '../../types'
import { useDoctorPrescriptions } from './doctor-shared'

function getPatientLabel(item: Prescription): string {
  const fullName = item.appointment?.patient?.fullName?.trim()
  const email = item.appointment?.patient?.email?.trim()
  const patientId = item.appointment?.patientId

  if (fullName && email) return `${fullName} (${email})`
  if (fullName) return fullName
  if (email) return email
  return patientId ?? 'Unknown patient'
}

function getPharmacyLabel(item: Prescription): string {
  const pharmacyName = item.pharmacySnapshot?.pharmacyName?.trim()
  const fullName = item.pharmacySnapshot?.fullName?.trim()
  const email = item.pharmacySnapshot?.email?.trim()

  if (pharmacyName) return pharmacyName
  if (fullName) return fullName
  if (email) return email
  return 'Not assigned'
}

export function DoctorPrescriptionsPage() {
  const queryClient = useQueryClient()
  const prescriptionsQuery = useDoctorPrescriptions()
  const [error, setError] = useState<string | null>(null)
  const [documentByPrescription, setDocumentByPrescription] = useState<Record<string, File | null>>({})

  const uploadDocumentMutation = useMutation({
    mutationFn: async (payload: { id: string; file: File }) => {
      const formData = new FormData()
      formData.append('file', payload.file)
      return (
        await api.patch<Prescription>(`/prescriptions/${payload.id}/upload-document`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      ).data
    },
    onSuccess: () => {
      setError(null)
      void queryClient.invalidateQueries({ queryKey: ['prescriptions'] })
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  })

  return (
    <div className="page doctor-page doctor-prescriptions-page">
      <div className="page-head">
        <div>
          <h1>Prescriptions</h1>
          <p>Upload prescription documents only. Supported formats: PDF, PNG, JPG/JPEG, WEBP.</p>
        </div>
      </div>
      {error ? <p className="error">{error}</p> : null}

      <section className="card">
        <h3>Prescription Documents</h3>
        <ul className="list">
          {(prescriptionsQuery.data ?? []).map((item) => (
            <li key={item.id}>
              <div>
                <strong className="row-title">
                  <FileText size={14} /> {item.id}
                </strong>
                <p>
                  <span className={statusClass(item.status)}>{item.status}</span>
                </p>
                <p className="muted">Patient: {getPatientLabel(item)}</p>
                <p className="muted">Sent to: {getPharmacyLabel(item)}</p>
                <p className="muted row-meta">
                  <Pill size={14} /> {item.notes}
                </p>
                {item.documentUrl ? (
                  <a href={item.documentUrl} target="_blank" rel="noreferrer" className="quick-link">
                    Document v{item.documentVersion ?? 1}
                  </a>
                ) : (
                  <p className="muted">No document uploaded</p>
                )}
              </div>
              <div className="actions">
                <input
                  aria-label={`Upload file for ${item.id}`}
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
                  onChange={(e) =>
                    setDocumentByPrescription((current) => ({
                      ...current,
                      [item.id]: e.target.files?.[0] ?? null,
                    }))
                  }
                />
                <button
                  type="button"
                  disabled={!documentByPrescription[item.id] || uploadDocumentMutation.isPending}
                  onClick={() => {
                    const file = documentByPrescription[item.id]
                    if (!file) return
                    uploadDocumentMutation.mutate({ id: item.id, file })
                  }}
                >
                  Upload Document
                </button>
              </div>
            </li>
          ))}
          {(prescriptionsQuery.data ?? []).length === 0 ? <li className="empty">No prescriptions found.</li> : null}
        </ul>
      </section>
    </div>
  )
}

const statusClass = (status: Prescription['status']) => {
  if (status === 'SIGNED') return 'status status-blue'
  if (status === 'SENT_TO_PATIENT' || status === 'SENT_TO_PHARMACY') return 'status status-yellow'
  if (status === 'DISPENSED') return 'status status-green'
  return 'status status-gray'
}
