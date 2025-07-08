import { defineStore } from 'pinia'
import { ref } from 'vue'
import { NotificationType } from '@/typings/interface/NotificationType'
import { type Notification } from '@/typings/interface/Notification'
import { v4 as uuidv4 } from 'uuid'

export const useNotificationStore = defineStore('notification', () => {
  const Notifs = ref<Notification[]>([])

  function deleteNotification(id: string) {
    Notifs.value = Notifs.value.filter((n) => n.id !== id)
  }

  function newNotification(message: string, status: NotificationType) {
    const id = uuidv4()
    const notification = { message, status, id }
    Notifs.value.push(notification)
    setTimeout(() => {
      deleteNotification(id)
    }, 5000)
  }

  return { Notifs, deleteNotification, newNotification }
})
