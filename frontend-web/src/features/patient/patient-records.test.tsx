import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PatientRecordsPage } from './patient-records'

const getMock = vi.fn()

vi.mock('../../lib/api', () => ({
  api: {
    get: (...args: unknown[]) => getMock(...args),
  },
}))

function renderRecordsPage(initialEntry = '/patient/records') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <PatientRecordsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('PatientRecordsPage', () => {
  beforeEach(() => {
    getMock.mockReset()
    getMock.mockImplementation((url: string) => {
      if (url === '/prescriptions/me') {
        return Promise.resolve({
          data: [
            {
              id: 'rx-1',
              appointmentId: 'apt-1',
              notes: 'Take medicine',
              diagnosis: 'Flu',
              instructions: 'After meal',
              status: 'SENT_TO_PATIENT',
              documentUrl: 'https://example.com/prescription.pdf',
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
              tests: [{ title: 'CBC' }],
              diagnosticSnapshot: {
                name: 'City Diagnostic Lab',
                address: 'Banani, Dhaka',
                phone: '+8801700000099',
              },
              labReports: [
                {
                  id: 'rep-2',
                  labOrderId: 'lab-1',
                  fileUrl: 'https://example.com/report-2.pdf',
                  uploadedAt: '2026-01-02T00:00:00.000Z',
                },
                {
                  id: 'rep-1',
                  labOrderId: 'lab-1',
                  fileUrl: 'https://example.com/report-1.pdf',
                  uploadedAt: '2026-01-01T00:00:00.000Z',
                },
              ],
            },
          ],
        })
      }
      return Promise.resolve({ data: [] })
    })
  })

  it('renders prescriptions by default and shows document link', async () => {
    renderRecordsPage()

    expect(await screen.findByText(/Prescription #rx-1/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open Document' })).toHaveAttribute(
      'href',
      'https://example.com/prescription.pdf',
    )
  })

  it('switches tabs and shows reports with file links', async () => {
    const user = userEvent.setup()
    renderRecordsPage()

    await screen.findByText(/Prescription #rx-1/i)
    await user.click(screen.getByRole('button', { name: /Reports/i }))

    expect(await screen.findByText(/Reports for Lab Order #lab-1/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open Report 1' })).toHaveAttribute(
      'href',
      'https://example.com/report-2.pdf',
    )
    expect(screen.getByRole('link', { name: 'Open Report 2' })).toHaveAttribute(
      'href',
      'https://example.com/report-1.pdf',
    )
  })

  it('shows test title with description fallback in lab orders tab', async () => {
    const user = userEvent.setup()
    renderRecordsPage()

    await screen.findByText(/Prescription #rx-1/i)
    await user.click(screen.getByRole('button', { name: /Lab Orders/i }))

    expect(await screen.findByText('CBC: Not specified')).toBeInTheDocument()
    expect(screen.getByText('Lab: City Diagnostic Lab')).toBeInTheDocument()
    expect(screen.getByText('Address: Banani, Dhaka')).toBeInTheDocument()
    expect(screen.getByText('Phone: +8801700000099')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open Appointment' })).toHaveAttribute(
      'href',
      '/patient/appointments/apt-1',
    )
  })

  it('supports tab from query string', async () => {
    renderRecordsPage('/patient/records?tab=reports')

    expect(await screen.findByText(/Reports for Lab Order #lab-1/i)).toBeInTheDocument()
  })
})
