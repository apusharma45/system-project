import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { Bell, Calendar, FileText, FlaskConical } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import {
  showBrowserNotification,
} from '../../lib/browser-notifications'
import { connectNotificationsSocket } from '../../lib/socket'
import { useAuth } from '../auth/auth-context'
import { NotificationsPanel } from '../notifications/notifications-panel'
import type { AppNotification } from '../../types'

export function PatientNotificationsPage() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const [realtimeEvents, setRealtimeEvents] = useState<string[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [socketWarning, setSocketWarning] = useState<string | null>(null)
  const didWarnOnceRef = useRef(false)

  const notificationsQuery = useQuery({
    queryKey: ['notifications', 'patient'],
    queryFn: async () => (await api.get<AppNotification[]>('/notifications/me')).data,
  })

  useEffect(() => {
    if (!token) return
    const socket: Socket = connectNotificationsSocket(token)
    const onEvent = (eventName: string) => {
      setRealtimeEvents((prev) => [eventName, ...prev].slice(0, 20))
      void queryClient.invalidateQueries({ queryKey: ['notifications'] })
      if (eventName === 'appointment.called') {
        showBrowserNotification('Appointment Update', {
          body: 'Your appointment has been called.',
        })
      } else if (eventName === 'lab.assigned') {
        showBrowserNotification('Lab Assigned', {
          body: 'A lab has been assigned for your appointment.',
        })
      } else if (eventName === 'lab.result_uploaded') {
        showBrowserNotification('Lab Result Uploaded', {
          body: 'Your lab report is now available.',
        })
      } else if (eventName === 'prescription.ready') {
        showBrowserNotification('Prescription Ready', {
          body: 'Your prescription is ready.',
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
        // Keep this concise to avoid noisy repeated logs in StrictMode.
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
    socket.on('lab.assigned', () => onEvent('lab.assigned'))
    socket.on('lab.result_uploaded', () => onEvent('lab.result_uploaded'))
    socket.on('prescription.ready', () => onEvent('prescription.ready'))
    return () => {
      socket.off('connect', onConnect)
      socket.off('connect_error', onConnectError)
      socket.off('disconnect', onDisconnect)
      socket.off('appointment.called')
      socket.off('lab.assigned')
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
      lab: list.filter((item) => item.type === 'LAB_RESULT_UPLOADED' || item.type === 'LAB_ASSIGNED').length,
      prescription: list.filter((item) => item.type === 'PRESCRIPTION_READY').length,
    }
  }, [notificationsQuery.data])

  const visibleNotifications = useMemo(() => {
    return filter === 'unread'
      ? (notificationsQuery.data ?? []).filter((item) => !item.read)
      : notificationsQuery.data ?? []
  }, [notificationsQuery.data, filter])

  return (
    <div className="page patient-page patient-notifications-page">
      <section className="patient-hero">
        <div className="page-head">
          <div>
            <p className="patient-eyebrow">Update Center</p>
            <h1>Notifications</h1>
            <p>Track your appointment, lab, and prescription updates in one consistent feed.</p>
          </div>
          <div className="page-toolbar patient-toolbar">
            <button
              type="button"
              className="outline-btn"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
            >
              Mark All Read
            </button>
          </div>
        </div>

        <section className="patient-hero-stats">
          <article className="patient-hero-stat">
            <p>Total</p>
            <h3>{stats.total}</h3>
          </article>
          <article className="patient-hero-stat">
            <p>Unread</p>
            <h3>{stats.unread}</h3>
          </article>
          <article className="patient-hero-stat">
            <p>Appointment</p>
            <h3>{stats.appointment}</h3>
          </article>
          <article className="patient-hero-stat">
            <p>Lab + Rx</p>
            <h3>{stats.lab + stats.prescription}</h3>
          </article>
        </section>
      </section>

      {socketWarning ? <p className="patient-feedback info">{socketWarning}</p> : null}
      {notificationsQuery.isLoading ? <p className="patient-feedback info">Loading notifications...</p> : null}
      {notificationsQuery.error ? <p className="patient-feedback error">Failed to load notifications.</p> : null}

      {!notificationsQuery.isLoading && !notificationsQuery.error ? (
        <section className="card patient-card">
          <div className="card-head patient-card-head">
            <div>
              <p className="patient-kicker">Message Feed</p>
              <h3>Notification Center</h3>
            </div>
            <div className="actions patient-tabs">
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
          <ul className="list patient-list">
            {visibleNotifications.map((item) => (
              <li key={item.id}>
                <div className="patient-list-content">
                  <div className="row-title">
                    <div
                      className={`icon-chip ${
                        item.type === 'APPOINTMENT_CALLED'
                          ? 'blue'
                          : item.type === 'LAB_RESULT_UPLOADED' || item.type === 'LAB_ASSIGNED'
                            ? 'purple'
                            : item.type === 'PRESCRIPTION_READY'
                              ? 'green'
                              : 'orange'
                      }`}
                    >
                      {item.type === 'APPOINTMENT_CALLED' ? (
                        <Calendar size={18} />
                      ) : item.type === 'LAB_RESULT_UPLOADED' || item.type === 'LAB_ASSIGNED' ? (
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
                </div>
                <div className="patient-notification-actions">
                  {!item.read ? (
                    <button type="button" onClick={() => markRead.mutate(item.id)}>
                      Mark read
                    </button>
                  ) : (
                    <span className="muted">Read</span>
                  )}
                  {item.type === 'PRESCRIPTION_READY' ? (
                    <Link to="/patient/records?tab=prescriptions" className="patient-action-link">
                      View Prescription
                    </Link>
                  ) : null}
                  {item.type === 'LAB_RESULT_UPLOADED' ? (
                    <Link to="/patient/records?tab=reports" className="patient-action-link">
                      View Report
                    </Link>
                  ) : null}
                  {item.type === 'LAB_ASSIGNED' ? (
                    <Link to="/patient/records?tab=labs" className="patient-action-link">
                      View Lab Order
                    </Link>
                  ) : null}
                </div>
              </li>
            ))}
            {visibleNotifications.length === 0 ? (
              <li className="empty">No notifications found.</li>
            ) : null}
          </ul>
        </section>
      ) : null}

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
