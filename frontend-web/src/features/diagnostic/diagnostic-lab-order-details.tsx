import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, getApiErrorMessage } from '../../lib/api'
import type { LabOrder, LabOrderStatus } from '../../types'
import { useDiagnosticLabOrders } from './diagnostic-shared'

export function DiagnosticLabOrderDetailsPage() {
  const { orderId } = useParams()
  const queryClient = useQueryClient()
  const labOrdersQuery = useDiagnosticLabOrders()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const order = useMemo(
    () => (labOrdersQuery.data ?? []).find((item) => item.id === orderId),
    [labOrdersQuery.data, orderId],
  )

  const statusMutation = useMutation({
    mutationFn: async (payload: { id: string; action: 'assign' | 'sample-collected' }) =>
      (await api.patch(`/labs/orders/${payload.id}/${payload.action}`)).data,
    onSuccess: async () => {
      setError(null)
      setStatusMessage('Lab order status updated.')
      await queryClient.invalidateQueries({ queryKey: ['labs'] })
      await queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: (err) => {
      setStatusMessage(null)
      setError(getApiErrorMessage(err))
    },
  })

  const uploadMutation = useMutation({
    mutationFn: async (payload: { id: string; files: File[] }) => {
      const formData = new FormData()
      payload.files.forEach((file) => formData.append('files', file))
      return (
        await api.patch(`/labs/orders/${payload.id}/result-uploaded`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      ).data
    },
    onSuccess: async () => {
      setError(null)
      setStatusMessage('Report sent to doctor and patient.')
      setSelectedFiles([])
      await queryClient.invalidateQueries({ queryKey: ['labs'] })
      await queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: (err) => {
      setStatusMessage(null)
      setError(getApiErrorMessage(err))
    },
  })

  if (labOrdersQuery.isLoading) {
    return (
      <div className="page diagnostic-page diagnostic-lab-order-details-page">
        <p className="state">Loading lab order details...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="page diagnostic-page diagnostic-lab-order-details-page">
        <p className="error">Lab order not found.</p>
        <Link to="/diagnostic/lab-orders" className="quick-link">
          Back to lab orders
        </Link>
      </div>
    )
  }

  const reports = getReports(order)
  const patientName =
    order.appointment?.patient?.fullName ||
    order.patientClinicalSnapshot?.fullName ||
    order.appointment?.patient?.email ||
    order.patientClinicalSnapshot?.email ||
    'Unknown patient'
  const patientEmail = order.appointment?.patient?.email || order.patientClinicalSnapshot?.email || 'No email'

  const onAdvanceStatus = (action: 'assign' | 'sample-collected') => {
    setStatusMessage(null)
    setError(null)
    statusMutation.mutate({ id: order.id, action })
  }

  const onUpload = () => {
    if (!selectedFiles.length) {
      setStatusMessage(null)
      setError('Select one or more PDF/image report files before upload.')
      return
    }
    setStatusMessage(null)
    setError(null)
    uploadMutation.mutate({ id: order.id, files: selectedFiles })
  }

  return (
    <div className="page diagnostic-page diagnostic-lab-order-details-page">
      <div className="page-head">
        <div>
          <h1>Lab Order Details</h1>
          <p>{patientName}</p>
          <p className="muted">{patientEmail}</p>
          <p className="muted">Order Ref: {order.id}</p>
          <p className="muted">Appointment Ref: {order.appointmentId}</p>
        </div>
        <Link to="/diagnostic/lab-orders" className="quick-link">
          Back to list
        </Link>
      </div>

      {statusMessage ? <p>{statusMessage}</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <section className="card">
        <p>
          <span className={labStatusClass(order.status)}>{order.status}</span>
        </p>
        <p className="muted">
          Age: {order.patientClinicalSnapshot?.ageYears ?? 'N/A'} | Gender:{' '}
          {order.patientClinicalSnapshot?.gender ?? 'N/A'} | Phone:{' '}
          {order.patientClinicalSnapshot?.phone ?? 'N/A'}
        </p>
      </section>

      <section className="card">
        <h3>Requested Tests</h3>
        {order.tests?.length ? (
          <ul className="list">
            {order.tests.map((test, index) => (
              <li key={`${order.id}-test-${index}`}>
                <div>
                  <strong>{test.title}</strong>
                  <p className="muted">{test.description?.trim() || 'Not specified'}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">No tests listed</p>
        )}
      </section>

      <section className="card stack">
        <h3>Workflow Actions</h3>
        <div className="actions">
          <button
            type="button"
            onClick={() => onAdvanceStatus('assign')}
            disabled={order.status !== 'CREATED' || statusMutation.isPending}
          >
            Mark Assigned
          </button>
          <button
            type="button"
            onClick={() => onAdvanceStatus('sample-collected')}
            disabled={order.status !== 'ASSIGNED' || statusMutation.isPending}
          >
            Mark Sample Collected
          </button>
        </div>
      </section>

      <section className="card stack">
        <h3>Upload Reports</h3>
        <input
          type="file"
          multiple
          aria-label={`Upload report files for ${order.id}`}
          accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
          onChange={(e) => {
            const files = e.target.files ? Array.from(e.target.files) : []
            setSelectedFiles((prev) => [...prev, ...files])
            e.currentTarget.value = ''
          }}
        />
        {selectedFiles.length ? (
          <div className="stack">
            <div className="actions">
              <p className="muted">Selected files: {selectedFiles.length}</p>
              <button type="button" className="tab" onClick={() => setSelectedFiles([])}>
                Clear all
              </button>
            </div>
            <div className="diagnostic-file-chips">
              {selectedFiles.map((file, index) => (
                <span key={`${order.id}-${file.name}-${index}`} className="diagnostic-file-chip">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    className="chip-remove"
                    aria-label={`Remove ${file.name}`}
                    onClick={() =>
                      setSelectedFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index))
                    }
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>
        ) : null}
        <button
          type="button"
          onClick={onUpload}
          disabled={uploadMutation.isPending || selectedFiles.length === 0}
        >
          Upload Selected Reports
        </button>
      </section>

      <section className="card">
        <h3>Uploaded Reports</h3>
        {reports.length ? (
          <ul className="list">
            {reports.map((report) => (
              <li key={report.id}>
                <div>
                  <p className="muted">{new Date(report.uploadedAt).toLocaleString()}</p>
                </div>
                <a href={report.fileUrl} target="_blank" rel="noreferrer" className="quick-link">
                  Open Report
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">No reports uploaded yet.</p>
        )}
      </section>
    </div>
  )
}

function getReports(order: LabOrder) {
  if (order.labReports?.length) {
    return order.labReports
  }
  return order.latestReport ? [order.latestReport] : order.labResult ? [order.labResult] : []
}

const labStatusClass = (status: LabOrderStatus) => {
  if (status === 'SENT') return 'status status-green'
  if (status === 'ASSIGNED' || status === 'SAMPLE_COLLECTED') return 'status status-blue'
  if (status === 'CREATED') return 'status status-yellow'
  return 'status status-gray'
}
