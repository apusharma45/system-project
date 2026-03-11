export type Role = 'PATIENT' | 'DOCTOR' | 'PHARMACY' | 'DIAGNOSTIC' | 'ADMIN'

export type AppointmentStatus =
  | 'REQUESTED'
  | 'CONFIRMED'
  | 'CALLED'
  | 'IN_VISIT'
  | 'EXAM_DONE'
  | 'CLOSED'
  | 'CANCELLED'

export type LabOrderStatus =
  | 'CREATED'
  | 'ASSIGNED'
  | 'SAMPLE_COLLECTED'
  | 'SENT'

export type PrescriptionStatus =
  | 'DRAFT'
  | 'SIGNED'
  | 'SENT_TO_PATIENT'
  | 'SENT_TO_PHARMACY'
  | 'DISPENSED'

export type NotificationType =
  | 'APPOINTMENT_CALLED'
  | 'LAB_ASSIGNED'
  | 'LAB_RESULT_UPLOADED'
  | 'PRESCRIPTION_READY'

export type UserSummary = {
  id: string
  fullName?: string | null
  email: string
  role: Role
}

export type CurrentUser = {
  userId: string
  email: string
  role: Role
  fullName?: string | null
}

export type Appointment = {
  id: string
  patientId: string
  patient?: {
    id: string
    fullName?: string | null
    email?: string | null
  }
  doctorId: string
  status: AppointmentStatus
  scheduledAt: string | null
  reason?: string | null
  preferredDateFrom?: string | null
  preferredDateTo?: string | null
  preferredTimeNote?: string | null
  requiresLab: boolean
  labFlowLocked: boolean
  patientSnapshot?: {
    id: string
    fullName?: string | null
    email: string
    profile?: PatientMedicalProfile | null
  }
  patientHistorySummary?: {
    appointmentCount: number
    labOrderCount: number
    prescriptionCount: number
    latestAppointmentAt: string | null
    latestLabResultAt: string | null
    latestPrescriptionAt: string | null
  }
  doctorSnapshot?: {
    id: string
    fullName?: string | null
    email?: string | null
  }
}

export type LabReport = {
  id: string
  labOrderId: string
  fileUrl: string
  filePublicId?: string | null
  fileMimeType?: string | null
  fileSizeBytes?: number | null
  uploadedAt: string
}

export type LabTestItem = {
  title: string
  description: string
}

export type LabOrder = {
  id: string
  appointmentId: string
  diagnosticId: string
  status: LabOrderStatus
  tests?: LabTestItem[] | null
  appointment?: Appointment
  patientClinicalSnapshot?: {
    fullName?: string | null
    email?: string | null
    phone?: string | null
    gender?: string | null
    ageYears?: number | null
  }
  diagnosticSnapshot?: {
    name: string
    address?: string | null
    phone?: string | null
  }
  labReports?: LabReport[]
  latestReport?: LabReport | null
  // compatibility field during migration to multi-report UI
  labResult?: LabReport | null
}

export type Prescription = {
  id: string
  appointmentId: string
  doctorId: string
  pharmacyId: string
  notes: string
  diagnosis?: string | null
  instructions?: string | null
  medications?: Array<{
    name: string
    dosage?: string
    frequency?: string
    duration?: string
    route?: string
  }> | null
  status: PrescriptionStatus
  documentUrl?: string | null
  documentPublicId?: string | null
  documentMimeType?: string | null
  documentVersion?: number
  appointment?: Appointment
}

export type AppNotification = {
  id: string
  userId: string
  type: NotificationType
  message: string
  read: boolean
  createdAt: string
}

export type PatientMedicalProfile = {
  dateOfBirth?: string | null
  gender?: string | null
  phone?: string | null
  address?: string | null
  allergies?: string | null
  chronicConditions?: string | null
  currentMedications?: string | null
  emergencyContactName?: string | null
  emergencyContactPhone?: string | null
  emergencyContactRelation?: string | null
}

export type PatientProfileResponse = {
  patient: {
    id: string
    fullName?: string | null
    email: string
    joinedAt: string
    profile?: PatientMedicalProfile | null
  }
  summary: {
    appointmentCount: number
    labOrderCount: number
    prescriptionCount: number
  }
  history: {
    appointments: Appointment[]
    labOrders: LabOrder[]
    prescriptions: Prescription[]
  }
}

export type MyPatientProfileResponse = {
  patient: {
    id: string
    fullName?: string | null
    email: string
    role: Role
    phone?: string | null
    address?: string | null
    joinedAt: string
    profile?: PatientMedicalProfile | null
  }
}

export type DoctorProfessionalProfile = {
  licenseNumber?: string | null
  specialization?: string | null
  dateOfBirth?: string | null
  gender?: string | null
  degrees?: string[] | null
  certifications?: string[] | null
  yearsOfExperience?: number | null
}

export type MyDoctorProfileResponse = {
  doctor: {
    id: string
    fullName?: string | null
    email: string
    role: Role
    phone?: string | null
    address?: string | null
    joinedAt: string
    profile?: DoctorProfessionalProfile | null
  }
}

export type DiagnosticProfessionalProfile = {
  labName?: string | null
  licenseNumber?: string | null
  dateOfBirth?: string | null
  gender?: string | null
  accreditations?: string[] | null
  availableTests?: string[] | null
}

export type MyDiagnosticProfileResponse = {
  diagnostic: {
    id: string
    fullName?: string | null
    email: string
    role: Role
    phone?: string | null
    address?: string | null
    joinedAt: string
    profile?: DiagnosticProfessionalProfile | null
  }
}
