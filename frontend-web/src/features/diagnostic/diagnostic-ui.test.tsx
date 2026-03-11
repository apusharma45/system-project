import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppLayout } from '../../app/layout'
import { DiagnosticHome } from './diagnostic-home'
import { DiagnosticLabOrdersPage } from './diagnostic-lab-orders'
import { DiagnosticLabOrderDetailsPage } from './diagnostic-lab-order-details'
import { DiagnosticNotificationsPage } from './diagnostic-notifications'
import { DiagnosticProfilePage } from './diagnostic-profile'

const patchMock = vi.fn()
const authState = {
  user: { role: 'DIAGNOSTIC' as const, fullName: 'Prime Lab', email: 'lab@medflow.local' },
  loading: false,
  token: 'diag-token',
  logout: vi.fn(),
  login: vi.fn(),
  refreshUser: vi.fn(),
}

const diagnosticData = {
  labOrders: [
    {
      id: 'order-1',
      appointmentId: 'apt-1',
      diagnosticId: 'diag-1',
      status: 'CREATED' as const,
      tests: [{ title: 'CBC', description: 'CBC' }],
      appointment: { patient: { fullName: 'Alice Smith', email: 'alice@example.com' } },
      patientClinicalSnapshot: { fullName: 'Alice Smith', email: 'alice@example.com', ageYears: 28, gender: 'FEMALE', phone: '+8801700000011' },
      labReports: [],
      labResult: null,
    },
    {
      id: 'order-2',
      appointmentId: 'apt-2',
      diagnosticId: 'diag-1',
      status: 'ASSIGNED' as const,
      tests: [{ title: 'LFT', description: 'LFT' }],
      appointment: { patient: { fullName: 'John Doe', email: 'john@example.com' } },
      patientClinicalSnapshot: { fullName: 'John Doe', email: 'john@example.com', ageYears: 32, gender: 'MALE', phone: '+8801700000012' },
      labReports: [
        { id: 'result-3', labOrderId: 'order-2', fileUrl: 'https://files.test/report-2.pdf', uploadedAt: '2026-03-02T11:00:00.000Z' },
        { id: 'result-2', labOrderId: 'order-2', fileUrl: 'https://files.test/report.pdf', uploadedAt: '2026-03-01T10:00:00.000Z' },
      ],
      latestReport: { id: 'result-3', labOrderId: 'order-2', fileUrl: 'https://files.test/report-2.pdf', uploadedAt: '2026-03-02T11:00:00.000Z' },
      labResult: { id: 'result-3', labOrderId: 'order-2', fileUrl: 'https://files.test/report-2.pdf', uploadedAt: '2026-03-02T11:00:00.000Z' },
    },
  ],
  notifications: [
    {
      id: 'n-1',
      userId: 'diag-1',
      type: 'LAB_RESULT_UPLOADED' as const,
      message: 'Lab result uploaded for your appointment.',
      read: false,
      createdAt: '2026-03-02T10:00:00.000Z',
    },
  ],
  profile: {
    diagnostic: {
      id: 'diag-1',
      fullName: 'Prime Lab',
      email: 'lab@medflow.local',
      role: 'DIAGNOSTIC' as const,
      phone: '+8801700000033',
      address: 'Dhaka',
      joinedAt: '2026-01-01T00:00:00.000Z',
      profile: {
        labName: 'Prime Lab',
        licenseNumber: 'LAB-1001',
        accreditations: ['ISO 15189'],
        availableTests: ['CBC', 'LFT'],
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
  },
  getApiErrorMessage: () => 'api-error',
}))

vi.mock('../doctor/doctor-shared', () => ({
  useDoctorNotifications: () => ({ data: [] }),
}))

vi.mock('../pharmacy/pharmacy-shared', () => ({
  usePharmacyNotifications: () => ({ data: [] }),
}))

vi.mock('./diagnostic-shared', () => ({
  useDiagnosticLabOrders: () => ({ data: diagnosticData.labOrders }),
  useDiagnosticNotifications: () => ({ data: diagnosticData.notifications }),
  useDiagnosticMyProfile: () => ({ data: diagnosticData.profile, isLoading: false, isError: false }),
}))

function renderDiagnosticRoute(path: string, element: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/diagnostic" element={<DiagnosticHome />} />
            <Route path="/diagnostic/lab-orders" element={<DiagnosticLabOrdersPage />} />
            <Route path="/diagnostic/lab-orders/:orderId" element={<DiagnosticLabOrderDetailsPage />} />
            <Route path="/diagnostic/notifications" element={<DiagnosticNotificationsPage />} />
            <Route path="/diagnostic/profile" element={<DiagnosticProfilePage />} />
            <Route path="/diagnostic/test" element={element} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('diagnostic UI regression', () => {
  beforeEach(() => {
    patchMock.mockReset()
  })

  it('renders diagnostic nav labels and clickable profile card in layout', () => {
    renderDiagnosticRoute('/diagnostic/test', <div>Diagnostic Test</div>)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Lab Orders')).toBeInTheDocument()
    expect(screen.getByText('Notifications')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Prime Lab')).toBeInTheDocument()
    expect(screen.getByLabelText('Open profile')).toHaveAttribute('href', '/diagnostic/profile')
  })

  it('lab orders list is compact and links to details page', () => {
    renderDiagnosticRoute('/diagnostic/lab-orders', <div />)

    expect(document.querySelector('.diagnostic-toolbar')).toBeTruthy()
    const detailLinks = screen.getAllByRole('link', { name: 'View Details' })
    expect(detailLinks[0]).toHaveAttribute(
      'href',
      '/diagnostic/lab-orders/order-1',
    )
    expect(screen.queryByRole('button', { name: 'Mark Assigned' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Upload Selected Reports' })).not.toBeInTheDocument()
    expect(screen.getByText('Reports: 0 (pending)')).toBeInTheDocument()
  })

  it('lab order details supports append/remove/clear and bulk upload action', async () => {
    patchMock.mockResolvedValue({ data: {} })
    renderDiagnosticRoute('/diagnostic/lab-orders/order-1', <div />)

    expect(screen.getByRole('heading', { name: 'Lab Order Details' })).toBeInTheDocument()
    expect(screen.getAllByText('CBC').length).toBeGreaterThan(0)

    const fileInput = screen.getByLabelText('Upload report files for order-1')
    const fileOne = new File(['report-content-1'], 'report-1.pdf', { type: 'application/pdf' })
    const fileTwo = new File(['report-content-2'], 'report-2.jpg', { type: 'image/jpeg' })
    const fileThree = new File(['report-content-3'], 'report-3.png', { type: 'image/png' })
    fireEvent.change(fileInput, {
      target: { files: [fileOne, fileTwo] },
    })
    fireEvent.change(fileInput, {
      target: { files: [fileThree] },
    })

    expect(screen.getByText('Selected files: 3')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Remove report-2.jpg'))
    expect(screen.getByText('Selected files: 2')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }))
    expect(screen.queryByText(/Selected files:/)).not.toBeInTheDocument()

    fireEvent.change(fileInput, {
      target: { files: [fileOne, fileTwo] },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Upload Selected Reports' }))

    await waitFor(() => {
      expect(patchMock).toHaveBeenCalled()
    })
    const [url, formData, config] = patchMock.mock.calls.at(-1)!
    expect(url).toBe('/labs/orders/order-1/result-uploaded')
    expect(formData).toBeInstanceOf(FormData)
    expect(config).toEqual({ headers: { 'Content-Type': 'multipart/form-data' } })
  })

  it('lab order details exposes manual status actions except sent', async () => {
    patchMock.mockResolvedValue({ data: {} })
    renderDiagnosticRoute('/diagnostic/lab-orders/order-1', <div />)

    fireEvent.click(screen.getByRole('button', { name: 'Mark Assigned' }))
    await waitFor(() => {
      expect(patchMock).toHaveBeenCalledWith('/labs/orders/order-1/assign')
    })
  })

  it('shows not-found state for unknown lab order id', () => {
    renderDiagnosticRoute('/diagnostic/lab-orders/order-missing', <div />)

    expect(screen.getByText('Lab order not found.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to lab orders' })).toHaveAttribute(
      'href',
      '/diagnostic/lab-orders',
    )
  })

  it('profile page shows read-only fields and updates editable contact fields', async () => {
    patchMock.mockResolvedValue({ data: diagnosticData.profile })
    renderDiagnosticRoute('/diagnostic/profile', <div />)

    expect(screen.getByLabelText('Email')).toBeDisabled()
    expect(screen.getByLabelText('Role')).toBeDisabled()
    expect(screen.getByLabelText('Lab Name')).toBeDisabled()
    expect(screen.getByLabelText('License Number')).toBeDisabled()

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Prime Lab Updated' } })
    fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '+8801700000091' } })
    fireEvent.change(screen.getByLabelText('Address'), { target: { value: 'Updated Lab Address' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save Profile' }))

    await waitFor(() => {
      expect(patchMock).toHaveBeenCalledWith('/diagnostic/me/profile', {
        fullName: 'Prime Lab Updated',
        phone: '+8801700000091',
        address: 'Updated Lab Address',
      })
    })
  })
})
