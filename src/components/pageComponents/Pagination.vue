<script lang="ts" setup>
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/typings/interface/NotificationType'

const notifs = useNotificationStore()

function notYetImplemented() {
  notifs.addNotification('Neimplementuota', NotificationType.info)
}
</script>

<template>
  <div class="flex justify-center items-center mt-3">
    <div
      @click="() => notYetImplemented()"
      class="flex items-center w-50 h-7 bg-button-blue text-white text-right text-sm rounded-xs cursor-pointer hover:bg-blue-500 select-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 -960 960 960"
        class="mr-2"
      >
        <path
          d="M440-240 200-480l240-240 56 56-183 184 183 184zm264 0L464-480l240-240 56 56-183 184 183 184z"
          clip-rule="evenodd"
          fill-rule="evenodd"
          fill="#FFFFFF"
        />
      </svg>
      <p class="m-1 ml-13">Praeitas puslapis</p>
    </div>

    <p class="m-0.5 mx-2">1/7</p>
    <div
      @click="() => notYetImplemented()"
      class="flex items-center w-50 h-7 bg-button-blue text-white text-left text-sm rounded-xs cursor-pointer hover:bg-blue-500 select-none"
    >
      <p class="m-1 ml-2">Kitas puslapis</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 -960 960 960"
        class="ml-19"
      >
        <path
          d="M383-480 200-664l56-56 240 240-240 240-56-56zm264 0L464-664l56-56 240 240-240 240-56-56z"
          clip-rule="evenodd"
          fill-rule="evenodd"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  </div>
</template>
