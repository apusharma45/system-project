import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Activity,
  AlertCircle,
  Bell,
  Building2,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  LogOut,
  Search,
  Shield,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { UserSummary } from '../../types'
import { useAuth } from '../auth/auth-context'
import { ProfileAvatarEditor } from '../profile/profile-avatar-editor'
import { adminNavItems } from './admin-data'
import {
  useAdminAppHealth,
  useAdminAuditLogs,
  useAdminDbHealth,
  useAdminDiagnosticProfile,
  useAdminDiagnostics,
  useAdminDoctorDetails,
  useAdminDoctorProfile,
  useAdminDoctors,
  useAdminMarkAllNotificationsRead,
  useAdminMarkNotificationRead,
  useAdminNotifications,
  useAdminPatientProfile,
  useAdminPatients,
  useAdminPharmacyProfile,
  useAdminPharmacies,
  useAdminUpdateDiagnosticProfile,
  useAdminUpdateDoctorProfile,
  useAdminUpdatePatientProfile,
  useAdminUpdatePharmacyProfile,
} from './admin-shared'

type NoticeContextValue = {
  notify: (message: string) => void
}

const NoticeContext = createContext<NoticeContextValue | null>(null)

function useAdminNotice() {
  const context = useContext(NoticeContext)
  if (!context) {
    throw new Error('useAdminNotice must be used within AdminLayout')
  }
  return context
}

function AdminStatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  iconColor,
  subtitle,
}: {
  title: string
  value: string | number
  change?: number
  trend?: 'up' | 'down'
  icon: LucideIcon
  iconColor?: string
  subtitle?: string
}) {
  const positive = trend === 'up'
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-card-top">
        <div className={`admin-stat-icon ${iconColor ?? ''}`}>
          <Icon size={22} />
        </div>
        {change !== undefined ? (
          <div className={`admin-stat-trend ${positive ? 'up' : 'down'}`}>
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{Math.abs(change)}%</span>
          </div>
        ) : null}
      </div>
      <p>{title}</p>
      <h3>{value}</h3>
      {subtitle ? <small>{subtitle}</small> : null}
    </div>
  )
}

function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description: string
  actions?: ReactNode
}) {
  return (
    <div className="admin-page-head">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions ? <div className="admin-page-actions">{actions}</div> : null}
    </div>
  )
}

function getAdminInitials(label: string) {
  return (
    label
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'MF'
  )
}

function formatAdminRelativeTime(dateString: string) {
  const timestamp = new Date(dateString).getTime()
  const diffMs = Date.now() - timestamp
  if (Number.isNaN(timestamp)) {
    return 'Recently'
  }

  const minutes = Math.max(1, Math.round(diffMs / 60000))
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  }

  const hours = Math.round(minutes / 60)
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  }

  const days = Math.round(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

type EditableAdminRole = 'PATIENT' | 'DOCTOR' | 'PHARMACY' | 'DIAGNOSTIC'

type AdminEditorSelection = {
  id: string
  role: EditableAdminRole
  label: string
}

function normalizeTextInput(value: string | null | undefined) {
  return value ?? ''
}

function serializeStringList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function AdminFormField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'date' | 'number'
  placeholder?: string
}) {
  return (
    <label className="admin-form-field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function AdminFormTextarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <label className="admin-form-field admin-form-field-wide">
      <span>{label}</span>
      <textarea
        value={value}
        placeholder={placeholder}
        rows={4}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function AdminDoctorEditor({
  doctorId,
  onClose,
}: {
  doctorId: string
  onClose: () => void
}) {
  const { notify } = useAdminNotice()
  const profileQuery = useAdminDoctorProfile(doctorId)
  const updateMutation = useAdminUpdateDoctorProfile()
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    licenseNumber: '',
    specialization: '',
    dateOfBirth: '',
    gender: '',
    about: '',
    clinicName: '',
    clinicAddress: '',
    clinicPhone: '',
    yearsOfExperience: '',
    degrees: '',
    certifications: '',
  })

  useEffect(() => {
    const doctor = profileQuery.data?.doctor
    if (!doctor) return
    setForm({
      fullName: normalizeTextInput(doctor.fullName),
      phone: normalizeTextInput(doctor.phone),
      address: normalizeTextInput(doctor.address),
      licenseNumber: normalizeTextInput(doctor.profile?.licenseNumber),
      specialization: normalizeTextInput(doctor.profile?.specialization),
      dateOfBirth: normalizeTextInput(doctor.profile?.dateOfBirth)?.slice(0, 10),
      gender: normalizeTextInput(doctor.profile?.gender),
      about: normalizeTextInput(doctor.profile?.about),
      clinicName: normalizeTextInput(doctor.profile?.clinicName),
      clinicAddress: normalizeTextInput(doctor.profile?.clinicAddress),
      clinicPhone: normalizeTextInput(doctor.profile?.clinicPhone),
      yearsOfExperience:
        doctor.profile?.yearsOfExperience !== null && doctor.profile?.yearsOfExperience !== undefined
          ? String(doctor.profile.yearsOfExperience)
          : '',
      degrees: doctor.profile?.degrees?.join(', ') || '',
      certifications: doctor.profile?.certifications?.join(', ') || '',
    })
  }, [profileQuery.data])

  const submit = () => {
    updateMutation.mutate(
      {
        doctorId,
        payload: {
          fullName: form.fullName,
          phone: form.phone,
          address: form.address,
          licenseNumber: form.licenseNumber,
          specialization: form.specialization,
          dateOfBirth: form.dateOfBirth,
          gender: form.gender,
          about: form.about,
          clinicName: form.clinicName,
          clinicAddress: form.clinicAddress,
          clinicPhone: form.clinicPhone,
          yearsOfExperience: form.yearsOfExperience ? Number(form.yearsOfExperience) : undefined,
          degrees: form.degrees ? serializeStringList(form.degrees) : undefined,
          certifications: form.certifications ? serializeStringList(form.certifications) : undefined,
        },
      },
      {
        onSuccess: () => notify('Doctor profile updated.'),
        onError: () => notify('Doctor profile update failed right now.'),
      },
    )
  }

  return (
    <section className="admin-detail-panel">
      <div className="admin-panel-head">
        <div>
          <h3>Edit Doctor Profile</h3>
          <p>Update the live doctor record from the current admin backend.</p>
        </div>
        <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
      {profileQuery.isLoading ? <p className="admin-inline-state">Loading doctor profile...</p> : null}
      {profileQuery.isError ? <p className="admin-inline-state">Doctor profile could not be loaded.</p> : null}
      {profileQuery.data ? (
        <div className="admin-form-grid">
          <AdminFormField label="Full Name" value={form.fullName} onChange={(value) => setForm((current) => ({ ...current, fullName: value }))} />
          <AdminFormField label="Phone" value={form.phone} onChange={(value) => setForm((current) => ({ ...current, phone: value }))} />
          <AdminFormField label="Address" value={form.address} onChange={(value) => setForm((current) => ({ ...current, address: value }))} />
          <AdminFormField label="License Number" value={form.licenseNumber} onChange={(value) => setForm((current) => ({ ...current, licenseNumber: value }))} />
          <AdminFormField label="Specialization" value={form.specialization} onChange={(value) => setForm((current) => ({ ...current, specialization: value }))} />
          <AdminFormField label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(value) => setForm((current) => ({ ...current, dateOfBirth: value }))} />
          <AdminFormField label="Gender" value={form.gender} onChange={(value) => setForm((current) => ({ ...current, gender: value }))} />
          <AdminFormField label="Years of Experience" type="number" value={form.yearsOfExperience} onChange={(value) => setForm((current) => ({ ...current, yearsOfExperience: value }))} />
          <AdminFormField label="Clinic Name" value={form.clinicName} onChange={(value) => setForm((current) => ({ ...current, clinicName: value }))} />
          <AdminFormField label="Clinic Phone" value={form.clinicPhone} onChange={(value) => setForm((current) => ({ ...current, clinicPhone: value }))} />
          <AdminFormField label="Clinic Address" value={form.clinicAddress} onChange={(value) => setForm((current) => ({ ...current, clinicAddress: value }))} />
          <AdminFormField label="Degrees" value={form.degrees} placeholder="MBBS, FCPS" onChange={(value) => setForm((current) => ({ ...current, degrees: value }))} />
          <AdminFormField label="Certifications" value={form.certifications} placeholder="BCS, ACLS" onChange={(value) => setForm((current) => ({ ...current, certifications: value }))} />
          <AdminFormTextarea label="About" value={form.about} onChange={(value) => setForm((current) => ({ ...current, about: value }))} />
          <div className="admin-form-actions">
            <button type="button" className="admin-btn admin-btn-primary" onClick={submit} disabled={updateMutation.isPending}>
              Save Doctor Profile
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function AdminPharmacyEditor({
  pharmacyId,
  onClose,
}: {
  pharmacyId: string
  onClose: () => void
}) {
  const { notify } = useAdminNotice()
  const profileQuery = useAdminPharmacyProfile(pharmacyId)
  const updateMutation = useAdminUpdatePharmacyProfile()
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    pharmacyName: '',
    licenseNumber: '',
  })

  useEffect(() => {
    const pharmacy = profileQuery.data?.pharmacy
    if (!pharmacy) return
    setForm({
      fullName: normalizeTextInput(pharmacy.fullName),
      phone: normalizeTextInput(pharmacy.phone),
      address: normalizeTextInput(pharmacy.address),
      pharmacyName: normalizeTextInput(pharmacy.profile?.pharmacyName),
      licenseNumber: normalizeTextInput(pharmacy.profile?.licenseNumber),
    })
  }, [profileQuery.data])

  const submit = () => {
    updateMutation.mutate(
      {
        pharmacyId,
        payload: {
          fullName: form.fullName,
          phone: form.phone,
          address: form.address,
          pharmacyName: form.pharmacyName,
          licenseNumber: form.licenseNumber,
        },
      },
      {
        onSuccess: () => notify('Pharmacy profile updated.'),
        onError: () => notify('Pharmacy profile update failed right now.'),
      },
    )
  }

  return (
    <section className="admin-detail-panel">
      <div className="admin-panel-head">
        <div>
          <h3>Edit Pharmacy Profile</h3>
          <p>Update the live pharmacy directory record.</p>
        </div>
        <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
      {profileQuery.isLoading ? <p className="admin-inline-state">Loading pharmacy profile...</p> : null}
      {profileQuery.isError ? <p className="admin-inline-state">Pharmacy profile could not be loaded.</p> : null}
      {profileQuery.data ? (
        <div className="admin-form-grid">
          <AdminFormField label="Full Name" value={form.fullName} onChange={(value) => setForm((current) => ({ ...current, fullName: value }))} />
          <AdminFormField label="Phone" value={form.phone} onChange={(value) => setForm((current) => ({ ...current, phone: value }))} />
          <AdminFormField label="Address" value={form.address} onChange={(value) => setForm((current) => ({ ...current, address: value }))} />
          <AdminFormField label="Pharmacy Name" value={form.pharmacyName} onChange={(value) => setForm((current) => ({ ...current, pharmacyName: value }))} />
          <AdminFormField label="License Number" value={form.licenseNumber} onChange={(value) => setForm((current) => ({ ...current, licenseNumber: value }))} />
          <div className="admin-form-actions">
            <button type="button" className="admin-btn admin-btn-primary" onClick={submit} disabled={updateMutation.isPending}>
              Save Pharmacy Profile
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function AdminDiagnosticEditor({
  diagnosticId,
  onClose,
}: {
  diagnosticId: string
  onClose: () => void
}) {
  const { notify } = useAdminNotice()
  const profileQuery = useAdminDiagnosticProfile(diagnosticId)
  const updateMutation = useAdminUpdateDiagnosticProfile()
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    licenseNumber: '',
    specialization: '',
    dateOfBirth: '',
    gender: '',
  })

  useEffect(() => {
    const diagnostic = profileQuery.data?.diagnostic
    if (!diagnostic) return
    setForm({
      fullName: normalizeTextInput(diagnostic.fullName),
      phone: normalizeTextInput(diagnostic.phone),
      address: normalizeTextInput(diagnostic.address),
      licenseNumber: normalizeTextInput(diagnostic.profile?.licenseNumber),
      specialization: normalizeTextInput(diagnostic.profile?.specialization),
      dateOfBirth: normalizeTextInput(diagnostic.profile?.dateOfBirth)?.slice(0, 10),
      gender: normalizeTextInput(diagnostic.profile?.gender),
    })
  }, [profileQuery.data])

  const submit = () => {
    updateMutation.mutate(
      {
        diagnosticId,
        payload: {
          fullName: form.fullName,
          phone: form.phone,
          address: form.address,
          licenseNumber: form.licenseNumber,
          specialization: form.specialization,
          dateOfBirth: form.dateOfBirth,
          gender: form.gender,
        },
      },
      {
        onSuccess: () => notify('Diagnostic profile updated.'),
        onError: () => notify('Diagnostic profile update failed right now.'),
      },
    )
  }

  return (
    <section className="admin-detail-panel">
      <div className="admin-panel-head">
        <div>
          <h3>Edit Diagnostic Profile</h3>
          <p>Update the live diagnostic directory record.</p>
        </div>
        <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
      {profileQuery.isLoading ? <p className="admin-inline-state">Loading diagnostic profile...</p> : null}
      {profileQuery.isError ? <p className="admin-inline-state">Diagnostic profile could not be loaded.</p> : null}
      {profileQuery.data ? (
        <div className="admin-form-grid">
          <AdminFormField label="Full Name" value={form.fullName} onChange={(value) => setForm((current) => ({ ...current, fullName: value }))} />
          <AdminFormField label="Phone" value={form.phone} onChange={(value) => setForm((current) => ({ ...current, phone: value }))} />
          <AdminFormField label="Address" value={form.address} onChange={(value) => setForm((current) => ({ ...current, address: value }))} />
          <AdminFormField label="License Number" value={form.licenseNumber} onChange={(value) => setForm((current) => ({ ...current, licenseNumber: value }))} />
          <AdminFormField label="Specialization" value={form.specialization} onChange={(value) => setForm((current) => ({ ...current, specialization: value }))} />
          <AdminFormField label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(value) => setForm((current) => ({ ...current, dateOfBirth: value }))} />
          <AdminFormField label="Gender" value={form.gender} onChange={(value) => setForm((current) => ({ ...current, gender: value }))} />
          <div className="admin-form-actions">
            <button type="button" className="admin-btn admin-btn-primary" onClick={submit} disabled={updateMutation.isPending}>
              Save Diagnostic Profile
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function AdminPatientEditor({
  patientId,
  onClose,
}: {
  patientId: string
  onClose: () => void
}) {
  const { notify } = useAdminNotice()
  const profileQuery = useAdminPatientProfile(patientId)
  const updateMutation = useAdminUpdatePatientProfile()
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    allergies: '',
    chronicConditions: '',
    currentMedications: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
  })

  useEffect(() => {
    const patient = profileQuery.data?.patient
    if (!patient) return
    setForm({
      fullName: normalizeTextInput(patient.fullName),
      phone: normalizeTextInput(patient.phone),
      address: normalizeTextInput(patient.address),
      allergies: normalizeTextInput(patient.profile?.allergies),
      chronicConditions: normalizeTextInput(patient.profile?.chronicConditions),
      currentMedications: normalizeTextInput(patient.profile?.currentMedications),
      emergencyContactName: normalizeTextInput(patient.profile?.emergencyContactName),
      emergencyContactPhone: normalizeTextInput(patient.profile?.emergencyContactPhone),
      emergencyContactRelation: normalizeTextInput(patient.profile?.emergencyContactRelation),
    })
  }, [profileQuery.data])

  const submit = () => {
    updateMutation.mutate(
      {
        patientId,
        payload: form,
      },
      {
        onSuccess: () => notify('Patient profile updated.'),
        onError: () => notify('Patient profile update failed right now.'),
      },
    )
  }

  return (
    <section className="admin-detail-panel">
      <div className="admin-panel-head">
        <div>
          <h3>Edit Patient Profile</h3>
          <p>Update patient profile fields.</p>
        </div>
        <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
      {profileQuery.isLoading ? <p className="admin-inline-state">Loading patient profile...</p> : null}
      {profileQuery.isError ? <p className="admin-inline-state">Patient profile could not be loaded.</p> : null}
      {profileQuery.data ? (
        <div className="admin-form-grid">
          <AdminFormField label="Full Name" value={form.fullName} onChange={(value) => setForm((current) => ({ ...current, fullName: value }))} />
          <AdminFormField label="Phone" value={form.phone} onChange={(value) => setForm((current) => ({ ...current, phone: value }))} />
          <AdminFormField label="Address" value={form.address} onChange={(value) => setForm((current) => ({ ...current, address: value }))} />
          <AdminFormTextarea label="Allergies" value={form.allergies} onChange={(value) => setForm((current) => ({ ...current, allergies: value }))} />
          <AdminFormTextarea label="Chronic Conditions" value={form.chronicConditions} onChange={(value) => setForm((current) => ({ ...current, chronicConditions: value }))} />
          <AdminFormTextarea label="Current Medications" value={form.currentMedications} onChange={(value) => setForm((current) => ({ ...current, currentMedications: value }))} />
          <AdminFormField label="Emergency Contact Name" value={form.emergencyContactName} onChange={(value) => setForm((current) => ({ ...current, emergencyContactName: value }))} />
          <AdminFormField label="Emergency Contact Phone" value={form.emergencyContactPhone} onChange={(value) => setForm((current) => ({ ...current, emergencyContactPhone: value }))} />
          <AdminFormField label="Emergency Contact Relation" value={form.emergencyContactRelation} onChange={(value) => setForm((current) => ({ ...current, emergencyContactRelation: value }))} />
          <div className="admin-form-actions">
            <button type="button" className="admin-btn admin-btn-primary" onClick={submit} disabled={updateMutation.isPending}>
              Save Patient Profile
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function AdminEditableUserPanel({
  selection,
  onClose,
}: {
  selection: AdminEditorSelection
  onClose: () => void
}) {
  let content: ReactNode
  if (selection.role === 'DOCTOR') {
    content = <AdminDoctorEditor doctorId={selection.id} onClose={onClose} />
  } else if (selection.role === 'PHARMACY') {
    content = <AdminPharmacyEditor pharmacyId={selection.id} onClose={onClose} />
  } else if (selection.role === 'DIAGNOSTIC') {
    content = <AdminDiagnosticEditor diagnosticId={selection.id} onClose={onClose} />
  } else {
    content = <AdminPatientEditor patientId={selection.id} onClose={onClose} />
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-dialog" onClick={(event) => event.stopPropagation()}>
        {content}
      </div>
    </div>
  )
}

function AdminDoctorPreviewModal({
  doctorDetailsQuery,
  onClose,
}: {
  doctorDetailsQuery: ReturnType<typeof useAdminDoctorDetails>
  onClose: () => void
}) {
  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-dialog" onClick={(event) => event.stopPropagation()}>
        <section className="admin-detail-panel">
          <div className="admin-panel-head">
            <div>
              <h3>Doctor Profile Preview</h3>
              <p>
                {doctorDetailsQuery.isLoading
                  ? 'Loading doctor profile...'
                  : doctorDetailsQuery.data
                    ? 'Live details pulled from the backend.'
                    : 'Doctor profile details could not be loaded.'}
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
          {doctorDetailsQuery.data ? (
            <div className="admin-detail-grid">
              <div>
                <span>Name</span>
                <strong>
                  {doctorDetailsQuery.data.doctor.fullName?.trim() ||
                    doctorDetailsQuery.data.doctor.email}
                </strong>
              </div>
              <div>
                <span>Email</span>
                <strong>{doctorDetailsQuery.data.doctor.email}</strong>
              </div>
              <div>
                <span>Phone</span>
                <strong>{doctorDetailsQuery.data.doctor.phone || ''}</strong>
              </div>
              <div>
                <span>Specialization</span>
                <strong>
                  {doctorDetailsQuery.data.doctor.specialization || ''}
                </strong>
              </div>
              <div>
                <span>Experience</span>
                <strong>
                  {doctorDetailsQuery.data.doctor.yearsOfExperience !== null &&
                  doctorDetailsQuery.data.doctor.yearsOfExperience !== undefined
                    ? `${doctorDetailsQuery.data.doctor.yearsOfExperience} years`
                    : ''}
                </strong>
              </div>
              <div>
                <span>Clinic</span>
                <strong>{doctorDetailsQuery.data.doctor.clinicName || ''}</strong>
              </div>
              <div className="wide">
                <span>Degrees</span>
                <strong>
                  {doctorDetailsQuery.data.doctor.degrees?.join(', ') || ''}
                </strong>
              </div>
              <div className="wide">
                <span>About</span>
                <strong>{doctorDetailsQuery.data.doctor.about || ''}</strong>
              </div>
            </div>
          ) : (
            <p className="admin-inline-state">Doctor preview could not be loaded.</p>
          )}
        </section>
      </div>
    </div>
  )
}

function buildDirectoryItems(
  users: UserSummary[],
  fallbackRole: 'Pharmacy' | 'Diagnostic',
) {
  return users.map((user) => ({
    id: user.id,
    name: user.fullName?.trim() || user.email,
    email: user.email,
    role: fallbackRole,
    status: 'active' as const,
    detail: user.fullName?.trim() ? 'Named profile' : 'Email-only profile',
    detailTone: user.fullName?.trim() ? 'active' : 'pending',
    meta: [`${fallbackRole} directory`, `ID: ${user.id.slice(0, 8)}`],
  }))
}

function buildPatientDirectoryItems(users: UserSummary[]) {
  return users.map((user) => ({
    id: user.id,
    name: user.fullName?.trim() || user.email,
    email: user.email,
    role: 'Patient',
    status: 'active' as const,
    detail: user.fullName?.trim() ? 'Named patient profile' : 'Email-only patient profile',
    detailTone: user.fullName?.trim() ? 'active' as const : 'pending' as const,
    meta: ['Patient directory', `ID: ${user.id.slice(0, 8)}`],
  }))
}

function DirectoryStatusBadge({
  status,
}: {
  status: 'active' | 'pending' | 'suspended'
}) {
  const icon =
    status === 'active' ? <CheckCircle size={14} /> : status === 'pending' ? <AlertCircle size={14} /> : <XCircle size={14} />
  const label = status === 'active' ? 'Active' : status === 'pending' ? 'Needs Review' : 'Suspended'
  return <span className={`admin-status-badge ${status}`}>{icon}{label}</span>
}

function AdminHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const appHealthQuery = useAdminAppHealth()
  const dbHealthQuery = useAdminDbHealth()
  const notificationsQuery = useAdminNotifications()
  const unreadNotifications = (notificationsQuery.data ?? []).filter((item) => !item.read).length
  const systemLabel =
    appHealthQuery.data?.status === 'ok' && dbHealthQuery.data?.status === 'ok'
      ? 'All Systems Operational'
      : appHealthQuery.isLoading || dbHealthQuery.isLoading
        ? 'Checking System Health'
        : 'Attention Needed'
  const initials = getAdminInitials(user?.fullName?.trim() || user?.email || 'Admin User')

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <div className="admin-chip-row">
          <span className="admin-chip admin-chip-muted">Admin Control Center</span>
          <span className="admin-chip admin-chip-outline">
            {new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }).format(new Date())}
          </span>
        </div>
      </div>

      <div className="admin-header-right">
        <div className="admin-system-pill">
          <span className="dot" />
          <span>{systemLabel}</span>
        </div>

        <Link to="/admin/notifications" className="admin-icon-button admin-bell">
          <Bell size={18} />
          <span>{unreadNotifications}</span>
        </Link>

        <div className="admin-divider" />

        <Link to="/admin/profile" className="admin-profile-trigger">
          <div className="admin-profile-avatar">{initials}</div>
          <ChevronDown size={16} />
        </Link>

        <button
          type="button"
          className="admin-header-logout"
          onClick={() => {
            logout()
            navigate('/login')
          }}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  )
}

function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const initials = useMemo(() => {
    const name = user?.fullName?.trim() || 'Admin User'
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'AD'
  }, [user?.fullName])

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="admin-sidebar-head">
        {!collapsed ? (
          <div className="admin-brand">
            <div className="admin-brand-mark">
              <Activity size={22} />
            </div>
            <div>
              <h2>MedFlow</h2>
              <p>Admin Portal</p>
            </div>
          </div>
        ) : null}
        <button type="button" className="admin-collapse-btn" onClick={() => setCollapsed((current) => !current)}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="admin-nav">
        {adminNavItems.map((item) => {
          const Icon = item.icon
          const active =
            location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(`${item.path}/`))

          return (
            <NavLink key={item.path} to={item.path} className={`admin-nav-link${active ? ' active' : ''}`}>
              <Icon size={18} />
              {!collapsed ? (
                <>
                  <span>{item.label}</span>
                  {item.badge ? <em>{item.badge}</em> : null}
                </>
              ) : null}
            </NavLink>
          )
        })}
      </nav>

      {!collapsed ? (
        <div className="admin-sidebar-foot">
          <Link to="/admin/profile" className="admin-admin-card">
            <div className="admin-profile-avatar">{initials}</div>
            <div>
              <strong>{user?.fullName?.trim() || 'Admin User'}</strong>
              <p>Super Admin</p>
            </div>
          </Link>
          <button
            type="button"
            className="admin-logout"
            onClick={() => {
              logout()
              navigate('/login')
            }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      ) : null}
    </aside>
  )
}

export function AdminLayout() {
  const [notice, setNotice] = useState<string | null>(null)
  return (
    <NoticeContext.Provider value={{ notify: setNotice }}>
      <div className="admin-shell">
        <AdminSidebar />
        <div className="admin-main">
          <AdminHeader />
          {notice ? (
            <div className="admin-notice-bar">
              <AlertCircle size={16} />
              <span>{notice}</span>
              <button type="button" onClick={() => setNotice(null)}>
                Dismiss
              </button>
            </div>
          ) : null}
          <main className="admin-content">
            <Outlet />
          </main>
        </div>
      </div>
    </NoticeContext.Provider>
  )
}

export function AdminOverviewPage() {
  const { user } = useAuth()
  const patientsQuery = useAdminPatients()
  const doctorsQuery = useAdminDoctors()
  const pharmaciesQuery = useAdminPharmacies()
  const diagnosticsQuery = useAdminDiagnostics()
  const auditQuery = useAdminAuditLogs(6)
  const notificationsQuery = useAdminNotifications()
  const appHealthQuery = useAdminAppHealth()
  const dbHealthQuery = useAdminDbHealth()

  const patientsCount = patientsQuery.data?.length ?? 0
  const doctorsCount = doctorsQuery.data?.length ?? 0
  const pharmaciesCount = pharmaciesQuery.data?.length ?? 0
  const diagnosticsCount = diagnosticsQuery.data?.length ?? 0
  const accessibleUsers = patientsCount + doctorsCount + pharmaciesCount + diagnosticsCount + 1
  const auditEntries = auditQuery.data ?? []
  const unreadNotifications = (notificationsQuery.data ?? []).filter((item) => !item.read).length
  const roleDistributionData = [
    { role: 'Patients', value: patientsCount, fill: '#1e6fff' },
    { role: 'Doctors', value: doctorsCount, fill: '#06b6d4' },
    { role: 'Pharmacies', value: pharmaciesCount, fill: '#10b981' },
    { role: 'Diagnostics', value: diagnosticsCount, fill: '#f59e0b' },
    { role: 'Admins', value: 1, fill: '#8b5cf6' },
  ].filter((item) => item.value > 0)
  const healthCards = {
    apiUptime: {
      status: appHealthQuery.data?.status === 'ok' ? 'healthy' : appHealthQuery.isError ? 'critical' : 'degraded',
      value: appHealthQuery.data?.status === 'ok' ? 'Connected' : appHealthQuery.isLoading ? 'Checking...' : 'Unavailable',
    },
    database: {
      status: dbHealthQuery.data?.status === 'ok' ? 'healthy' : dbHealthQuery.isError ? 'critical' : 'degraded',
      value: dbHealthQuery.data?.status === 'ok' ? 'Connected' : dbHealthQuery.isLoading ? 'Checking...' : 'Unavailable',
    },
    notifications: {
      status: notificationsQuery.isError ? 'critical' : notificationsQuery.isLoading ? 'degraded' : 'healthy',
      value: notificationsQuery.isLoading ? 'Checking...' : notificationsQuery.isError ? 'Unavailable' : `${unreadNotifications} unread`,
    },
    pharmacyDirectory: {
      status: pharmaciesQuery.isError ? 'critical' : pharmaciesQuery.isLoading ? 'degraded' : 'healthy',
      value: pharmaciesQuery.isLoading ? 'Checking...' : pharmaciesQuery.isError ? 'Unavailable' : `${pharmaciesCount} live`,
    },
    diagnosticDirectory: {
      status: diagnosticsQuery.isError ? 'critical' : diagnosticsQuery.isLoading ? 'degraded' : 'healthy',
      value: diagnosticsQuery.isLoading ? 'Checking...' : diagnosticsQuery.isError ? 'Unavailable' : `${diagnosticsCount} live`,
    },
    auditTrail: {
      status: auditQuery.isError ? 'critical' : auditQuery.isLoading ? 'degraded' : 'healthy',
      value: auditQuery.isLoading ? 'Checking...' : auditQuery.isError ? 'Unavailable' : `${auditEntries.length} recent`,
    },
  } as const
  const recentActivityItems = auditEntries.map((entry) => {
    const actor = entry.actorUserId || 'System'
    return {
      id: entry.id,
      user: actor === 'System' ? 'System' : actor.slice(0, 8),
      action: entry.action.toLowerCase().replace(/_/g, ' '),
      time: formatAdminRelativeTime(entry.createdAt),
      avatar: actor === 'System' ? 'SY' : getAdminInitials(actor.slice(0, 8)),
    }
  })
  const greetingName = user?.fullName?.trim() || 'Admin'

  return (
    <div className="admin-page-stack">
      <AdminPageHeader
        title={`Good morning, ${greetingName}`}
        description="Users, notifications, audit activity, and system status."
      />

      <div className="admin-kpi-grid">
        <AdminStatCard title="Total Users" value={accessibleUsers.toLocaleString()} icon={Users} iconColor="blue" />
        <AdminStatCard title="Patients" value={patientsCount.toLocaleString()} icon={Users} iconColor="blue" />
        <AdminStatCard title="Doctors" value={doctorsCount.toLocaleString()} icon={Activity} iconColor="cyan" />
        <AdminStatCard title="Pharmacies" value={pharmaciesCount.toLocaleString()} icon={Building2} iconColor="green" />
        <AdminStatCard title="Diagnostics" value={diagnosticsCount.toLocaleString()} icon={CheckCircle} iconColor="cyan-purple" />
        <AdminStatCard title="Unread Notifications" value={unreadNotifications} icon={Bell} iconColor="purple" />
        <AdminStatCard title="Audit Events" value={auditEntries.length} icon={Shield} iconColor="red" />
      </div>

      <div className="admin-two-third-grid">
        <section className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <h3>User Distribution</h3>
              <p>By role</p>
            </div>
          </div>
          <div className="admin-chart admin-chart-small">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={roleDistributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {roleDistributionData.map((entry) => (
                    <Cell key={entry.role} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="admin-legend-list">
            {roleDistributionData.map((item) => (
              <div key={item.role}>
                <span className="admin-legend-dot" style={{ backgroundColor: item.fill }} />
                <strong>{item.role}</strong>
                <em>{item.value.toLocaleString()}</em>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="admin-two-third-grid">
        <section className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <h3>System Health</h3>
              <p>Service status</p>
            </div>
          </div>
          <div className="admin-health-grid">
            {Object.entries(healthCards).map(([key, value]) => (
              <div key={key} className={`admin-health-card ${value.status}`}>
                <div>
                  <Activity size={15} />
                  <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
                <strong>{value.value}</strong>
                <small>{value.status}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <h3>Recent Activity</h3>
              <p>Latest audit events</p>
            </div>
          </div>
          <div className="admin-activity-list">
            {recentActivityItems.length > 0 ? recentActivityItems.map((item) => (
              <div key={item.id} className="admin-activity-item">
                <div className="admin-mini-avatar">{item.avatar}</div>
                <div>
                  <p>
                    <strong>{item.user}</strong> {item.action}
                  </p>
                  <span>{item.time}</span>
                </div>
              </div>
            )) : <p className="admin-inline-state">No audit activity found.</p>}
          </div>
        </section>
      </div>
    </div>
  )
}

export function AdminUsersPage() {
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState('all')
  const [selectedEditor, setSelectedEditor] = useState<AdminEditorSelection | null>(null)
  const patientsQuery = useAdminPatients()
  const doctorsQuery = useAdminDoctors()
  const pharmaciesQuery = useAdminPharmacies()
  const diagnosticsQuery = useAdminDiagnostics()
  const liveUsers = [
    ...(patientsQuery.data ?? []).map((entry) => ({
      id: entry.id,
      name: entry.fullName?.trim() || entry.email,
      email: entry.email,
      role: 'Patient',
      status: 'active' as const,
      verified: true,
      avatar: getAdminInitials(entry.fullName?.trim() || entry.email),
      specialty: undefined,
    })),
    ...(doctorsQuery.data ?? []).map((entry) => ({
      id: entry.id,
      name: entry.fullName?.trim() || entry.email,
      email: entry.email,
      role: 'Doctor',
      status: 'active' as const,
      verified: true,
      avatar: getAdminInitials(entry.fullName?.trim() || entry.email),
      specialty: entry.specialization || undefined,
    })),
    ...(pharmaciesQuery.data ?? []).map((entry) => ({
      id: entry.id,
      name: entry.fullName?.trim() || entry.email,
      email: entry.email,
      role: 'Pharmacy',
      status: 'active' as const,
      verified: true,
      avatar: getAdminInitials(entry.fullName?.trim() || entry.email),
      specialty: undefined,
    })),
    ...(diagnosticsQuery.data ?? []).map((entry) => ({
      id: entry.id,
      name: entry.fullName?.trim() || entry.email,
      email: entry.email,
      role: 'Diagnostic',
      status: 'active' as const,
      verified: true,
      avatar: getAdminInitials(entry.fullName?.trim() || entry.email),
      specialty: undefined,
    })),
  ]
  const adminRow = user
    ? {
        id: user.userId,
        name: user.fullName?.trim() || user.email,
        email: user.email,
        role: 'Admin',
        status: 'active' as const,
        verified: true,
        avatar: getAdminInitials(user.fullName?.trim() || user.email),
        specialty: undefined,
      }
    : null
  const userItems = [...(adminRow ? [adminRow] : []), ...liveUsers]
  const visibleUsers = userItems.filter((entry) => {
    if (selectedTab === 'all') return true
    if (selectedTab === 'admins') return entry.role === 'Admin'
    if (selectedTab === 'doctors') return entry.role === 'Doctor'
    if (selectedTab === 'patients') return entry.role === 'Patient'
    if (selectedTab === 'pharmacies') return entry.role === 'Pharmacy'
    if (selectedTab === 'diagnostics') return entry.role === 'Diagnostic'
    return true
  })
  const tabs = [
    { id: 'all', label: 'All Users', count: userItems.length },
    { id: 'admins', label: 'Admins', count: userItems.filter((entry) => entry.role === 'Admin').length },
    { id: 'doctors', label: 'Doctors', count: userItems.filter((entry) => entry.role === 'Doctor').length },
    { id: 'patients', label: 'Patients', count: userItems.filter((entry) => entry.role === 'Patient').length },
    { id: 'pharmacies', label: 'Pharmacies', count: userItems.filter((entry) => entry.role === 'Pharmacy').length },
    { id: 'diagnostics', label: 'Diagnostics', count: userItems.filter((entry) => entry.role === 'Diagnostic').length },
  ]

  const statusBadge = (status: string) => {
    const label = status === 'active' ? 'Active' : status === 'suspended' ? 'Suspended' : 'Flagged'
    return <span className={`admin-status-badge ${status}`}>{label}</span>
  }

  return (
    <div className="admin-page-stack">
      <AdminPageHeader
        title="User Management"
        description="Manage all users across the MedFlow platform"
        actions={<button type="button" className="admin-btn admin-btn-secondary" onClick={() => {
          void doctorsQuery.refetch()
          void pharmaciesQuery.refetch()
          void diagnosticsQuery.refetch()
        }}>Refresh Directories</button>}
      />

      <section className="admin-panel admin-table-panel">
        <div className="admin-tabs">
          {tabs.map((tab) => (
            <button key={tab.id} type="button" className={selectedTab === tab.id ? 'active' : ''} onClick={() => setSelectedTab(tab.id)}>
              <span>{tab.label}</span>
              <em>{tab.count}</em>
            </button>
          ))}
        </div>

        {(patientsQuery.isLoading || doctorsQuery.isLoading || pharmaciesQuery.isLoading || diagnosticsQuery.isLoading) ? (
          <p className="admin-inline-state padded">Loading live user directories...</p>
        ) : null}
        {(patientsQuery.isError || doctorsQuery.isError || pharmaciesQuery.isError || diagnosticsQuery.isError) ? (
          <p className="admin-inline-state padded">
            Some user directories are unavailable.
          </p>
        ) : null}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Specialty</th>
                <th>Role</th>
                <th>Status</th>
                <th>Verified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => (
                <tr key={String(user.id)}>
                  <td>
                    <div className="admin-user-cell">
                      <div className="admin-mini-avatar">{user.avatar}</div>
                      <div>
                        <strong>{user.name}</strong>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="admin-cell-stack">
                      <strong>{user.email}</strong>
                    </div>
                  </td>
                  <td>{user.specialty ? <span className="admin-role-pill">{user.specialty}</span> : null}</td>
                  <td><span className="admin-role-pill">{user.role}</span></td>
                  <td>{statusBadge(user.status)}</td>
                  <td>{user.verified ? <CheckCircle size={18} className="admin-icon-success" /> : <XCircle size={18} className="admin-icon-muted" />}</td>
                  <td className="actions">
                    {user.role === 'Admin' ? (
                      <span className="admin-inline-state">Managed from profile</span>
                    ) : (
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        onClick={() =>
                          setSelectedEditor({
                            id: String(user.id),
                            role:
                              user.role === 'Doctor'
                                ? 'DOCTOR'
                                : user.role === 'Patient'
                                  ? 'PATIENT'
                                  : user.role === 'Pharmacy'
                                    ? 'PHARMACY'
                                    : 'DIAGNOSTIC',
                            label: user.name,
                          })
                        }
                      >
                        Edit Profile
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {visibleUsers.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <p className="admin-inline-state">No users are available for this tab right now.</p>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="admin-pagination">
          <p>Showing {visibleUsers.length} of {userItems.length} users</p>
          <div>
            <button type="button">Previous</button>
            <button type="button" className="active">1</button>
            <button type="button">2</button>
            <button type="button">Next</button>
          </div>
        </div>

        {selectedEditor ? (
          <AdminEditableUserPanel selection={selectedEditor} onClose={() => setSelectedEditor(null)} />
        ) : null}
      </section>
    </div>
  )
}

export function AdminPatientsPage() {
  const [selectedEditor, setSelectedEditor] = useState<AdminEditorSelection | null>(null)
  const patientsQuery = useAdminPatients()
  const items = buildPatientDirectoryItems(patientsQuery.data ?? [])
  const namedCount = items.filter((item) => item.name !== item.email).length
  const reviewCount = items.filter((item) => item.detailTone === 'pending').length

  return (
    <div className="admin-page-stack">
      <AdminPageHeader
        title="Patient Management"
        description="Review and update patient profiles."
        actions={
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={() => void patientsQuery.refetch()}
          >
            Refresh Directory
          </button>
        }
      />

      <div className="admin-summary-grid">
        <AdminStatCard title="Total Patients" value={items.length} icon={Users} iconColor="blue" />
        <AdminStatCard title="Live Backend Records" value={patientsQuery.data?.length ?? 0} icon={Activity} iconColor="cyan" />
        <AdminStatCard title="Named Profiles" value={namedCount} icon={CheckCircle} iconColor="green" />
        <AdminStatCard title="Needs Review" value={reviewCount} icon={AlertCircle} iconColor="orange" />
      </div>

      <section className="admin-panel">
        {patientsQuery.isLoading ? <p className="admin-inline-state">Loading live patient directory...</p> : null}
        {patientsQuery.isError ? (
          <p className="admin-inline-state">
            Patient data is unavailable.
          </p>
        ) : null}

        {!patientsQuery.isLoading && !patientsQuery.isError && items.length === 0 ? (
          <p className="admin-inline-state">No patients were returned by the backend.</p>
        ) : null}

        <div className="admin-card-list">
          {items.map((patient) => (
            <article key={patient.id} className="admin-entity-card">
              <div className="admin-entity-main">
                <div className="admin-entity-avatar">{getAdminInitials(patient.name)}</div>
                <div className="admin-entity-copy">
                  <div className="admin-entity-headline">
                    <h3>{patient.name}</h3>
                    <span className="admin-role-pill">{patient.role}</span>
                  </div>
                  <div className="admin-entity-meta">
                    <span>{patient.email}</span>
                    {patient.meta.map((entry) => (
                      <span key={`${patient.id}-${entry}`}>{entry}</span>
                    ))}
                  </div>
                  <div className="admin-entity-stats">
                    <span className={`admin-status-badge ${patient.detailTone}`}>{patient.detail}</span>
                  </div>
                </div>
              </div>
              <div className="admin-entity-actions">
                <DirectoryStatusBadge status={patient.status} />
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() =>
                    setSelectedEditor({
                      id: patient.id,
                      role: 'PATIENT',
                      label: patient.name,
                    })
                  }
                >
                  Edit Profile
                </button>
              </div>
            </article>
          ))}
        </div>

        {selectedEditor ? (
          <AdminEditableUserPanel selection={selectedEditor} onClose={() => setSelectedEditor(null)} />
        ) : null}
      </section>
    </div>
  )
}

export function AdminDoctorsPage() {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined)
  const [selectedEditor, setSelectedEditor] = useState<AdminEditorSelection | null>(null)
  const doctorsQuery = useAdminDoctors()
  const doctorDetailsQuery = useAdminDoctorDetails(selectedDoctorId)
  const liveDoctors = doctorsQuery.data ?? []
  const items = liveDoctors.map((doctor) => ({
    id: doctor.id,
    name: doctor.fullName?.trim() || doctor.email,
    specialty: doctor.specialization || 'Specialization not set',
    rating: null as number | null,
    patients: null as number | null,
    verified: true,
    license: 'Open profile',
    hospital: 'Open profile',
    status: 'active',
    yearsOfExperience: doctor.yearsOfExperience ?? null,
  }))

  const statusBadge = (status: string) => {
    const icon =
      status === 'active' ? <CheckCircle size={14} /> : status === 'pending' ? <AlertCircle size={14} /> : <XCircle size={14} />
    return <span className={`admin-status-badge ${status}`}>{icon}{status === 'active' ? 'Active' : status === 'pending' ? 'Pending' : 'Suspended'}</span>
  }

  return (
    <div className="admin-page-stack">
      <AdminPageHeader
        title="Doctor Management"
        description="Monitor and manage all doctors on the platform"
        actions={
          <button type="button" className="admin-btn admin-btn-secondary" onClick={() => void doctorsQuery.refetch()}>
            Refresh Doctors
          </button>
        }
      />

      <div className="admin-summary-grid">
        <AdminStatCard title="Total Doctors" value={items.length} icon={CheckCircle} iconColor="blue" />
        <AdminStatCard title="Verified" value={items.filter((doctor) => doctor.verified).length} icon={CheckCircle} iconColor="green" />
        <AdminStatCard title="Pending Verification" value={items.filter((doctor) => doctor.status === 'pending').length} icon={AlertCircle} iconColor="orange" />
        <AdminStatCard title="Suspended" value={items.filter((doctor) => doctor.status === 'suspended').length} icon={XCircle} iconColor="red" />
      </div>

      <section className="admin-panel">
        {doctorsQuery.isLoading ? <p className="admin-inline-state">Loading live doctor list...</p> : null}
        {doctorsQuery.isError ? (
          <p className="admin-inline-state">
            Doctor data is unavailable.
          </p>
        ) : null}

        <div className="admin-card-list">
          {items.map((doctor) => (
            <article key={String(doctor.id)} className="admin-entity-card">
              <div className="admin-entity-main">
                <div className="admin-entity-avatar">
                  {doctor.name.split(' ').map((part) => part[0]).join('')}
                </div>
                <div className="admin-entity-copy">
                  <div className="admin-entity-headline">
                    <h3>{doctor.name}</h3>
                    {doctor.verified ? <CheckCircle size={18} className="admin-icon-success" /> : null}
                  </div>
                  <div className="admin-entity-meta">
                    <span>{doctor.specialty}</span>
                    <span>{doctor.license}</span>
                    <span>{doctor.hospital}</span>
                  </div>
                  <div className="admin-entity-stats">
                    {doctor.rating !== null ? <span><Star size={14} /> {doctor.rating} rating</span> : null}
                    {doctor.patients !== null ? <span>{doctor.patients} patients</span> : null}
                    {'yearsOfExperience' in doctor && doctor.yearsOfExperience !== null && doctor.yearsOfExperience !== undefined ? (
                      <span>{doctor.yearsOfExperience} years experience</span>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="admin-entity-actions">
                {statusBadge(doctor.status)}
                <button
                  type="button"
                  className="admin-btn admin-btn-primary"
                  onClick={() =>
                    setSelectedEditor({
                      id: String(doctor.id),
                      role: 'DOCTOR',
                      label: doctor.name,
                    })
                  }
                >
                  Edit Profile
                </button>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setSelectedDoctorId(String(doctor.id))}>
                  View Profile
                </button>
              </div>
            </article>
          ))}
        </div>

        {selectedDoctorId ? (
          <AdminDoctorPreviewModal
            doctorDetailsQuery={doctorDetailsQuery}
            onClose={() => setSelectedDoctorId(undefined)}
          />
        ) : null}

        {selectedEditor ? (
          <AdminEditableUserPanel selection={selectedEditor} onClose={() => setSelectedEditor(null)} />
        ) : null}
      </section>
    </div>
  )
}

export function AdminPharmaciesPage() {
  const [selectedEditor, setSelectedEditor] = useState<AdminEditorSelection | null>(null)
  const pharmaciesQuery = useAdminPharmacies()
  const items = buildDirectoryItems(pharmaciesQuery.data ?? [], 'Pharmacy')
  const liveCount = pharmaciesQuery.data?.length ?? 0
  const namedCount = items.filter((item) => item.name !== item.email).length
  const reviewCount = items.filter((item) => item.detailTone === 'pending').length

  return (
    <div className="admin-page-stack">
      <AdminPageHeader
        title="Pharmacy Management"
        description="Monitor pharmacy directory records, onboarding quality, and operational readiness."
        actions={
          <button type="button" className="admin-btn admin-btn-primary" onClick={() => void pharmaciesQuery.refetch()}>
            Refresh Directory
          </button>
        }
      />

      <div className="admin-summary-grid">
        <AdminStatCard title="Total Pharmacies" value={items.length} icon={Building2} iconColor="blue" />
        <AdminStatCard title="Live Backend Records" value={liveCount} icon={Activity} iconColor="cyan" />
        <AdminStatCard title="Named Profiles" value={namedCount} icon={CheckCircle} iconColor="green" />
        <AdminStatCard title="Needs Review" value={reviewCount} icon={AlertCircle} iconColor="orange" />
      </div>

      <section className="admin-panel">
        {pharmaciesQuery.isLoading ? <p className="admin-inline-state">Loading live pharmacy directory...</p> : null}
        {pharmaciesQuery.isError ? (
          <p className="admin-inline-state">
            Pharmacy data is unavailable.
          </p>
        ) : null}

        <div className="admin-card-list">
          {items.map((pharmacy) => (
            <article key={pharmacy.id} className="admin-entity-card">
              <div className="admin-entity-main">
                <div className="admin-entity-avatar">{getAdminInitials(pharmacy.name)}</div>
                <div className="admin-entity-copy">
                  <div className="admin-entity-headline">
                    <h3>{pharmacy.name}</h3>
                    <span className="admin-role-pill">{pharmacy.role}</span>
                  </div>
                  <div className="admin-entity-meta">
                    <span>{pharmacy.email}</span>
                    {pharmacy.meta.map((entry) => (
                      <span key={`${pharmacy.id}-${entry}`}>{entry}</span>
                    ))}
                  </div>
                  <div className="admin-entity-stats">
                    <span className={`admin-status-badge ${pharmacy.detailTone}`}>{pharmacy.detail}</span>
                  </div>
                </div>
              </div>
              <div className="admin-entity-actions">
                <DirectoryStatusBadge status={pharmacy.status} />
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() =>
                    setSelectedEditor({
                      id: pharmacy.id,
                      role: 'PHARMACY',
                      label: pharmacy.name,
                    })
                  }
                >
                  Edit Profile
                </button>
              </div>
            </article>
          ))}
        </div>

        {selectedEditor ? (
          <AdminEditableUserPanel selection={selectedEditor} onClose={() => setSelectedEditor(null)} />
        ) : null}
      </section>
    </div>
  )
}

export function AdminDiagnosticsPage() {
  const [selectedEditor, setSelectedEditor] = useState<AdminEditorSelection | null>(null)
  const diagnosticsQuery = useAdminDiagnostics()
  const items = buildDirectoryItems(diagnosticsQuery.data ?? [], 'Diagnostic')
  const liveCount = diagnosticsQuery.data?.length ?? 0
  const namedCount = items.filter((item) => item.name !== item.email).length
  const reviewCount = items.filter((item) => item.detailTone === 'pending').length

  return (
    <div className="admin-page-stack">
      <AdminPageHeader
        title="Diagnostic Management"
        description="Track diagnostic partner records, directory quality, and report-channel readiness."
        actions={
          <button type="button" className="admin-btn admin-btn-primary" onClick={() => void diagnosticsQuery.refetch()}>
            Refresh Directory
          </button>
        }
      />

      <div className="admin-summary-grid">
        <AdminStatCard title="Total Diagnostics" value={items.length} icon={Activity} iconColor="blue" />
        <AdminStatCard title="Live Backend Records" value={liveCount} icon={CheckCircle} iconColor="cyan" />
        <AdminStatCard title="Named Profiles" value={namedCount} icon={CheckCircle} iconColor="green" />
        <AdminStatCard title="Needs Review" value={reviewCount} icon={AlertCircle} iconColor="orange" />
      </div>

      <section className="admin-panel">
        {diagnosticsQuery.isLoading ? <p className="admin-inline-state">Loading live diagnostic directory...</p> : null}
        {diagnosticsQuery.isError ? (
          <p className="admin-inline-state">
            Diagnostic data is unavailable.
          </p>
        ) : null}

        <div className="admin-card-list">
          {items.map((diagnostic) => (
            <article key={diagnostic.id} className="admin-entity-card">
              <div className="admin-entity-main">
                <div className="admin-entity-avatar">{getAdminInitials(diagnostic.name)}</div>
                <div className="admin-entity-copy">
                  <div className="admin-entity-headline">
                    <h3>{diagnostic.name}</h3>
                    <span className="admin-role-pill">{diagnostic.role}</span>
                  </div>
                  <div className="admin-entity-meta">
                    <span>{diagnostic.email}</span>
                    {diagnostic.meta.map((entry) => (
                      <span key={`${diagnostic.id}-${entry}`}>{entry}</span>
                    ))}
                  </div>
                  <div className="admin-entity-stats">
                    <span className={`admin-status-badge ${diagnostic.detailTone}`}>{diagnostic.detail}</span>
                  </div>
                </div>
              </div>
              <div className="admin-entity-actions">
                <DirectoryStatusBadge status={diagnostic.status} />
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() =>
                    setSelectedEditor({
                      id: diagnostic.id,
                      role: 'DIAGNOSTIC',
                      label: diagnostic.name,
                    })
                  }
                >
                  Edit Profile
                </button>
              </div>
            </article>
          ))}
        </div>

        {selectedEditor ? (
          <AdminEditableUserPanel selection={selectedEditor} onClose={() => setSelectedEditor(null)} />
        ) : null}
      </section>
    </div>
  )
}

export function AdminAuditPage() {
  const [entityType, setEntityType] = useState('')
  const [entityId, setEntityId] = useState('')
  const [actorUserId, setActorUserId] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [limit, setLimit] = useState(50)
  const auditQuery = useAdminAuditLogs({
    entityType: entityType || undefined,
    entityId: entityId || undefined,
    actorUserId: actorUserId || undefined,
    from: from || undefined,
    to: to || undefined,
    limit,
  })
  const entries = auditQuery.data ?? []

  return (
    <div className="admin-page-stack">
      <AdminPageHeader
        title="Audit Logs"
        description="Inspect sensitive admin actions, role changes, and backend activity trails."
      />

      <section className="admin-panel admin-table-panel">
        <div className="admin-table-toolbar">
          <div className="admin-search-wrap wide">
            <Search size={16} />
            <input
              type="text"
              placeholder="Entity type (Appointment, Prescription, Notification...)"
              value={entityType}
              onChange={(event) => setEntityType(event.target.value)}
            />
          </div>
          <button type="button" className="admin-btn admin-btn-secondary" onClick={() => void auditQuery.refetch()}>
            <Filter size={16} />
            Apply Filters
          </button>
        </div>

        <div className="admin-table-toolbar">
          <div className="admin-search-wrap wide">
            <Search size={16} />
            <input
              type="text"
              placeholder="Entity ID"
              value={entityId}
              onChange={(event) => setEntityId(event.target.value)}
            />
          </div>
          <div className="admin-search-wrap wide">
            <Search size={16} />
            <input
              type="text"
              placeholder="Actor user UUID"
              value={actorUserId}
              onChange={(event) => setActorUserId(event.target.value)}
            />
          </div>
        </div>

        <div className="admin-table-toolbar">
          <div className="admin-search-wrap wide">
            <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
          </div>
          <div className="admin-search-wrap wide">
            <input type="date" value={to} onChange={(event) => setTo(event.target.value)} />
          </div>
          <div className="admin-search-wrap">
            <input
              type="number"
              min={1}
              max={200}
              value={limit}
              onChange={(event) => setLimit(Number(event.target.value) || 50)}
            />
          </div>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => {
              setEntityType('')
              setEntityId('')
              setActorUserId('')
              setFrom('')
              setTo('')
              setLimit(50)
            }}
          >
            Clear
          </button>
        </div>

        {auditQuery.isLoading ? <p className="admin-inline-state padded">Loading live audit logs...</p> : null}
        {auditQuery.isError ? <p className="admin-inline-state padded">Audit logs could not be loaded.</p> : null}

        {!auditQuery.isLoading && !auditQuery.isError ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Actor</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {entries.length > 0 ? (
                  entries.map((entry) => (
                    <tr key={entry.id}>
                      <td>
                        <div className="admin-cell-stack">
                          <strong>{entry.action}</strong>
                          <span>{entry.id}</span>
                        </div>
                      </td>
                      <td>
                        <div className="admin-cell-stack">
                          <strong>{entry.entityType}</strong>
                          <span>{entry.entityId}</span>
                        </div>
                      </td>
                      <td>{entry.actorUserId || 'System'}</td>
                      <td>{new Date(entry.createdAt).toLocaleString('en-US')}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>
                      <p className="admin-inline-state">No audit entries were returned by the backend.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  )
}

export function AdminNotificationsPage() {
  const notificationsQuery = useAdminNotifications()
  const markReadMutation = useAdminMarkNotificationRead()
  const markAllReadMutation = useAdminMarkAllNotificationsRead()
  const notifications = notificationsQuery.data ?? []
  const unreadCount = notifications.filter((item) => !item.read).length
  const readCount = notifications.length - unreadCount

  return (
    <div className="admin-page-stack">
      <AdminPageHeader
        title="Notifications Center"
        description="Review your live admin notifications and mark them as handled."
        actions={
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending || unreadCount === 0}
          >
            Mark All Read
          </button>
        }
      />

      <div className="admin-summary-grid">
        <AdminStatCard title="Total Notifications" value={notifications.length} icon={Bell} iconColor="blue" />
        <AdminStatCard title="Unread" value={unreadCount} icon={AlertCircle} iconColor="red" />
        <AdminStatCard title="Read" value={readCount} icon={CheckCircle} iconColor="green" />
        <AdminStatCard title="Available Types" value={4} icon={Activity} iconColor="cyan" subtitle="Current backend notification set" />
      </div>

      <section className="admin-panel">
        {notificationsQuery.isLoading ? <p className="admin-inline-state">Loading live notifications...</p> : null}
        {notificationsQuery.isError ? <p className="admin-inline-state">Notifications could not be loaded.</p> : null}

        {!notificationsQuery.isLoading && !notificationsQuery.isError ? (
          <div className="admin-card-list">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <article key={notification.id} className="admin-entity-card compact">
                  <div className="admin-entity-main">
                    <div className="admin-square-icon blue">
                      <Bell size={22} />
                    </div>
                    <div className="admin-entity-copy">
                      <div className="admin-entity-headline">
                        <h3>{notification.type.replace(/_/g, ' ')}</h3>
                        <span className={`admin-status-badge ${notification.read ? 'active' : 'open'}`}>
                          {notification.read ? 'Read' : 'Unread'}
                        </span>
                      </div>
                      <p className="admin-subtle-text">{notification.message}</p>
                      <div className="admin-entity-meta">
                        <span>{formatAdminRelativeTime(notification.createdAt)}</span>
                        <span>{new Date(notification.createdAt).toLocaleString('en-US')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="admin-entity-actions">
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      onClick={() => markReadMutation.mutate({ notificationId: notification.id, read: !notification.read })}
                      disabled={markReadMutation.isPending}
                    >
                      {notification.read ? 'Mark Unread' : 'Mark Read'}
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p className="admin-inline-state">No notifications were returned by the backend.</p>
            )}
          </div>
        ) : null}
      </section>
    </div>
  )
}

export function AdminProfilePage() {
  const { user, refreshUser } = useAuth()
  const appHealthQuery = useAdminAppHealth()
  const dbHealthQuery = useAdminDbHealth()
  const notificationsQuery = useAdminNotifications()
  const unreadNotifications = (notificationsQuery.data ?? []).filter((item) => !item.read).length
  const systemState =
    appHealthQuery.data?.status === 'ok' && dbHealthQuery.data?.status === 'ok'
      ? 'Healthy'
      : 'Needs Attention'

  return (
    <div className="admin-page-stack">
      <AdminPageHeader
        title="Admin Profile"
        description="Account details and profile photo."
      />

      <section className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <h3>Profile Photo</h3>
          </div>
        </div>
        <ProfileAvatarEditor
          fullName={user?.fullName}
          avatarUrl={user?.avatarUrl}
          queryKey={['admin', 'profile']}
          refreshUser={refreshUser}
        />
      </section>

      <section className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <h3>Account Overview</h3>
          </div>
        </div>

        <div className="admin-detail-grid">
          <div>
            <span>Full Name</span>
            <strong>{user?.fullName?.trim() || ''}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{user?.email || ''}</strong>
          </div>
          <div>
            <span>Role</span>
            <strong>{user?.role || 'ADMIN'}</strong>
          </div>
          <div>
            <span>User ID</span>
            <strong>{user?.userId || ''}</strong>
          </div>
          <div>
            <span>Unread Notifications</span>
            <strong>{unreadNotifications}</strong>
          </div>
          <div>
            <span>System Access</span>
            <strong>{systemState}</strong>
          </div>
        </div>
      </section>

    </div>
  )
}

export function AdminIntegrationsPage() {
  const appHealthQuery = useAdminAppHealth()
  const dbHealthQuery = useAdminDbHealth()
  const pharmaciesQuery = useAdminPharmacies()
  const diagnosticsQuery = useAdminDiagnostics()

  const cards = [
    {
      label: 'Backend API',
      status: appHealthQuery.data?.status === 'ok' ? 'healthy' : appHealthQuery.isError ? 'critical' : 'degraded',
      value: appHealthQuery.data?.status === 'ok' ? 'Operational' : appHealthQuery.isLoading ? 'Checking...' : 'Unavailable',
    },
    {
      label: 'Database',
      status: dbHealthQuery.data?.status === 'ok' ? 'healthy' : dbHealthQuery.isError ? 'critical' : 'degraded',
      value: dbHealthQuery.data?.status === 'ok' ? 'Connected' : dbHealthQuery.isLoading ? 'Checking...' : 'Unavailable',
    },
    {
      label: 'Pharmacy Directory',
      status: pharmaciesQuery.isError ? 'critical' : pharmaciesQuery.isLoading ? 'degraded' : 'healthy',
      value: pharmaciesQuery.isLoading ? 'Loading...' : pharmaciesQuery.isError ? 'Unavailable' : `${pharmaciesQuery.data?.length ?? 0} connected`,
    },
    {
      label: 'Diagnostic Directory',
      status: diagnosticsQuery.isError ? 'critical' : diagnosticsQuery.isLoading ? 'degraded' : 'healthy',
      value: diagnosticsQuery.isLoading ? 'Loading...' : diagnosticsQuery.isError ? 'Unavailable' : `${diagnosticsQuery.data?.length ?? 0} connected`,
    },
  ] as const

  return (
    <div className="admin-page-stack">
      <AdminPageHeader
        title="Integrations"
        description="Review connected services and infrastructure health across MedFlow."
      />

      <div className="admin-summary-grid">
        {cards.map((card) => (
          <div key={card.label} className="admin-highlight-card">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <p className={`admin-inline-tag ${card.status}`}>{card.status}</p>
          </div>
        ))}
      </div>

    </div>
  )
}
