import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { api, getApiErrorMessage } from '../../lib/api'
import type { Prescription } from '../../types'
import { pharmacyInvalidateKeys, usePharmacyPrescription } from './pharmacy-shared'
import { useState } from 'react'

export function PharmacyPrescriptionDetailsPage() {
  const { prescriptionId = '' } = useParams()
  const queryClient = useQueryClient()
  const detailsQuery = usePharmacyPrescription(prescriptionId)
  const [error, setError] = useState<string | null>(null)

  const dispenseMutation = useMutation({
    mutationFn: async () =>
      (await api.patch<Prescription>(`/prescriptions/${prescriptionId}/dispense`)).data,
    onSuccess: async () => {
      setError(null)
      await queryClient.invalidateQueries({ queryKey: ['prescription', 'pharmacy', prescriptionId] })
      await queryClient.invalidateQueries({ queryKey: pharmacyInvalidateKeys.prescriptions })
      await queryClient.invalidateQueries({ queryKey: pharmacyInvalidateKeys.notifications })
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  })

  const prescription = detailsQuery.data

  return (
    <div className="page">
      <div className="page-head">
        <h1>Prescription Details</h1>
        <p>Review prescription context and complete dispensing workflow.</p>
      </div>
      {error ? <p className="error">{error}</p> : null}
      {detailsQuery.isLoading ? <p className="state">Loading prescription details...</p> : null}
      {detailsQuery.isError ? <p className="error">Failed to load prescription details.</p> : null}

      {!detailsQuery.isLoading && !detailsQuery.isError && !prescription ? (
        <section className="card">
          <h3>Prescription not found</h3>
          <Link to="/pharmacy/prescriptions" className="quick-link">
            Back to prescriptions
          </Link>
        </section>
      ) : null}

      {prescription ? (
        <div className="stack">
          <section className="card">
            <h3>Overview</h3>
            <p>Prescription Ref: {prescription.id}</p>
            <p>Status: {prescription.status}</p>
            <p className="muted">Appointment Ref: {prescription.appointmentId}</p>
          </section>

          <section className="card">
            <h3>Clinical Details</h3>
            <p className="muted">Diagnosis: {prescription.diagnosis || 'Not provided'}</p>
            <p className="muted">Instructions: {prescription.instructions || 'Not provided'}</p>
            <p className="muted">Notes: {prescription.notes || 'Not provided'}</p>
            <div className="muted">
              <strong>Medications</strong>
              {prescription.medications?.length ? (
                <ul>
                  {prescription.medications.map((item, index) => (
                    <li key={`${prescription.id}-med-${index}`}>
                      {item.name} | {item.dosage || 'N/A'} | {item.frequency || 'N/A'} |{' '}
                      {item.duration || 'N/A'}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Not provided</p>
              )}
            </div>
          </section>

          <section className="card">
            <h3>Patient & Doctor</h3>
            <p className="muted">
              Patient:{' '}
              {prescription.appointment?.patient?.fullName ||
                prescription.appointment?.patient?.email ||
                'Unknown patient'}
            </p>
            <p className="muted">Patient Email: {prescription.appointment?.patient?.email || 'No email'}</p>
            <p className="muted">
              Doctor:{' '}
              {prescription.appointment?.doctor?.fullName ||
                prescription.appointment?.doctor?.email ||
                'Unknown doctor'}
            </p>
            <p className="muted">Doctor Email: {prescription.appointment?.doctor?.email || 'No email'}</p>
          </section>

          <section className="card">
            <h3>Document</h3>
            {prescription.documentUrl ? (
              <a href={prescription.documentUrl} target="_blank" rel="noreferrer">
                Open Prescription Document
              </a>
            ) : (
              <p className="muted">No document uploaded.</p>
            )}
          </section>

          <section className="card">
            <h3>Actions</h3>
            <div className="actions" style={{ justifyContent: 'flex-start' }}>
              <button
                type="button"
                disabled={prescription.status !== 'SENT_TO_PHARMACY' || dispenseMutation.isPending}
                onClick={() => dispenseMutation.mutate()}
              >
                {dispenseMutation.isPending ? 'Dispensing...' : 'Dispense'}
              </button>
              <Link to="/pharmacy/prescriptions" className="quick-link">
                Back to queue
              </Link>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}
