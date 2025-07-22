import { defineStore } from 'pinia'
import { onMounted, readonly, ref } from 'vue'
import { login, tokenRefresh } from '@/auth/authContext'

import { NotificationType } from '@/typings/interface/NotificationType'
import { useNotificationStore } from './notificationStore'
import type { User } from '@/typings/interface/User'
import router from '@/router'
import { useRoute } from 'vue-router'

export const useAuthStore = defineStore('authContext', () => {
  const jwtToken = ref<string | null>(localStorage.getItem('token'))
  const User = ref<User | null>(null)

  const notif = useNotificationStore()
  const route = useRoute()

  async function loginUser(email: string, password: string) {
    try {
      const response = await login(email, password)
      if (response != null) {
        jwtToken.value = response.token
        User.value = response.record
        notif.addNotification('Prisijungimas sėkmingas!', NotificationType.success)
      }
    } catch (error: any) {
      notif.addNotification(error, NotificationType.danger)
    }
    return
  }

  function logOutUser() {
    if (jwtToken.value != null) {
      localStorage.removeItem('token')
      User.value = null
      jwtToken.value = null
      notif.addNotification('Sėkmingai atsijungta', NotificationType.success)
      if (route.path === '/changepassword') {
        return
      } else {
        router.push('/contacts')
      }
      return
    }
    notif.addNotification('Nepavyko atsijungti...', NotificationType.danger)
  }

  async function userTokenRefresh() {
    if (jwtToken.value == null) {
      return null
    }
    try {
      const response = await tokenRefresh()

      if (response != null) {
        localStorage.setItem('token', response.token)
        return response.record
      }
    } catch (error) {
      notif.addNotification(
        'Sesija baigėsi arba tinklo klaida, bandykite prisijungti iš naujo',
        NotificationType.info,
      )
      localStorage.removeItem('token')
      User.value = null
      jwtToken.value = null
      router.push('/contacts')
    }
  }

  onMounted(async () => {
    User.value = await userTokenRefresh()
  })
  return { jwtToken: readonly(jwtToken), User: readonly(User), loginUser, logOutUser }
})
