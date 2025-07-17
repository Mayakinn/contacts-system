import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'
import { login, verifyToken } from '@/auth/authContext'

import { NotificationType } from '@/typings/interface/NotificationType'
import { useNotificationStore } from './notificationStore'
import type { User } from '@/typings/interface/User'

export const useAuthStore = defineStore('authContext', () => {
  const jwtToken = ref<string | null>(localStorage.getItem('token'))
  const User = ref<User | null>(null)

  const notif = useNotificationStore()

  async function loginUser(email: string, password: string) {
    try {
      const response = await login(email, password)
      if (response != null) {
        jwtToken.value = response.token
        User.value = response.record
        notif.addNotification('Prisijungimas sėkmingas!', NotificationType.success)
      }
    } catch (error) {
      notif.addNotification(
        'Blogai įvestas slaptažodis ir/arba el.paštas!',
        NotificationType.danger,
      )
    }
    return
  }

  function logOutUser() {
    if (jwtToken.value != null) {
      localStorage.removeItem('token')
      User.value = null
      jwtToken.value = null
      notif.addNotification('Sėkmingai atsijungta', NotificationType.success)
      return
    }
    notif.addNotification('Nepavyko atsijungti...', NotificationType.danger)
  }

  async function checkTokenExpiration() {
    if (jwtToken.value == null) {
      return null
    }
    try {
      const response = await verifyToken()

      if (response != null) return response.record
    } catch (error) {
      notif.addNotification('Sesija baigėsi, prisijungite per naujo', NotificationType.info)
    }
  }

  onMounted(async () => {
    User.value = await checkTokenExpiration()
  })
  return { jwtToken, User, loginUser, logOutUser }
})
