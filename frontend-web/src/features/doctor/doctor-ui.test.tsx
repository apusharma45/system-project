import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppLayout } from '../../app/layout'
import { DoctorAppointmentDetailsPage } from './doctor-appointment-details'
import { DoctorAppointmentsPage } from './doctor-appointments'
import { DoctorHome } from './doctor-home'
import { DoctorLabOrdersPage } from './doctor-lab-orders'
import { DoctorNotificationsPage } from './doctor-notifications'
import { DoctorPatientsPage } from './doctor-patients'
import { DoctorPatientProfilePage } from './doctor-patient-profile'
import { DoctorProfilePage } from './doctor-profile'
import { DoctorPrescriptionsPage } from './doctor-prescriptions'
import { createTestQueryClient } from '../../test/query-client'

const patchMock = vi.fn()
const postMock = vi.fn()

const authState = {
  user: { role: 'DOCTOR' as const, fullName: 'Dr. Demo', email: 'doctor@example.com' },
  loading: false,
  token: null,
  logout: vi.fn(),
  login: vi.fn(),
  refreshUser: vi.fn(),
}

const doctorData = {
  appointments: [
    {
      id: 'apt-1',
      patientId: 'patient-1',
      doctorId: 'doctor-1',
      status: 'REQUESTED' as const,
      scheduledAt: null,
      preferredDateFrom: '2026-02-28T08:00:00.000Z',
      preferredDateTo: '2026-02-28T10:00:00.000Z',
      preferredTimeNote: 'Evening',
      reason: 'Fever follow-up',
      requiresLab: true,
      labFlowLocked: false,
      patientSnapshot: { id: 'patient-1', fullName: 'Alice Smith', email: 'alice@example.com' },
    },
    {
      id: 'apt-2',
      patientId: 'patient-2',
      doctorId: 'doctor-1',
      status: 'EXAM_DONE' as const,
      scheduledAt: '2026-02-27T09:00:00.000Z',
      requiresLab: false,
      labFlowLocked: false,
      patientSnapshot: { id: 'patient-2', fullName: 'John Doe', email: 'john@example.com' },
    },
  ],
  prescriptions: [
    {
      id: 'rx-1',
      appointmentId: 'apt-2',
      doctorId: 'doctor-1',
      pharmacyId: 'pharmacy-1',
      pharmacySnapshot: {
        id: 'pharmacy-1',
        pharmacyName: 'Prime Pharmacy',
        fullName: 'Prime Rx',
        email: 'pharm@test.com',
      },
      notes: 'Take once daily',
      status: 'DRAFT' as const,
      appointment: {
        patientId: 'patient-2',
        patient: { id: 'patient-2', fullName: 'John Doe', email: 'john@example.com' },
      },
    },
  ],
  labs: [
    {
      id: 'lab-1',
      appointmentId: 'apt-1',
      diagnosticId: 'diag-1',
      status: 'SENT' as const,
      tests: [{ title: 'Test 1', description: 'CBC panel' }],
      appointment: {
        patientId: 'patient-1',
        patient: { id: 'patient-1', fullName: 'Alice Smith', email: 'alice@example.com' },
      },
      labReports: [
        {
          id: 'lr-2',
          labOrderId: 'lab-1',
          fileUrl: 'https://files.test/lab-1-report-2.pdf',
          uploadedAt: '2026-03-02T10:00:00.000Z',
        },
        {
          id: 'lr-1',
          labOrderId: 'lab-1',
          fileUrl: 'https://files.test/lab-1-report-1.pdf',
          uploadedAt: '2026-03-01T10:00:00.000Z',
        },
      ],
      latestReport: {
        id: 'lr-2',
        labOrderId: 'lab-1',
        fileUrl: 'https://files.test/lab-1-report-2.pdf',
        uploadedAt: '2026-03-02T10:00:00.000Z',
      },
      labResult: {
        id: 'lr-2',
        labOrderId: 'lab-1',
        fileUrl: 'https://files.test/lab-1-report-2.pdf',
        uploadedAt: '2026-03-02T10:00:00.000Z',
      },
    },
  ],
  notifications: [
    {
      id: 'n-1',
      userId: 'doctor-1',
      type: 'APPOINTMENT_CALLED' as const,
      message: 'Patient called in',
      read: false,
      createdAt: '2026-02-28T10:00:00.000Z',
    },
  ],
  diagnostics: [{ id: 'diag-1', email: 'diag@test.com', role: 'DIAGNOSTIC' as const }],
  pharmacies: [{ id: 'pharmacy-1', email: 'pharm@test.com', role: 'PHARMACY' as const }],
  profile: {
    doctor: {
      id: 'doctor-1',
      fullName: 'Dr. Demo',
      email: 'doctor@example.com',
      role: 'DOCTOR' as const,
      phone: '+8801700000001',
      address: 'Dhaka',
      joinedAt: '2026-02-20T00:00:00.000Z',
      profile: {
        specialization: 'Cardiology',
        licenseNumber: 'DOC-1001',
        gender: 'MALE',
        dateOfBirth: '1988-01-01T00:00:00.000Z',
      },
    },
  },
}

vi.mock('../auth/auth-context', () => ({
  useAuth: () => authState,
}))

vi.mock('../../lib/api', () => ({
  api: {
    patch: (...args: unknown[]) => patchMock(...args),
    post: (...args: unknown[]) => postMock(...args),
  },
  getApiErrorMessage: () => 'api-error',
}))

vi.mock('./doctor-shared', () => ({
  useDoctorAppointments: () => ({ data: doctorData.appointments }),
  useDoctorPrescriptions: () => ({ data: doctorData.prescriptions }),
  useDoctorLabOrders: () => ({ data: doctorData.labs }),
  useDoctorNotifications: () => ({ data: doctorData.notifications }),
  useDoctorDiagnostics: () => ({ data: doctorData.diagnostics }),
  useDoctorPharmacies: () => ({ data: doctorData.pharmacies }),
  useDoctorPatientProfile: () => ({
    data: {
      patient: {
        id: 'patient-1',
        fullName: 'Alice Smith',
        email: 'alice@example.com',
        profile: {},
      },
      summary: { appointmentCount: 1, labOrderCount: 1, prescriptionCount: 1 },
      history: { appointments: [], labOrders: [], prescriptions: [] },
    },
    isLoading: false,
    isError: false,
  }),
  useDoctorMyProfile: () => ({ data: doctorData.profile, isLoading: false, isError: false }),
}))

vi.mock('../diagnostic/diagnostic-shared', () => ({
  useDiagnosticNotifications: () => ({ data: [] }),
}))

function renderDoctorRoute(path: string, element: ReactNode) {
  const queryClient = createTestQueryClient()

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/doctor" element={<DoctorHome />} />
            <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />
            <Route path="/doctor/appointments/:appointmentId" element={<DoctorAppointmentDetailsPage />} />
            <Route path="/doctor/patients" element={<DoctorPatientsPage />} />
            <Route path="/doctor/patients/:patientId/profile" element={<DoctorPatientProfilePage />} />
            <Route path="/doctor/prescriptions" element={<DoctorPrescriptionsPage />} />
            <Route path="/doctor/lab-orders" element={<DoctorLabOrdersPage />} />
            <Route path="/doctor/notifications" element={<DoctorNotificationsPage />} />
            <Route path="/doctor/profile" element={<DoctorProfilePage />} />
            <Route path="/doctor/test" element={element} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('doctor UI regression', () => {
  beforeEach(() => {
    patchMock.mockReset()
    postMock.mockReset()
    patchMock.mockResolvedValue({ data: {} })
    postMock.mockResolvedValue({ data: {} })
  })

  it('renders doctor navigation labels in app layout', () => {
    renderDoctorRoute('/doctor/test', <div>Layout Test Page</div>)

    expect(screen.getByText('MedFlow')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Appointments')).toBeInTheDocument()
    expect(screen.getByText('Patients')).toBeInTheDocument()
    expect(screen.getByText('Prescriptions')).toBeInTheDocument()
    expect(screen.getByText('Lab Orders')).toBeInTheDocument()
    expect(screen.getByText('Notifications')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Dr. Demo')).toBeInTheDocument()
    expect(screen.getByLabelText('Open profile')).toHaveAttribute('href', '/doctor/profile')
  })

  it('renders dashboard stats and chart sections', () => {
    renderDoctorRoute('/doctor', <div />)

    expect(screen.getByText("Today's Appointments")).toBeInTheDocument()
    expect(screen.getByText('Patient Growth')).toBeInTheDocument()
    expect(screen.getByTestId('weekly-appointments-chart')).toBeInTheDocument()
    expect(screen.getByTestId('patient-growth-chart')).toBeInTheDocument()
    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
  })

  it.each([
    ['/doctor/appointments', 'Appointments'],
    ['/doctor/appointments/apt-1', 'Appointment Details'],
    ['/doctor/patients', 'Patients'],
    ['/doctor/profile', 'Profile'],
    ['/doctor/prescriptions', 'Prescriptions'],
    ['/doctor/lab-orders', 'Lab Orders'],
    ['/doctor/notifications', 'Notification Center'],
  ])('renders key section for route %s', (path, heading) => {
    renderDoctorRoute(path, <div />)
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
  })

  it('appointments list is patient-centric and links to details page', () => {
    renderDoctorRoute('/doctor/appointments', <div />)

    expect(screen.getByText('Alice Smith')).toBeInTheDocument()
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.queryByText('Patient ID: patient-1')).not.toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search by patient name')).toBeInTheDocument()
    const links = screen.getAllByRole('link', { name: 'View Details' })
    expect(links[0]).toHaveAttribute('href', '/doctor/appointments/apt-1')
  })

  it('appointments search by patient name works with status filter', () => {
    renderDoctorRoute('/doctor/appointments', <div />)

    fireEvent.change(screen.getByPlaceholderText('Search by patient name'), {
      target: { value: 'john' },
    })
    fireEvent.change(screen.getByDisplayValue('All Status'), {
      target: { value: 'EXAM_DONE' },
    })

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument()
  })

  it('patients page is identity-first and searchable by name/email', () => {
    renderDoctorRoute('/doctor/patients', <div />)

    expect(document.querySelector('.doctor-patients-page')).toBeTruthy()
    expect(document.querySelector('.patient-card')).toBeTruthy()
    expect(screen.getByPlaceholderText('Search by patient name or email')).toBeInTheDocument()
    expect(screen.getByText('Alice Smith')).toBeInTheDocument()
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.queryByText('Patient ID: patient-1')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View profile for Alice Smith' })).toHaveAttribute(
      'href',
      '/doctor/patients/patient-1/profile',
    )

    fireEvent.change(screen.getByPlaceholderText('Search by patient name or email'), {
      target: { value: 'john@example.com' },
    })

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument()
  })

  it('patients page patient identity link opens patient profile page', () => {
    renderDoctorRoute('/doctor/patients', <div />)

    fireEvent.click(screen.getByRole('link', { name: 'View profile for Alice Smith' }))

    expect(screen.getByRole('heading', { name: 'Patient Profile' })).toBeInTheDocument()
  })

  it('appointment details workflow actions hit appointment endpoints', async () => {
    renderDoctorRoute('/doctor/appointments/apt-1', <div />)

    fireEvent.click(screen.getByRole('button', { name: 'Actions' }))
    fireEvent.click(screen.getByRole('button', { name: 'Approve Preferred' }))

    await waitFor(() => {
      expect(patchMock).toHaveBeenCalledWith('/appointments/apt-1/confirm')
    })

    fireEvent.change(screen.getByLabelText('Assign New Time'), {
      target: { value: '2026-03-01T10:30' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Assign New Time' }))

    await waitFor(() => {
      expect(patchMock).toHaveBeenCalledWith('/appointments/apt-1/schedule', {
        scheduledAt: '2026-03-01T04:30:00.000Z',
      })
    })
  })

  it('appointment details shows preferred context and lab state', () => {
    renderDoctorRoute('/doctor/appointments/apt-1', <div />)

    expect(screen.getByText('Preferred time: Evening')).toBeInTheDocument()
    expect(screen.getByText('Reason: Fever follow-up')).toBeInTheDocument()
    expect(screen.getByText('Requires lab: true')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View Patient Profile' })).toHaveAttribute(
      'href',
      '/doctor/patients/patient-1/profile',
    )
  })

  it('appointment details supports prescription create action', async () => {
    renderDoctorRoute('/doctor/appointments/apt-1', <div />)

    fireEvent.click(screen.getByRole('button', { name: 'Prescription' }))
    expect(screen.getByText('Upload / Suggest')).toBeInTheDocument()
    expect(screen.getByText('Given Prescriptions')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Create / Suggest / Upload' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'View Given Prescriptions' })).not.toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Pharmacy'), { target: { value: 'pharmacy-1' } })
    fireEvent.change(screen.getByLabelText(/^Notes$/), { target: { value: 'Take once daily' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create Prescription' }))

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith('/prescriptions', {
        appointmentId: 'apt-1',
        pharmacyId: 'pharmacy-1',
        notes: 'Take once daily',
        diagnosis: undefined,
        instructions: undefined,
      })
    })
  })

  it('appointment details supports lab create action', async () => {
    renderDoctorRoute('/doctor/appointments/apt-2', <div />)

    fireEvent.click(screen.getByRole('button', { name: 'Lab' }))
    expect(screen.getByRole('button', { name: 'Create Lab Order' })).toBeInTheDocument()
    expect(screen.getByText('No lab order exists for this appointment.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'View Lab Orders' })).not.toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Diagnostic'), { target: { value: 'diag-1' } })
    fireEvent.change(screen.getByLabelText('Test 1 Title'), { target: { value: 'CBC' } })
    fireEvent.change(screen.getByLabelText('Test 1 Description'), { target: { value: 'CBC panel' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add Test' }))
    fireEvent.change(screen.getByLabelText('Test 2 Title'), { target: { value: 'ESR' } })
    fireEvent.change(screen.getByLabelText('Test 2 Description'), { target: { value: 'ESR level' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create Lab Order' }))

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith('/labs/orders', {
        appointmentId: 'apt-2',
        diagnosticId: 'diag-1',
        tests: [
          { title: 'CBC', description: 'CBC panel' },
          { title: 'ESR', description: 'ESR level' },
        ],
      })
    })
  })

  it('appointment details allows creating additional lab orders for same appointment', async () => {
    renderDoctorRoute('/doctor/appointments/apt-1', <div />)

    fireEvent.click(screen.getByRole('button', { name: 'Lab' }))
    expect(screen.getByText('Additional lab orders are allowed for this appointment.')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Diagnostic'), { target: { value: 'diag-1' } })
    fireEvent.change(screen.getByLabelText('Test 1 Title'), { target: { value: 'LFT' } })
    fireEvent.change(screen.getByLabelText('Test 1 Description'), { target: { value: 'Liver function panel' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create Lab Order' }))

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith('/labs/orders', {
        appointmentId: 'apt-1',
        diagnosticId: 'diag-1',
        tests: [{ title: 'LFT', description: 'Liver function panel' }],
      })
    })
  })

  it('appointment details blocks lab create when any test description is missing', async () => {
    renderDoctorRoute('/doctor/appointments/apt-2', <div />)

    fireEvent.click(screen.getByRole('button', { name: 'Lab' }))
    fireEvent.change(screen.getByLabelText('Diagnostic'), { target: { value: 'diag-1' } })
    fireEvent.change(screen.getByLabelText('Test 1 Title'), { target: { value: 'CBC' } })
    fireEvent.change(screen.getByLabelText('Test 1 Description'), { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create Lab Order' }))

    expect(await screen.findByText('Provide title and description for each requested test.')).toBeInTheDocument()
    expect(postMock).not.toHaveBeenCalledWith('/labs/orders', expect.anything())
  })

  it('appointment details prescription and lab view panes are appointment-scoped', () => {
    renderDoctorRoute('/doctor/appointments/apt-2', <div />)

    fireEvent.click(screen.getByRole('button', { name: 'Prescription' }))
    expect(screen.getByText('Given Prescriptions')).toBeInTheDocument()
    expect(screen.getByText('Prescription Ref: rx-1')).toBeInTheDocument()
    expect(screen.getByText('Sent to: Prime Pharmacy')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'View Given Prescriptions' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Lab' }))
    expect(screen.getByText('No lab order exists for this appointment.')).toBeInTheDocument()
    expect(screen.getByText('No lab order exists for this appointment.')).toBeInTheDocument()
    expect(screen.queryByText('Lab Order ID: lab-1')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'View Lab Orders' })).not.toBeInTheDocument()
  })

  it('appointment details shows grouped multi-report links in lab and report tabs', () => {
    renderDoctorRoute('/doctor/appointments/apt-1', <div />)

    fireEvent.click(screen.getByRole('button', { name: 'Lab' }))
    expect(screen.getByText('Lab Order Ref: lab-1')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open Report 1' })).toHaveAttribute(
      'href',
      'https://files.test/lab-1-report-2.pdf',
    )
    expect(screen.getByRole('link', { name: 'Open Report 2' })).toHaveAttribute(
      'href',
      'https://files.test/lab-1-report-1.pdf',
    )

    fireEvent.click(screen.getByRole('button', { name: 'Report' }))
    expect(screen.getByText('Lab Order Ref: lab-1')).toBeInTheDocument()
    const reportLinks = screen.getAllByRole('link', { name: /Open Report/ })
    expect(reportLinks.length).toBeGreaterThanOrEqual(2)
  })

  it('lab orders page shows requested tests and readable patient identity', () => {
    renderDoctorRoute('/doctor/lab-orders', <div />)
    expect(screen.getByText('Tests: Test 1: Test 1')).toBeInTheDocument()
    expect(screen.getByText((text) => text.includes('Patient: Alice Smith (alice@example.com)'))).toBeInTheDocument()
    expect(screen.getByText((text) => text.includes('#apt-1'))).toBeInTheDocument()
  })

  it('prescriptions page is upload-only and shows patient-readable label', () => {
    renderDoctorRoute('/doctor/prescriptions', <div />)

    expect(screen.queryByText('Create Structured Prescription')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Sign' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Send Patient' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Send Pharmacy' })).not.toBeInTheDocument()
    expect(screen.getByText('Patient: John Doe (john@example.com)')).toBeInTheDocument()
    expect(screen.getByText('Sent to: Prime Pharmacy')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Upload Document' })).toBeInTheDocument()
  })

  it('doctor profile page renders read-only identity fields and updates editable contact fields', async () => {
    renderDoctorRoute('/doctor/profile', <div />)

    expect(screen.getByLabelText('Email')).toBeDisabled()
    expect(screen.getByLabelText('Role')).toBeDisabled()
    expect(screen.getByLabelText('Doctor ID')).toBeDisabled()
    expect(screen.getByLabelText('Specialization')).toBeDisabled()
    expect(screen.getByLabelText('License Number')).toBeDisabled()

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Dr. Updated' } })
    fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '+8801700000011' } })
    fireEvent.change(screen.getByLabelText('Address'), { target: { value: 'Updated Clinic' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save Profile' }))

    await waitFor(() => {
      expect(patchMock).toHaveBeenCalledWith('/doctors/me/profile', {
        fullName: 'Dr. Updated',
        phone: '+8801700000011',
        address: 'Updated Clinic',
      })
    })
  })
})



