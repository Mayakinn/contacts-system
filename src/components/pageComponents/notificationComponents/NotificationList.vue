<script setup lang="ts">
import { useNotificationStore } from '@/stores/notificationStore'
import NotificationItem from '@/components/pageComponents/notificationComponents/NotificationItem.vue'

const notifs = useNotificationStore()
</script>

<template>
  <div
    id="notif"
    class="group fixed w-120 inset-x-8 top-0 mt-4 z-50 flex max-w-full flex-col gap-4 px-6 py-0 md:left-[unset] md:right-0 md:top-[unset] md:max-w-sm md:max-h-sm"
  >
    <transition-group name="notification-fade">
      <NotificationItem
        v-for="notif in notifs.Notifs"
        :key="notif.id"
        :Notification="notif"
      />
    </transition-group>
  </div>
</template>

<style scoped>
.notification-fade-enter-from,
.notification-fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.notification-fade-enter-active,
.notification-fade-leave-active {
  transition: all 0.3s ease;
}

.notification-fade-enter-to,
.notification-fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
