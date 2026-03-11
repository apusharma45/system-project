import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Bell, FlaskConical } from 'lucide-react'
import { api } from '../../lib/api'
import { useDiagnosticNotifications } from './diagnostic-shared'

export function DiagnosticNotificationsPage() {
  const queryClient = useQueryClient()
  const notificationsQuery = useDiagnosticNotifications()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

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
        <p>Realtime updates for lab report delivery and workflow events.</p>
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
          <p>Lab Events</p>
          <h3>{stats.total}</h3>
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
            <button type="button" className="outline-btn" onClick={() => markAllRead.mutate()}>
              Mark All Read
            </button>
          </div>
        </div>
        <ul className="list">
          {visible.map((item) => (
            <li key={item.id}>
              <div className="row-title">
                <div className="icon-chip purple">
                  {item.type === 'LAB_RESULT_UPLOADED' ? <FlaskConical size={18} /> : <Bell size={18} />}
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
          {visible.length === 0 ? <li className="empty">No notifications found.</li> : null}
        </ul>
      </section>
    </div>
  )
}
