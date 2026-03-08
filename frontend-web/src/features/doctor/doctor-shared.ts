import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type {
  AppNotification,
  Appointment,
  LabOrder,
  PatientProfileResponse,
  Prescription,
  UserSummary,
} from '../../types'

export function useDoctorAppointments() {
  return useQuery({
    queryKey: ['appointments', 'doctor'],
    queryFn: async () => (await api.get<Appointment[]>('/appointments/me')).data,
  })
}

export function useDoctorDiagnostics() {
  return useQuery({
    queryKey: ['users', 'diagnostics'],
    queryFn: async () => (await api.get<UserSummary[]>('/users/diagnostics')).data,
  })
}

export function useDoctorPharmacies() {
  return useQuery({
    queryKey: ['users', 'pharmacies'],
    queryFn: async () => (await api.get<UserSummary[]>('/users/pharmacies')).data,
  })
}

export function useDoctorLabOrders() {
  return useQuery({
    queryKey: ['labs', 'doctor'],
    queryFn: async () => (await api.get<LabOrder[]>('/labs/orders/me')).data,
  })
}

export function useDoctorPrescriptions() {
  return useQuery({
    queryKey: ['prescriptions', 'doctor'],
    queryFn: async () => (await api.get<Prescription[]>('/prescriptions/me')).data,
  })
}

export function useDoctorNotifications() {
  return useQuery({
    queryKey: ['notifications', 'doctor'],
    queryFn: async () => (await api.get<AppNotification[]>('/notifications/me')).data,
  })
}

export function useDoctorPatientProfile(patientId: string | undefined) {
  return useQuery({
    queryKey: ['patients', 'doctor-profile', patientId],
    queryFn: async () => (await api.get<PatientProfileResponse>(`/patients/${patientId}/profile`)).data,
    enabled: Boolean(patientId),
  })
}
