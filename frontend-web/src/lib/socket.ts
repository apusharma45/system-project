import { io, Socket } from 'socket.io-client'
import { apiBaseUrl } from './api'

export function connectNotificationsSocket(token: string): Socket {
  return io(`${apiBaseUrl}/notifications`, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
    auth: {
      token: `Bearer ${token}`,
    },
  })
}
