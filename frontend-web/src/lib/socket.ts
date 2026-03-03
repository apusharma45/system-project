import { io, Socket } from 'socket.io-client'
import { apiBaseUrl } from './api'

export function connectNotificationsSocket(token: string): Socket {
  return io(`${apiBaseUrl}/notifications`, {
    transports: ['websocket'],
    auth: {
      token: `Bearer ${token}`,
    },
  })
}
