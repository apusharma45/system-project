import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createTestQueryClient } from '../../test/query-client'
import { PatientDoctorDetailsPage } from './patient-doctor-details'

const getMock = vi.fn()

vi.mock('../../lib/api', () => ({
  api: {
    get: (...args: unknown[]) => getMock(...args),
  },
}))

function renderPage(path: string) {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/patient/doctors/:doctorId" element={<PatientDoctorDetailsPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('PatientDoctorDetailsPage', () => {
  beforeEach(() => {
    getMock.mockReset()
  })

  it('renders doctor details sections', async () => {
    getMock.mockResolvedValueOnce({
      data: {
        doctor: {
          id: 'doctor-1',
          fullName: 'Dr Alice',
          email: 'alice@example.com',
          role: 'DOCTOR',
          specialization: 'Cardiology',
          yearsOfExperience: 9,
          degrees: ['MBBS', 'MD'],
          about: 'Senior consultant cardiologist',
          clinicName: 'Heart Care',
          clinicAddress: 'Dhaka',
          clinicPhone: '+8801700000001',
          availableTimeSlots: [{ day: 'MONDAY', startTime: '09:00', endTime: '12:00' }],
        },
      },
    })

    renderPage('/patient/doctors/doctor-1')

    expect(await screen.findByRole('heading', { name: 'Doctor Details' })).toBeInTheDocument()
    expect(await screen.findByText('Specialization: Cardiology')).toBeInTheDocument()
    expect(screen.getByText('Experience: 9 years')).toBeInTheDocument()
    expect(screen.getByText('Senior consultant cardiologist')).toBeInTheDocument()
    expect(screen.getByText('MONDAY: 09:00 - 12:00')).toBeInTheDocument()
  })

  it('renders fallback when doctor details cannot be loaded', async () => {
    getMock.mockRejectedValueOnce(new Error('boom'))

    renderPage('/patient/doctors/missing')

    expect(await screen.findByText('Failed to load doctor details.')).toBeInTheDocument()
  })
})
