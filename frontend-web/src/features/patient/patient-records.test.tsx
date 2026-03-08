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
              status: 'RESULT_UPLOADED',
              tests: [{ title: 'CBC' }],
              labResult: { fileUrl: 'https://example.com/report.pdf' },
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

    expect(await screen.findByText(/Report for Lab Order #lab-1/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open Report' })).toHaveAttribute(
      'href',
      'https://example.com/report.pdf',
    )
  })

  it('supports tab from query string', async () => {
    renderRecordsPage('/patient/records?tab=reports')

    expect(await screen.findByText(/Report for Lab Order #lab-1/i)).toBeInTheDocument()
  })
})
