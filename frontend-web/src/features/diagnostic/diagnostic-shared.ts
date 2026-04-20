import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { AppNotification, LabOrder, MyDiagnosticProfileResponse } from '../../types'

export function useDiagnosticLabOrders() {
  return useQuery({
    queryKey: ['labs', 'diagnostic'],
    queryFn: async () => (await api.get<LabOrder[]>('/labs/orders/me')).data,
  })
}

export function useDiagnosticNotifications() {
  return useQuery({
    queryKey: ['notifications', 'diagnostic'],
    queryFn: async () => (await api.get<AppNotification[]>('/notifications/me')).data,
  })
}

export function useDiagnosticMyProfile() {
  return useQuery({
    queryKey: ['diagnostic-profile', 'me'],
    queryFn: async () => (await api.get<MyDiagnosticProfileResponse>('/diagnostic/me/profile')).data,
  })
}
