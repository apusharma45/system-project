export type BrowserNotificationPermission = NotificationPermission | 'unsupported'

export function canUseBrowserNotifications(): boolean {
  return typeof window !== 'undefined' && typeof Notification !== 'undefined'
}

export function getPermissionState(): BrowserNotificationPermission {
  if (!canUseBrowserNotifications()) return 'unsupported'
  return Notification.permission
}

export async function requestBrowserNotificationPermission(): Promise<BrowserNotificationPermission> {
  if (!canUseBrowserNotifications()) return 'unsupported'
  try {
    return await Notification.requestPermission()
  } catch {
    return Notification.permission
  }
}

export function showBrowserNotification(title: string, options?: NotificationOptions): boolean {
  if (!canUseBrowserNotifications()) return false
  if (Notification.permission !== 'granted') return false
  try {
    const notice = new Notification(title, options)
    setTimeout(() => notice.close(), 8000)
    return true
  } catch {
    return false
  }
}
