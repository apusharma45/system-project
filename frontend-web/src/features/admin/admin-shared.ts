import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type {
  AppNotification,
  AuditLogEntry,
  HealthCheckResponse,
  MyDiagnosticProfileResponse,
  MyDoctorProfileResponse,
  MyPatientProfileResponse,
  MyPharmacyProfileResponse,
  PatientDoctorDetailsResponse,
  UserSummary,
} from '../../types'

export type AdminAuditQuery = {
  entityType?: string
  entityId?: string
  actorUserId?: string
  from?: string
  to?: string
  limit?: number
}

export function useAdminDoctors() {
  return useQuery({
    queryKey: ['admin', 'users', 'doctors'],
    queryFn: async () => (await api.get<UserSummary[]>('/users/doctors')).data,
  })
}

export function useAdminPatients() {
  return useQuery({
    queryKey: ['admin', 'users', 'patients'],
    queryFn: async () => (await api.get<UserSummary[]>('/patients')).data,
  })
}

export function useAdminDoctorDetails(doctorId: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'users', 'doctor-details', doctorId],
    queryFn: async () => (await api.get<PatientDoctorDetailsResponse>(`/users/doctors/${doctorId}`)).data,
    enabled: Boolean(doctorId),
  })
}

export function useAdminPharmacies() {
  return useQuery({
    queryKey: ['admin', 'users', 'pharmacies'],
    queryFn: async () => (await api.get<UserSummary[]>('/users/pharmacies')).data,
  })
}

export function useAdminDiagnostics() {
  return useQuery({
    queryKey: ['admin', 'users', 'diagnostics'],
    queryFn: async () => (await api.get<UserSummary[]>('/users/diagnostics')).data,
  })
}

export function useAdminDoctorProfile(doctorId: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'doctor-profile', doctorId],
    queryFn: async () => (await api.get<MyDoctorProfileResponse>(`/doctors/${doctorId}/profile`)).data,
    enabled: Boolean(doctorId),
  })
}

export function useAdminPharmacyProfile(pharmacyId: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'pharmacy-profile', pharmacyId],
    queryFn: async () =>
      (await api.get<MyPharmacyProfileResponse>(`/pharmacies/${pharmacyId}/profile`)).data,
    enabled: Boolean(pharmacyId),
  })
}

export function useAdminDiagnosticProfile(diagnosticId: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'diagnostic-profile', diagnosticId],
    queryFn: async () =>
      (await api.get<MyDiagnosticProfileResponse>(`/diagnostic/${diagnosticId}/profile`)).data,
    enabled: Boolean(diagnosticId),
  })
}

export function useAdminPatientProfile(patientId: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'patient-profile', patientId],
    queryFn: async () =>
      (await api.get<MyPatientProfileResponse>(`/patients/${patientId}/admin-profile`)).data,
    enabled: Boolean(patientId),
  })
}

export function useAdminUpdateDoctorProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      doctorId,
      payload,
    }: {
      doctorId: string
      payload: Record<string, unknown>
    }) => (await api.patch<MyDoctorProfileResponse>(`/doctors/${doctorId}/profile`, payload)).data,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'doctors'] })
      void queryClient.invalidateQueries({ queryKey: ['admin', 'doctor-profile', variables.doctorId] })
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'doctor-details', variables.doctorId] })
    },
  })
}

export function useAdminUpdatePharmacyProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      pharmacyId,
      payload,
    }: {
      pharmacyId: string
      payload: Record<string, unknown>
    }) =>
      (await api.patch<MyPharmacyProfileResponse>(`/pharmacies/${pharmacyId}/profile`, payload)).data,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'pharmacies'] })
      void queryClient.invalidateQueries({ queryKey: ['admin', 'pharmacy-profile', variables.pharmacyId] })
    },
  })
}

export function useAdminUpdateDiagnosticProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      diagnosticId,
      payload,
    }: {
      diagnosticId: string
      payload: Record<string, unknown>
    }) =>
      (await api.patch<MyDiagnosticProfileResponse>(`/diagnostic/${diagnosticId}/profile`, payload))
        .data,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'diagnostics'] })
      void queryClient.invalidateQueries({
        queryKey: ['admin', 'diagnostic-profile', variables.diagnosticId],
      })
    },
  })
}

export function useAdminUpdatePatientProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      patientId,
      payload,
    }: {
      patientId: string
      payload: Record<string, unknown>
    }) =>
      (await api.patch<MyPatientProfileResponse>(`/patients/${patientId}/admin-profile`, payload)).data,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'patients'] })
      void queryClient.invalidateQueries({ queryKey: ['admin', 'patient-profile', variables.patientId] })
    },
  })
}

export function useAdminAuditLogs(query: number | AdminAuditQuery = 50) {
  const normalizedQuery = typeof query === 'number' ? { limit: query } : query
  return useQuery({
    queryKey: ['admin', 'audit', normalizedQuery],
    queryFn: async () => (await api.get<AuditLogEntry[]>('/audit', { params: normalizedQuery })).data,
  })
}

export function useAdminAppHealth() {
  return useQuery({
    queryKey: ['admin', 'health', 'app'],
    queryFn: async () => (await api.get<HealthCheckResponse>('/health')).data,
  })
}

export function useAdminDbHealth() {
  return useQuery({
    queryKey: ['admin', 'health', 'db'],
    queryFn: async () => (await api.get<HealthCheckResponse>('/health/db')).data,
  })
}

export function useAdminNotifications() {
  return useQuery({
    queryKey: ['admin', 'notifications'],
    queryFn: async () => (await api.get<AppNotification[]>('/notifications/me')).data,
  })
}

export function useAdminMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ notificationId, read }: { notificationId: string; read: boolean }) =>
      (
        await api.patch<AppNotification>(`/notifications/${notificationId}/read`, {
          read,
        })
      ).data,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] })
    },
  })
}

export function useAdminMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => (await api.patch('/notifications/read-all')).data,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] })
    },
  })
}
