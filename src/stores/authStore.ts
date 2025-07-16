import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { login } from '@/auth/authContext'

import { NotificationType } from '@/typings/interface/NotificationType'
import { useNotificationStore } from './notificationStore'

export const useAuthStore = defineStore('authContext', () => {
  const jwtToken = ref<string | null>(localStorage.getItem('token'))
  const username = ref<string | null>(localStorage.getItem('name'))
  const notif = useNotificationStore()
  async function loginUser(email: string, password: string) {
    const response = await login(email, password)
    if (response != null) {
      jwtToken.value = response.token
      username.value = response.record.name
    }
    return
  }

  function logOutUser() {
    if (jwtToken.value != null) {
      localStorage.removeItem('token')
      localStorage.removeItem('name')

      jwtToken.value = null
      username.value = null
      notif.addNotification('Admin logged out succesfully', NotificationType.success)
      return
    }
    notif.addNotification('Failed to logout', NotificationType.danger)
  }

  return { jwtToken, username, loginUser, logOutUser }
})
