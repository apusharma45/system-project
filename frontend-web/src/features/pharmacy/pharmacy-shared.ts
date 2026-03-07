import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { AppNotification, Prescription, PrescriptionStatus } from '../../types'

export const pharmacyInvalidateKeys = {
  prescriptions: ['prescriptions'] as const,
  notifications: ['notifications'] as const,
}

export const pharmacyPrescriptionActions: Array<{
  label: string
  action: 'dispense'
  from: PrescriptionStatus[]
}> = [{ label: 'Dispense', action: 'dispense', from: ['SENT_TO_PHARMACY'] }]

export function usePharmacyPrescriptions() {
  return useQuery({
    queryKey: ['prescriptions', 'pharmacy'],
    queryFn: async () => (await api.get<Prescription[]>('/prescriptions/me')).data,
  })
}

export function usePharmacyNotifications() {
  return useQuery({
    queryKey: ['notifications', 'pharmacy'],
    queryFn: async () => (await api.get<AppNotification[]>('/notifications/me')).data,
  })
}
