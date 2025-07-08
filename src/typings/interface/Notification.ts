import type { NotificationType } from './NotificationType'

export interface Notification {
  message: string
  status: NotificationType
  id: string
}
