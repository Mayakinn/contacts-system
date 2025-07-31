<script setup lang="ts">
import ModalCloseButton from '@/components/modalComponents/ModalCloseButton.vue'
import { deleteOffice } from '@/services/officeService'
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/typings/interface/NotificationType'
import type { Office } from '@/typings/interface/Office'
const emit = defineEmits(['close-pressed'])
const props = defineProps<{
  currentOffice: Office | null
}>()
const notif = useNotificationStore()

async function deleteSelectedCompany() {
  try {
    if (props.currentOffice != null) {
      await deleteOffice(props.currentOffice.id)
      notif.addNotification('Sėkmingai panaikintas ofisas', NotificationType.success)
      emit('close-pressed')
    }
  } catch (error: any) {
    notif.addNotification(error.message, NotificationType.danger)
    emit('close-pressed', true)
  }
}
</script>

<template>
  <div class="sm:items-start m-5 pr-50">
    <h1 class="text-xl">Ar tikrai norite ištrinti ofisą?</h1>
    <h1 class="text-sm text-gray-700">Pavadinimas: {{ currentOffice?.name }}</h1>
    <div class="absolute text-blue-500 bottom-0 right-0 flex">
      <ModalCloseButton :isDeleteModal="true" @close-modal="emit('close-pressed', true)" />
      <button class="hover:bg-gray-300 rounded-xl p-2" @click="deleteSelectedCompany">Taip</button>
    </div>
  </div>
</template>
