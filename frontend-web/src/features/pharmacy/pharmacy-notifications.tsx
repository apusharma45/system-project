import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { Bell, FileText } from 'lucide-react'
import { api } from '../../lib/api'
import { connectNotificationsSocket } from '../../lib/socket'
import { useAuth } from '../auth/auth-context'
import { NotificationsPanel } from '../notifications/notifications-panel'
import { pharmacyInvalidateKeys, usePharmacyNotifications } from './pharmacy-shared'

export function PharmacyNotificationsPage() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const notificationsQuery = usePharmacyNotifications()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [realtimeEvents, setRealtimeEvents] = useState<string[]>([])

  useEffect(() => {
    if (!token) return
    const socket: Socket = connectNotificationsSocket(token)
    const onEvent = (eventName: string) => {
      setRealtimeEvents((prev) => [eventName, ...prev].slice(0, 20))
      void queryClient.invalidateQueries({ queryKey: pharmacyInvalidateKeys.notifications })
    }
    socket.on('prescription.ready', () => onEvent('prescription.ready'))
    return () => {
      socket.disconnect()
    }
  }, [queryClient, token])

  const markRead = useMutation({
    mutationFn: async (id: string) => (await api.patch(`/notifications/${id}/read`)).data,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: pharmacyInvalidateKeys.notifications }),
  })
  const markAllRead = useMutation({
    mutationFn: async () => (await api.patch('/notifications/read-all')).data,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: pharmacyInvalidateKeys.notifications }),
  })

  const stats = useMemo(() => {
    const list = notificationsQuery.data ?? []
    return {
      total: list.length,
      unread: list.filter((item) => !item.read).length,
      prescription: list.filter((item) => item.type === 'PRESCRIPTION_READY').length,
    }
  }, [notificationsQuery.data])

  const visible = useMemo(() => {
    const list = notificationsQuery.data ?? []
    return filter === 'unread' ? list.filter((item) => !item.read) : list
  }, [filter, notificationsQuery.data])

  return (
    <div className="page">
      <div className="page-head">
        <h1>Notifications</h1>
        <p>Pharmacy inbox with read-state controls and realtime updates.</p>
      </div>

      <section className="kpi-grid kpi-three">
        <article className="kpi">
          <p>Total</p>
          <h3>{stats.total}</h3>
        </article>
        <article className="kpi">
          <p>Unread</p>
          <h3>{stats.unread}</h3>
        </article>
        <article className="kpi">
          <p>Prescription Events</p>
          <h3>{stats.prescription}</h3>
        </article>
      </section>

      <section className="card">
        <div className="card-head">
          <h3>Notification Center</h3>
          <div className="actions">
            <button type="button" className={filter === 'all' ? 'tab active' : 'tab'} onClick={() => setFilter('all')}>
              All ({stats.total})
            </button>
            <button
              type="button"
              className={filter === 'unread' ? 'tab active' : 'tab'}
              onClick={() => setFilter('unread')}
            >
              Unread ({stats.unread})
            </button>
          </div>
        </div>

        <ul className="list">
          {visible.map((item) => (
            <li key={item.id}>
              <div className="row-title">
                <div className="icon-chip green">
                  {item.type === 'PRESCRIPTION_READY' ? <FileText size={18} /> : <Bell size={18} />}
                </div>
                <div>
                  <strong>{item.type}</strong>
                  <p>{item.message}</p>
                </div>
              </div>
              {!item.read ? (
                <button type="button" onClick={() => markRead.mutate(item.id)}>
                  Mark read
                </button>
              ) : (
                <span className="muted">Read</span>
              )}
            </li>
          ))}
          {visible.length === 0 ? <li className="empty">No notifications found.</li> : null}
        </ul>
      </section>

      <NotificationsPanel
        title="Realtime Event Stream"
        notifications={[]}
        realtimeEvents={realtimeEvents}
        onMarkRead={() => {}}
        onMarkAllRead={() => markAllRead.mutate()}
        busy={markAllRead.isPending}
      />
    </div>
  )
}
