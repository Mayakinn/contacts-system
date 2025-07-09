<script lang="ts" setup>
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/typings/interface/NotificationType'
import { computed } from 'vue'

const props = defineProps<{
  Notification: { message: string; status: NotificationType; id: string }
}>()
const notif = useNotificationStore()
const notifType = computed(() => {
  if (props.Notification.status == NotificationType.success) {
    return 'text-green-600 border-green-500'
  } else if (props.Notification.status == NotificationType.danger) {
    return 'text-red-600 border-red-500'
  } else if (props.Notification.status == NotificationType.warning) {
    return 'text-orange-600 border-orange-500'
  } else {
    return 'text-blue-600 border-blue-500'
  }
})
</script>

<template>
  <div class="p-4 flex items-center justify-between border-l-15 rounded-lg" :class="notifType">
    {{ props.Notification.message }}
    <img
      class="h-6 w-6 cursor-pointer"
      src="../../../../close-button.svg"
      @click="notif.deleteNotification(props.Notification.id)"
    />
  </div>
</template>
