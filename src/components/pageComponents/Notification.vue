<script setup lang="ts">
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/typings/interface/NotificationType'

const notifs = useNotificationStore()
</script>

<template>
  <!--column of the notifications-->
  <div
    id="notif"
    class="group w-120 min-h-80 fixed inset-x-8 top-0 z-50 flex max-w-full flex-col gap-4 bg-white px-6 py-0 md:left-[unset] md:right-0 md:top-[unset] md:max-w-sm md:max-h-sm"
  >
    <!--notification-->
    <div
      v-for="notif in notifs.Notifs"
      :key="notif.id"
      @click="notifs.deleteNotification(notif.id)"
      class="flex flex-col h-auto min-h-10 gap-2 shadow-xl/30 rounded-lg bg-white"
    >
      <!--message-->
      <div
        v-if="notif.status == NotificationType.success"
        class="text-green-600 p-4 flex items-center justify-between border-l-15 rounded-lg border-green-500"
      >
        {{ notif.message }}
      </div>

      <div
        v-else-if="notif.status == NotificationType.info"
        class="text-blue-500 p-4 flex items-center justify-between border-l-15 rounded-lg border-blue-500"
      >
        {{ notif.message }}
      </div>

      <div
        v-else-if="notif.status == NotificationType.danger"
        class="text-red-500 p-4 flex items-center justify-between border-l-15 rounded-lg border-red-500"
      >
        {{ notif.message }}
      </div>

      <div
        v-else
        class="text-orange-500 p-4 flex items-center justify-between border-l-15 rounded-lg border-orange-500"
      >
        {{ notif.message }}
      </div>
    </div>
  </div>
</template>
