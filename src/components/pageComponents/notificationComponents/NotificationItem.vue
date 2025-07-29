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
  <div
    class="flex items-start justify-between border-l-15 rounded-lg p-4 w-full bg-white shadow-xl"
    :class="notifType"
  >
    <div class="flex-1 mr-4">
      {{ props.Notification.message }}
    </div>
    <img
      class="h-6 w-6 cursor-pointer shrink-0"
      src="../../../assets/close-button.svg"
      @click="notif.deleteNotification(props.Notification.id)"
    />
  </div>
</template>




