import { defineStore } from 'pinia'
import { readonly, ref, shallowReadonly } from 'vue'
import { NotificationType } from '@/typings/interface/NotificationType'
import { type Notification } from '@/typings/interface/Notification'
import { v4 as uuidv4 } from 'uuid'

export const useNotificationStore = defineStore('notification', () => {
  const Notifs = ref<Notification[]>([])

  function deleteNotification(id: string) {
    Notifs.value = Notifs.value.filter((n) => n.id !== id)
  }

  function addNotification(message: string, status: NotificationType) {
    const id = uuidv4()
    const notification = { message, status, id }

    const duplicate = Notifs.value.some((notif) => notif.message === notification.message)
    if (!duplicate) {
      Notifs.value.push(notification)
    } else {
      return
    }

    const delay = 3000 * Notifs.value.length
    setTimeout(() => {
      deleteNotification(id)
    }, delay)
  }

  return { Notifs: readonly(Notifs), deleteNotification, addNotification }
})
