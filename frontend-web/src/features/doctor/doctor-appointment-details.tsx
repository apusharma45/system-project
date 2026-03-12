import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, getApiErrorMessage } from '../../lib/api'
import type { Appointment, AppointmentStatus, LabOrder, Prescription } from '../../types'
import {
  useDoctorAppointments,
  useDoctorDiagnostics,
  useDoctorLabOrders,
  useDoctorPharmacies,
  useDoctorPrescriptions,
} from './doctor-shared'

type DetailsTab = 'overview' | 'actions' | 'prescription' | 'lab' | 'report'
type LabTestDraft = {
  title: string
  description: string
}

const emptyLabTestDraft = (index: number): LabTestDraft => ({
  title: `Test ${index + 1}`,
  description: '',
})

const appointmentActions: Array<{ label: string; action: string; from: AppointmentStatus[] }> = [
  { label: 'Approve Preferred', action: 'confirm', from: ['REQUESTED'] },
  { label: 'Call', action: 'call', from: ['CONFIRMED'] },
  { label: 'In Visit', action: 'in-visit', from: ['CONFIRMED', 'CALLED'] },
  { label: 'Exam Done', action: 'exam-done', from: ['IN_VISIT'] },
  { label: 'Close', action: 'close', from: ['EXAM_DONE'] },
  { label: 'Cancel', action: 'cancel', from: ['REQUESTED', 'CONFIRMED', 'CALLED', 'IN_VISIT'] },
]

export function DoctorAppointmentDetailsPage() {
  const { appointmentId } = useParams()
  const queryClient = useQueryClient()

  const appointmentsQuery = useDoctorAppointments()
  const prescriptionsQuery = useDoctorPrescriptions()
  const labsQuery = useDoctorLabOrders()
  const diagnosticsQuery = useDoctorDiagnostics()
  const pharmaciesQuery = useDoctorPharmacies()

  const [activeTab, setActiveTab] = useState<DetailsTab>('overview')
  const [error, setError] = useState<string | null>(null)
  const [scheduleAt, setScheduleAt] = useState('')
  const [selectedDiagnosticId, setSelectedDiagnosticId] = useState('')
  const [selectedPharmacyId, setSelectedPharmacyId] = useState('')
  const [prescriptionNotes, setPrescriptionNotes] = useState('')
  const [prescriptionDiagnosis, setPrescriptionDiagnosis] = useState('')
  const [prescriptionInstructions, setPrescriptionInstructions] = useState('')
  const [labTests, setLabTests] = useState<LabTestDraft[]>([emptyLabTestDraft(0)])
  const [documentFile, setDocumentFile] = useState<File | null>(null)

  const appointment = useMemo(
    () => (appointmentsQuery.data ?? []).find((item) => item.id === appointmentId),
    [appointmentsQuery.data, appointmentId],
  )
  const appointmentPrescription = useMemo(
    () => (prescriptionsQuery.data ?? []).find((item) => item.appointmentId === appointmentId),
    [prescriptionsQuery.data, appointmentId],
  )
  const appointmentPrescriptions = useMemo(
    () => (prescriptionsQuery.data ?? []).filter((item) => item.appointmentId === appointmentId),
    [prescriptionsQuery.data, appointmentId],
  )
  const appointmentLabOrders = useMemo(
    () => (labsQuery.data ?? []).filter((item) => item.appointmentId === appointmentId),
    [labsQuery.data, appointmentId],
  )
  const appointmentLabOrdersWithReports = useMemo(
    () =>
      appointmentLabOrders
        .map((item) => ({
          ...item,
          reports: getReports(item),
        }))
        .filter((item) => item.reports.length > 0),
    [appointmentLabOrders],
  )

  const invalidateDoctorData = async () => {
    await queryClient.invalidateQueries({ queryKey: ['appointments'] })
    await queryClient.invalidateQueries({ queryKey: ['prescriptions'] })
    await queryClient.invalidateQueries({ queryKey: ['labs'] })
    await queryClient.invalidateQueries({ queryKey: ['notifications'] })
  }

  const appointmentMutation = useMutation({
    mutationFn: async (payload: { id: string; action: string }) =>
      (await api.patch<Appointment>(`/appointments/${payload.id}/${payload.action}`)).data,
    onSuccess: async () => {
      setError(null)
      await invalidateDoctorData()
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  })

  const scheduleMutation = useMutation({
    mutationFn: async (payload: { id: string; scheduledAt: string }) =>
      (await api.patch<Appointment>(`/appointments/${payload.id}/schedule`, { scheduledAt: payload.scheduledAt })).data,
    onSuccess: async () => {
      setError(null)
      setScheduleAt('')
      await invalidateDoctorData()
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  })

  const createPrescriptionMutation = useMutation({
    mutationFn: async () =>
      (
        await api.post<Prescription>('/prescriptions', {
          appointmentId,
          pharmacyId: selectedPharmacyId,
          notes: prescriptionNotes.trim(),
          diagnosis: prescriptionDiagnosis.trim() || undefined,
          instructions: prescriptionInstructions.trim() || undefined,
        })
      ).data,
    onSuccess: async () => {
      setError(null)
      await invalidateDoctorData()
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  })

  const signPrescriptionMutation = useMutation({
    mutationFn: async (id: string) =>
      (
        await api.patch<Prescription>(`/prescriptions/${id}/sign`, {
          notes: prescriptionNotes.trim() || undefined,
          diagnosis: prescriptionDiagnosis.trim() || undefined,
          instructions: prescriptionInstructions.trim() || undefined,
        })
      ).data,
    onSuccess: async () => {
      setError(null)
      await invalidateDoctorData()
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  })

  const simplePrescriptionMutation = useMutation({
    mutationFn: async (payload: { id: string; action: 'send-patient' | 'send-pharmacy' }) =>
      (await api.patch<Prescription>(`/prescriptions/${payload.id}/${payload.action}`)).data,
    onSuccess: async () => {
      setError(null)
      await invalidateDoctorData()
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  })

  const uploadPrescriptionMutation = useMutation({
    mutationFn: async (payload: { id: string; file: File }) => {
      const formData = new FormData()
      formData.append('file', payload.file)
      return (
        await api.patch<Prescription>(`/prescriptions/${payload.id}/upload-document`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      ).data
    },
    onSuccess: async () => {
      setError(null)
      setDocumentFile(null)
      await invalidateDoctorData()
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  })

  const createLabOrderMutation = useMutation({
    mutationFn: async () => {
      const tests = labTests.map((test, index) => ({
        title: test.title.trim() || `Test ${index + 1}`,
        description: test.description.trim(),
      }))
      return (
        await api.post<LabOrder>('/labs/orders', {
          appointmentId,
          diagnosticId: selectedDiagnosticId,
          tests,
        })
      ).data
    },
    onSuccess: async () => {
      setError(null)
      setLabTests([emptyLabTestDraft(0)])
      await invalidateDoctorData()
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  })

  const loading =
    appointmentsQuery.isLoading ||
    prescriptionsQuery.isLoading ||
    labsQuery.isLoading ||
    diagnosticsQuery.isLoading ||
    pharmaciesQuery.isLoading

  const patientName =
    appointment?.patientSnapshot?.fullName?.trim() ||
    appointment?.patientSnapshot?.email?.trim() ||
    appointment?.patientId ||
    'Unknown patient'

  if (loading) {
    return (
      <div className="page">
        <p className="state">Loading appointment details...</p>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="page">
        <p className="error">Appointment not found.</p>
        <Link to="/doctor/appointments" className="quick-link">
          Back to appointments
        </Link>
      </div>
    )
  }

  const onCreatePrescription = (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    if (!selectedPharmacyId || !prescriptionNotes.trim()) {
      setError('Select pharmacy and provide notes.')
      return
    }
    createPrescriptionMutation.mutate()
  }

  const onCreateLabOrder = (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    if (!selectedDiagnosticId) {
      setError('Select diagnostic user.')
      return
    }
    if (
      !labTests.length ||
      labTests.some((test) => !test.title.trim() || !test.description.trim())
    ) {
      setError('Provide title and description for each requested test.')
      return
    }
    createLabOrderMutation.mutate()
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Appointment Details</h1>
          <p>
            {patientName} ({appointment.patientId})
          </p>
          <p className="muted">Appointment Ref: {appointment.id}</p>
          <Link to={`/doctor/patients/${appointment.patientId}/profile`} className="quick-link">
            View Patient Profile
          </Link>
        </div>
      </div>

      {error ? <p className="error">{error}</p> : null}

      <section className="card">
        <div className="actions">
          {(['overview', 'actions', 'prescription', 'lab', 'report'] as DetailsTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              className={activeTab === tab ? 'tab active' : 'tab'}
              onClick={() => setActiveTab(tab)}
            >
              {tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {activeTab === 'overview' ? (
        <section className="card">
          <h3>Overview</h3>
          <p>Status: {appointment.status}</p>
          <p>
            Scheduled:{' '}
            {appointment.scheduledAt
              ? new Date(appointment.scheduledAt).toLocaleString()
              : 'Pending doctor schedule'}
          </p>
          <p>
            Preferred window:{' '}
            {appointment.preferredDateFrom || appointment.preferredDateTo
              ? `${appointment.preferredDateFrom ? new Date(appointment.preferredDateFrom).toLocaleString() : '-'} -> ${appointment.preferredDateTo ? new Date(appointment.preferredDateTo).toLocaleString() : '-'}`
              : 'Not provided'}
          </p>
          <p>Preferred time: {appointment.preferredTimeNote ?? 'Not provided'}</p>
          <p>Reason: {appointment.reason ?? 'Not provided'}</p>
          <p>Requires lab: {String(appointment.requiresLab)}</p>
          <p>Lab lock: {String(appointment.labFlowLocked)}</p>
        </section>
      ) : null}

      {activeTab === 'actions' ? (
        <section className="card">
          <h3>Workflow Actions</h3>
          {appointment.status === 'REQUESTED' ? (
            <div className="stack">
              <label htmlFor="scheduleAt">Assign New Time</label>
              <input
                id="scheduleAt"
                type="datetime-local"
                value={scheduleAt}
                onChange={(e) => setScheduleAt(e.target.value)}
              />
              <button
                type="button"
                disabled={!scheduleAt || scheduleMutation.isPending}
                onClick={() =>
                  scheduleMutation.mutate({
                    id: appointment.id,
                    scheduledAt: new Date(scheduleAt).toISOString(),
                  })
                }
              >
                Assign New Time
              </button>
            </div>
          ) : null}

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
        </section>
      ) : null}

      {activeTab === 'prescription' ? (
        <section className="card">
          <h3>Prescription</h3>
          <div className="grid two-col">
            <div className="stack">
              <h4>Upload / Suggest</h4>
              {appointmentPrescription ? (
                <>
                  <p>Prescription ID: {appointmentPrescription.id}</p>
                  <p>Status: {appointmentPrescription.status}</p>
                  <label htmlFor="prescriptionNotes">Notes</label>
                  <textarea
                    id="prescriptionNotes"
                    rows={3}
                    value={prescriptionNotes}
                    onChange={(e) => setPrescriptionNotes(e.target.value)}
                  />
                  <label htmlFor="prescriptionDiagnosis">Diagnosis</label>
                  <input
                    id="prescriptionDiagnosis"
                    value={prescriptionDiagnosis}
                    onChange={(e) => setPrescriptionDiagnosis(e.target.value)}
                  />
                  <label htmlFor="prescriptionInstructions">Instructions</label>
                  <textarea
                    id="prescriptionInstructions"
                    rows={3}
                    value={prescriptionInstructions}
                    onChange={(e) => setPrescriptionInstructions(e.target.value)}
                  />
                  <div className="actions">
                    <button
                      type="button"
                      disabled={signPrescriptionMutation.isPending || appointmentPrescription.status !== 'DRAFT'}
                      onClick={() => signPrescriptionMutation.mutate(appointmentPrescription.id)}
                    >
                      Sign & Update
                    </button>
                    <button
                      type="button"
                      disabled={simplePrescriptionMutation.isPending || appointmentPrescription.status !== 'SIGNED'}
                      onClick={() =>
                        simplePrescriptionMutation.mutate({
                          id: appointmentPrescription.id,
                          action: 'send-patient',
                        })
                      }
                    >
                      Send to Patient
                    </button>
                    <button
                      type="button"
                      disabled={
                        simplePrescriptionMutation.isPending ||
                        appointmentPrescription.status !== 'SENT_TO_PATIENT'
                      }
                      onClick={() =>
                        simplePrescriptionMutation.mutate({
                          id: appointmentPrescription.id,
                          action: 'send-pharmacy',
                        })
                      }
                    >
                      Send to Pharmacy
                    </button>
                  </div>

                  {appointmentPrescription.documentUrl ? (
                    <a href={appointmentPrescription.documentUrl} target="_blank" rel="noreferrer">
                      Open Uploaded Document
                    </a>
                  ) : (
                    <p className="muted">No document uploaded</p>
                  )}

                  <input
                    type="file"
                    accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(e) => setDocumentFile(e.target.files?.[0] ?? null)}
                  />
                  <button
                    type="button"
                    disabled={!documentFile || uploadPrescriptionMutation.isPending}
                    onClick={() => {
                      if (!documentFile) return
                      uploadPrescriptionMutation.mutate({ id: appointmentPrescription.id, file: documentFile })
                    }}
                  >
                    Upload Document
                  </button>
                </>
              ) : (
                <form onSubmit={onCreatePrescription} className="stack">
                  <p className="muted">No prescription exists for this appointment yet.</p>
                  <label htmlFor="pharmacyId">Pharmacy</label>
                  <select
                    id="pharmacyId"
                    value={selectedPharmacyId}
                    onChange={(e) => setSelectedPharmacyId(e.target.value)}
                  >
                    <option value="">Select pharmacy</option>
                    {(pharmaciesQuery.data ?? []).map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.fullName ? `${item.fullName} (${item.email})` : item.email}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="newPrescriptionNotes">Notes</label>
                  <textarea
                    id="newPrescriptionNotes"
                    rows={3}
                    value={prescriptionNotes}
                    onChange={(e) => setPrescriptionNotes(e.target.value)}
                  />
                  <label htmlFor="newPrescriptionDiagnosis">Diagnosis</label>
                  <input
                    id="newPrescriptionDiagnosis"
                    value={prescriptionDiagnosis}
                    onChange={(e) => setPrescriptionDiagnosis(e.target.value)}
                  />
                  <label htmlFor="newPrescriptionInstructions">Instructions</label>
                  <textarea
                    id="newPrescriptionInstructions"
                    rows={3}
                    value={prescriptionInstructions}
                    onChange={(e) => setPrescriptionInstructions(e.target.value)}
                  />
                  <button type="submit" disabled={createPrescriptionMutation.isPending}>
                    Create Prescription
                  </button>
                </form>
              )}
            </div>

            <div className="stack">
              <h4>Given Prescriptions</h4>
              {appointmentPrescriptions.length > 0 ? (
                <ul className="list">
                  {appointmentPrescriptions.map((item) => (
                    <li key={item.id}>
                      <div>
                        <p>
                          <span className={prescriptionStatusClass(item.status)}>{item.status}</span>
                        </p>
                        <p className="muted">Prescription Ref: {item.id}</p>
                        <p className="muted">Sent to: {getPharmacyLabel(item)}</p>
                        <p><strong>Notes:</strong> {item.notes || 'Not provided'}</p>
                        <p><strong>Diagnosis:</strong> {item.diagnosis || 'Not provided'}</p>
                        <p><strong>Instructions:</strong> {item.instructions || 'Not provided'}</p>
                        {item.documentUrl ? (
                          <a href={item.documentUrl} target="_blank" rel="noreferrer" className="quick-link">
                            Open Uploaded Document
                          </a>
                        ) : (
                          <p className="muted">No document uploaded</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">No prescription exists for this appointment.</p>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'lab' ? (
        <section className="card">
          <h3>Lab</h3>
          <div className="grid two-col">
            <div className="stack">
              <h4>Create Lab Order</h4>
              <form onSubmit={onCreateLabOrder} className="stack">
                <p className="muted">
                  {appointmentLabOrders.length > 0
                    ? 'Additional lab orders are allowed for this appointment.'
                    : 'No lab order exists for this appointment yet.'}
                </p>
                <label htmlFor="diagnosticId">Diagnostic</label>
                <select
                  id="diagnosticId"
                  value={selectedDiagnosticId}
                  onChange={(e) => setSelectedDiagnosticId(e.target.value)}
                >
                  <option value="">Select diagnostic</option>
                  {(diagnosticsQuery.data ?? []).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.fullName ? `${item.fullName} (${item.email})` : item.email}
                    </option>
                  ))}
                </select>
                <section className="stack" aria-label="appointment-lab-test-builder">
                  <strong>Requested Tests</strong>
                  {labTests.map((test, index) => (
                    <div key={`appointment-lab-test-${index}`} className="grid two-col">
                      <input
                        aria-label={`Test ${index + 1} Title`}
                        value={test.title}
                        placeholder={`Test ${index + 1}`}
                        onChange={(e) =>
                          setLabTests((current) =>
                            current.map((item, idx) =>
                              idx === index ? { ...item, title: e.target.value } : item,
                            ),
                          )
                        }
                      />
                      <div className="actions">
                        <input
                          aria-label={`Test ${index + 1} Description`}
                          value={test.description}
                          placeholder={`Description for Test ${index + 1}`}
                          onChange={(e) =>
                            setLabTests((current) =>
                              current.map((item, idx) =>
                                idx === index ? { ...item, description: e.target.value } : item,
                              ),
                            )
                          }
                        />
                        <button
                          type="button"
                          disabled={labTests.length === 1}
                          onClick={() =>
                            setLabTests((current) =>
                              current
                                .filter((_, idx) => idx !== index)
                                .map((item, idx) => ({
                                  ...item,
                                  title: item.title || `Test ${idx + 1}`,
                                })),
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setLabTests((current) => [...current, emptyLabTestDraft(current.length)])}
                  >
                    Add Test
                  </button>
                </section>
                <button type="submit" disabled={createLabOrderMutation.isPending}>
                  Create Lab Order
                </button>
              </form>
            </div>

            <div className="stack">
              <h4>Lab Orders</h4>
              {appointmentLabOrders.length > 0 ? (
                <ul className="list">
                  {appointmentLabOrders.map((item) => (
                    <li key={item.id}>
                      <div>
                        <p>
                          <span className={labStatusClass(item.status)}>{item.status}</span>
                        </p>
                        <p className="muted">Lab Order Ref: {item.id}</p>
                        <div>
                          <strong>Tests</strong>
                          {item.tests?.length ? (
                            <ul>
                              {item.tests.map((test, index) => (
                                <li key={`${item.id}-test-${index}`}>
                                  {test.title}: {test.description?.trim() || 'Not specified'}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="muted">No tests listed</p>
                          )}
                        </div>
                        {getReports(item).length > 0 ? (
                          <div className="stack">
                            <strong>Reports</strong>
                            {getReports(item).map((report, index) => (
                              <a
                                key={report.id}
                                href={report.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="quick-link"
                              >
                                Open Report {index + 1}
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className="muted">Report pending</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">No lab order exists for this appointment.</p>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'report' ? (
        <section className="card">
          <h3>Lab Report</h3>
          {appointmentLabOrdersWithReports.length > 0 ? (
            <div className="stack">
              {appointmentLabOrdersWithReports.map((item) => (
                <section key={item.id} className="stack">
                  <p className="muted">Lab Order Ref: {item.id}</p>
                  <div className="stack">
                    {item.reports.map((report, index) => (
                      <a key={report.id} href={report.fileUrl} target="_blank" rel="noreferrer">
                        Open Report {index + 1}
                      </a>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <p className="muted">No lab report uploaded yet.</p>
          )}
        </section>
      ) : null}
    </div>
  )
}

const prescriptionStatusClass = (status: Prescription['status']) => {
  if (status === 'SIGNED') return 'status status-blue'
  if (status === 'SENT_TO_PATIENT' || status === 'SENT_TO_PHARMACY') return 'status status-yellow'
  if (status === 'DISPENSED') return 'status status-green'
  return 'status status-gray'
}

const labStatusClass = (status: LabOrder['status']) => {
  if (status === 'SENT') return 'status status-green'
  if (status === 'ASSIGNED' || status === 'SAMPLE_COLLECTED') return 'status status-blue'
  if (status === 'CREATED') return 'status status-yellow'
  return 'status status-gray'
}

function getReports(order: LabOrder) {
  if (order.labReports?.length) {
    return order.labReports
  }
  return order.latestReport ? [order.latestReport] : order.labResult ? [order.labResult] : []
}

function getPharmacyLabel(prescription: Prescription) {
  const pharmacyName = prescription.pharmacySnapshot?.pharmacyName?.trim()
  const fullName = prescription.pharmacySnapshot?.fullName?.trim()
  const email = prescription.pharmacySnapshot?.email?.trim()

  if (pharmacyName) return pharmacyName
  if (fullName) return fullName
  if (email) return email
  return 'Not assigned'
}
