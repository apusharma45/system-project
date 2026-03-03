import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { AppNotification, LabOrder, LabOrderStatus } from '../../types'

export const diagnosticInvalidateKeys = {
  labs: ['labs'] as const,
  notifications: ['notifications'] as const,
}

export const labTransitionActions: Array<{
  label: string
  action: 'assign' | 'sample-collected' | 'result-uploaded' | 'sent'
  from: LabOrderStatus[]
}> = [
  { label: 'Assign', action: 'assign', from: ['CREATED'] },
  { label: 'Sample Collected', action: 'sample-collected', from: ['ASSIGNED'] },
  { label: 'Result Uploaded', action: 'result-uploaded', from: ['SAMPLE_COLLECTED'] },
  { label: 'Mark Sent', action: 'sent', from: ['RESULT_UPLOADED'] },
]

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
