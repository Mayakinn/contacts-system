<script setup lang="ts">
import ModalCloseButton from '@/components/modalComponents/ModalCloseButton.vue'
import { deleteAdmin } from '@/services/adminService'
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/typings/interface/NotificationType'
import type { User } from '@/typings/interface/User'
const emit = defineEmits(['close-pressed'])
const props = defineProps<{
  currentAdmin: User | null
}>()
const notif = useNotificationStore()

async function deleteSelectedAdmin() {
  if (props.currentAdmin?.username == 'admin') {
    notif.addNotification('Negalima panaikinti šios paskyros!', NotificationType.danger)
    emit('close-pressed', true)
    return
  }

  try {
    if (props.currentAdmin != null) {
      await deleteAdmin(props.currentAdmin)
      notif.addNotification('Sėkmingai panaikinta paskyra', NotificationType.success)
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
    <h1 class="text-xl">Ar tikrai norite ištrinti paskyrą?</h1>
    <h1 class="text-sm text-gray-700">Paskyros vardas: {{ currentAdmin?.name }}</h1>
    <div class="absolute text-blue-500 bottom-0 right-0 flex">
      <ModalCloseButton :isDeleteModal="true" @close-modal="emit('close-pressed')" />
      <button class="hover:bg-gray-300 rounded-xl p-2" @click="deleteSelectedAdmin">Taip</button>
    </div>
  </div>
</template>
