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
  | 'RESULT_UPLOADED'
  | 'SENT'

export type PrescriptionStatus =
  | 'DRAFT'
  | 'SIGNED'
  | 'SENT_TO_PATIENT'
  | 'SENT_TO_PHARMACY'
  | 'DISPENSED'

export type NotificationType =
  | 'APPOINTMENT_CALLED'
  | 'LAB_RESULT_UPLOADED'
  | 'PRESCRIPTION_READY'

export type UserSummary = {
  id: string
  email: string
  role: Role
}

export type CurrentUser = {
  userId: string
  email: string
  role: Role
}

export type Appointment = {
  id: string
  patientId: string
  doctorId: string
  status: AppointmentStatus
  scheduledAt: string
  requiresLab: boolean
  labFlowLocked: boolean
}

export type LabResult = {
  id: string
  labOrderId: string
  fileUrl: string
  uploadedAt: string
}

export type LabOrder = {
  id: string
  appointmentId: string
  diagnosticId: string
  status: LabOrderStatus
  appointment?: Appointment
  labResult?: LabResult | null
}

export type Prescription = {
  id: string
  appointmentId: string
  doctorId: string
  pharmacyId: string
  notes: string
  status: PrescriptionStatus
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
