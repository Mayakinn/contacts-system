<script setup lang="ts">
import ModalCloseButton from '@/components/modalComponents/ModalCloseButton.vue'
import {
  deleteDivision,
  getDivision,
  getDivisionRelationsWithDepartment,
} from '@/services/divisionService'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Division } from '@/typings/interface/Division'
import { NotificationType } from '@/typings/interface/NotificationType'
const emit = defineEmits(['close-pressed'])
const props = defineProps<{
  currentDivision: Division | null
}>()
const notif = useNotificationStore()

async function deleteSelectedDivision() {
  try {
    if (props.currentDivision != null) {
      const result = await getDivision(props.currentDivision.name)
      if (result.length == 0) {
        notif.addNotification(
          `Klaida: ${props.currentDivision.name} ištrinti nepavyko. Padalinys jau panaikintas!`,
          NotificationType.danger,
        )
        return
      }

      const hasRelations = await getDivisionRelationsWithDepartment(props.currentDivision.id)
      if (hasRelations.length > 0) {
        notif.addNotification(
          `Klaida: ${props.currentDivision.name} ištrinti nepavyko. Padalinys turi priskirtų skyrių!`,
          NotificationType.danger,
        )
        return
      }

      await deleteDivision(props.currentDivision.id)
      notif.addNotification('Sėkmingai panaikintas padalinys', NotificationType.success)
      emit('close-pressed')
    }
  } catch (error: any) {
    if (error == 400) {
      notif.addNotification(
        `Klaida: ${props.currentDivision?.name} ištrinti nepavyko. Patikrinkite ar šis padalinys neturi susijusių ryšių`,
        NotificationType.danger,
      )
    } else if (error == 404) {
      notif.addNotification(
        `Klaida: ${props.currentDivision?.name} ištrinti nepavyko. Neturite tam teisių!`,
        NotificationType.danger,
      )
    } else {
      notif.addNotification(`Įvyko klaidą ištrinant padalinį`, NotificationType.danger)
      emit('close-pressed', true)
    }
  }
}
</script>

<template>
  <div class="sm:items-start m-5 pr-50">
    <h1 class="text-xl">Ar tikrai norite ištrinti padalinį?</h1>
    <h1 class="text-sm text-gray-700">Pavadinimas: {{ currentDivision?.name }}</h1>
    <div class="absolute text-blue-500 bottom-0 right-0 flex">
      <ModalCloseButton :isDeleteModal="true" @close-modal="emit('close-pressed', true)" />
      <button class="hover:bg-gray-300 rounded-xl p-2" @click="deleteSelectedDivision">Taip</button>
    </div>
  </div>
</template>
