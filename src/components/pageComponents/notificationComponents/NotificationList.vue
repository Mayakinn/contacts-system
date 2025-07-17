<script setup lang="ts">
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/typings/interface/NotificationType'
import NotificationItem from '@/components/pageComponents/notificationComponents/NotificationItem.vue'

const notifs = useNotificationStore()
</script>

<template>
  <div
    id="notif"
    class="group fixed w-120 inset-x-8 top-0 mt-4 z-50 flex max-w-full flex-col gap-4 px-6 py-0 md:left-[unset] md:right-0 md:top-[unset] md:max-w-sm md:max-h-sm"
  >
    <!--notification-->
    <div
      v-for="notif in notifs.Notifs"
      :key="notif.id"
      class="flex flex-col h-auto min-h-10 gap-2 shadow-xl/30 rounded-lg bg-white"
    >
      <NotificationItem :Notification="notif" />
    </div>
  </div>
</template>
