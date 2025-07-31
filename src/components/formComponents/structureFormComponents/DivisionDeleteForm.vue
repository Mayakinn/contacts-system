<script setup lang="ts">
import ModalCloseButton from '@/components/modalComponents/ModalCloseButton.vue'
import { deleteDivision } from '@/services/divisionService'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Division } from '@/typings/interface/Division'
import { NotificationType } from '@/typings/interface/NotificationType'
const emit = defineEmits(['close-pressed'])
const props = defineProps<{
  currentDivision: Division | null
}>()
const notif = useNotificationStore()

async function deleteSelectedCompany() {
  try {
    if (props.currentDivision != null) {
      await deleteDivision(props.currentDivision.id)
      notif.addNotification('Sėkmingai panaikintas padalinys', NotificationType.success)
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
    <h1 class="text-xl">Ar tikrai norite ištrinti padalinį?</h1>
    <h1 class="text-sm text-gray-700">Pavadinimas: {{ currentDivision?.name }}</h1>
    <div class="absolute text-blue-500 bottom-0 right-0 flex">
      <ModalCloseButton :isDeleteModal="true" @close-modal="emit('close-pressed', true)" />
      <button class="hover:bg-gray-300 rounded-xl p-2" @click="deleteSelectedCompany">Taip</button>
    </div>
  </div>
</template>
