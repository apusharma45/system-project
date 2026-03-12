import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PatientAppointmentDetailsPage } from './patient-appointment-details'
import { createTestQueryClient } from '../../test/query-client'

const getMock = vi.fn()

vi.mock('../../lib/api', () => ({
  api: {
    get: (...args: unknown[]) => getMock(...args),
  },
}))

function renderDetails(path = '/patient/appointments/apt-1') {
  const queryClient = createTestQueryClient()

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/patient/appointments/:appointmentId" element={<PatientAppointmentDetailsPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('PatientAppointmentDetailsPage', () => {
  beforeEach(() => {
    getMock.mockReset()
    getMock.mockImplementation((url: string) => {
      if (url === '/appointments/me') {
        return Promise.resolve({
          data: [
            {
              id: 'apt-1',
              status: 'REQUESTED',
              doctorId: 'doc-1',
              patientId: 'pat-1',
              scheduledAt: null,
              reason: 'Headache',
              preferredDateFrom: null,
              preferredDateTo: null,
              preferredTimeNote: 'Morning',
              requiresLab: true,
              labFlowLocked: false,
              doctorSnapshot: { id: 'doc-1', fullName: 'Dr. Alice', email: 'alice@example.com' },
            },
          ],
        })
      }
      if (url === '/prescriptions/me') {
        return Promise.resolve({
          data: [
            {
              id: 'rx-1',
              appointmentId: 'apt-1',
              notes: 'Take rest',
              status: 'SIGNED',
              pharmacySnapshot: {
                id: 'ph-1',
                name: 'Prime Pharmacy',
                address: 'Dhanmondi, Dhaka',
                phone: '+8801700001000',
              },
            },
          ],
        })
      }
      if (url === '/labs/orders/me') {
        return Promise.resolve({
          data: [
            {
              id: 'lab-1',
              appointmentId: 'apt-1',
              status: 'SENT',
              diagnosticSnapshot: { name: 'City Diagnostic', address: 'Dhaka', phone: '+8801' },
              tests: [{ title: 'CBC', description: 'Complete blood count' }],
              labReports: [
                { id: 'rep-2', labOrderId: 'lab-1', fileUrl: 'https://files/report-2.pdf', uploadedAt: '2026-01-02T00:00:00.000Z' },
                { id: 'rep-1', labOrderId: 'lab-1', fileUrl: 'https://files/report-1.pdf', uploadedAt: '2026-01-01T00:00:00.000Z' },
              ],
            },
          ],
        })
      }
      return Promise.resolve({ data: [] })
    })
  })

  it('renders appointment scoped doctor/prescription/lab/report details', async () => {
    renderDetails()
    expect(await screen.findByText('Doctor')).toBeInTheDocument()
    expect(screen.getByText('Dr. Alice')).toBeInTheDocument()
    expect(screen.getByText('Prescriptions (1)')).toBeInTheDocument()
    expect(screen.getByText('Pharmacy: Prime Pharmacy')).toBeInTheDocument()
    expect(screen.getByText('Address: Dhanmondi, Dhaka')).toBeInTheDocument()
    expect(screen.getByText('Phone: +8801700001000')).toBeInTheDocument()
    expect(screen.getByText('Lab Orders (1)')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open Report 1' })).toHaveAttribute('href', 'https://files/report-2.pdf')
    expect(screen.getByRole('link', { name: 'Open Report 2' })).toHaveAttribute('href', 'https://files/report-1.pdf')
  }, 15000)

  it('shows not found state for unknown appointment id', async () => {
    renderDetails('/patient/appointments/missing')
    expect(await screen.findByText('Appointment not found')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to appointments' })).toHaveAttribute(
      'href',
      '/patient/appointments',
    )
  })
})
