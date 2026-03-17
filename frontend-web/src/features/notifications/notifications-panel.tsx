import type { AppNotification } from '../../types'

type NotificationsPanelProps = {
  title?: string
  notifications: AppNotification[]
  realtimeEvents: string[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  busy?: boolean
}

export function NotificationsPanel({
  title = 'Notifications',
  notifications,
  realtimeEvents,
  onMarkRead,
  onMarkAllRead,
  busy,
}: NotificationsPanelProps) {
  return (
    <section className="card notifications-panel">
      <div className="card-head">
        <h3>{title}</h3>
        <button type="button" onClick={onMarkAllRead} disabled={busy || notifications.length === 0}>
          Mark all read
        </button>
      </div>
      <ul className="list">
        {notifications.length === 0 ? <li className="empty">No notifications yet.</li> : null}
        {notifications.map((item) => (
          <li key={item.id}>
            <div>
              <strong>{item.type}</strong>
              <p>{item.message}</p>
            </div>
            {!item.read ? (
              <button type="button" onClick={() => onMarkRead(item.id)} disabled={busy}>
                Mark read
              </button>
            ) : (
              <span className="muted">Read</span>
            )}
          </li>
        ))}
      </ul>

      <h4 className="notifications-panel-heading">Realtime Events</h4>
      <ul className="list notifications-panel-events">
        {realtimeEvents.length === 0 ? <li className="empty">No realtime events yet.</li> : null}
        {realtimeEvents.map((event, idx) => (
          <li key={`${event}-${idx}`}>{event}</li>
        ))}
      </ul>
    </section>
  )
}
