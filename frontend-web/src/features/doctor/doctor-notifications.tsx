import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { Bell, Calendar, FileText, FlaskConical } from 'lucide-react'
import { api } from '../../lib/api'
import {
  showBrowserNotification,
} from '../../lib/browser-notifications'
import { connectNotificationsSocket } from '../../lib/socket'
import { useAuth } from '../auth/auth-context'
import { NotificationsPanel } from '../notifications/notifications-panel'
import { useDoctorNotifications } from './doctor-shared'

export function DoctorNotificationsPage() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const notificationsQuery = useDoctorNotifications()
  const [realtimeEvents, setRealtimeEvents] = useState<string[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [socketWarning, setSocketWarning] = useState<string | null>(null)
  const didWarnOnceRef = useRef(false)

  useEffect(() => {
    if (!token) return
    const socket: Socket = connectNotificationsSocket(token)
    const onEvent = (eventName: string) => {
      setRealtimeEvents((prev) => [eventName, ...prev].slice(0, 20))
      void queryClient.invalidateQueries({ queryKey: ['notifications'] })
      if (eventName === 'appointment.called') {
        showBrowserNotification('Appointment Called', {
          body: 'A patient appointment has been called.',
        })
      } else if (eventName === 'lab.result_uploaded') {
        showBrowserNotification('Lab Result Uploaded', {
          body: 'A lab report has been uploaded.',
        })
      } else if (eventName === 'prescription.ready') {
        showBrowserNotification('Prescription Ready', {
          body: 'A prescription update is available.',
        })
      }
    }
    const onConnect = () => {
      setSocketWarning(null)
      didWarnOnceRef.current = false
    }
    const onConnectError = (err: { message?: string }) => {
      setSocketWarning('Realtime connection unavailable. Retrying...')
      if (!didWarnOnceRef.current) {
        console.warn('notifications socket connect_error:', err?.message ?? 'unknown')
        didWarnOnceRef.current = true
      }
    }
    const onDisconnect = (reason: string) => {
      if (reason !== 'io client disconnect') {
        setSocketWarning('Realtime connection unavailable. Retrying...')
      }
    }
    socket.on('connect', onConnect)
    socket.on('connect_error', onConnectError)
    socket.on('disconnect', onDisconnect)
    socket.on('appointment.called', () => onEvent('appointment.called'))
    socket.on('lab.result_uploaded', () => onEvent('lab.result_uploaded'))
    socket.on('prescription.ready', () => onEvent('prescription.ready'))
    return () => {
      socket.off('connect', onConnect)
      socket.off('connect_error', onConnectError)
      socket.off('disconnect', onDisconnect)
      socket.off('appointment.called')
      socket.off('lab.result_uploaded')
      socket.off('prescription.ready')
      socket.disconnect()
    }
  }, [queryClient, token])

  const markRead = useMutation({
    mutationFn: async (id: string) => (await api.patch(`/notifications/${id}/read`)).data,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })
  const markAllRead = useMutation({
    mutationFn: async () => (await api.patch('/notifications/read-all')).data,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const stats = useMemo(() => {
    const list = notificationsQuery.data ?? []
    return {
      total: list.length,
      unread: list.filter((item) => !item.read).length,
      appointment: list.filter((item) => item.type === 'APPOINTMENT_CALLED').length,
      lab: list.filter((item) => item.type === 'LAB_RESULT_UPLOADED').length,
      prescription: list.filter((item) => item.type === 'PRESCRIPTION_READY').length,
    }
  }, [notificationsQuery.data])

  const visibleNotifications = useMemo(() => {
    const list = notificationsQuery.data ?? []
    return filter === 'unread' ? list.filter((item) => !item.read) : list
  }, [notificationsQuery.data, filter])

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Notifications</h1>
          <p>Stay updated with real-time clinical workflow events.</p>
        </div>
        <div className="page-toolbar">
          <button type="button" className="outline-btn" onClick={() => markAllRead.mutate()} disabled={markAllRead.isPending}>
            Mark All Read
          </button>
        </div>
      </div>

      {socketWarning ? <p className="muted">{socketWarning}</p> : null}

      <section className="kpi-grid">
        <article className="kpi">
          <p>Total</p>
          <h3>{stats.total}</h3>
        </article>
        <article className="kpi">
          <p>Unread</p>
          <h3>{stats.unread}</h3>
        </article>
        <article className="kpi">
          <p>Appointment</p>
          <h3>{stats.appointment}</h3>
        </article>
        <article className="kpi">
          <p>Lab + Rx</p>
          <h3>{stats.lab + stats.prescription}</h3>
        </article>
      </section>

      <section className="card">
        <div className="card-head">
          <h3>Notification Center</h3>
          <div className="actions">
            <button
              type="button"
              className={filter === 'all' ? 'tab active' : 'tab'}
              onClick={() => setFilter('all')}
            >
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
          {visibleNotifications.map((item) => (
            <li key={item.id}>
              <div className="row-title">
                <div
                  className={`icon-chip ${
                    item.type === 'APPOINTMENT_CALLED'
                      ? 'blue'
                      : item.type === 'LAB_RESULT_UPLOADED'
                        ? 'purple'
                        : item.type === 'PRESCRIPTION_READY'
                          ? 'green'
                          : 'orange'
                  }`}
                >
                  {item.type === 'APPOINTMENT_CALLED' ? (
                    <Calendar size={18} />
                  ) : item.type === 'LAB_RESULT_UPLOADED' ? (
                    <FlaskConical size={18} />
                  ) : item.type === 'PRESCRIPTION_READY' ? (
                    <FileText size={18} />
                  ) : (
                    <Bell size={18} />
                  )}
                </div>
                <div>
                  <strong>{item.type}</strong>
                  <p>{item.message}</p>
                  <p className="muted">{new Date(item.createdAt).toLocaleString()}</p>
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
          {visibleNotifications.length === 0 ? <li className="empty">No notifications found.</li> : null}
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
