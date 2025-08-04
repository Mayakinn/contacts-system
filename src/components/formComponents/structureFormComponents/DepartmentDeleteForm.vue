<script setup lang="ts">
import ModalCloseButton from '@/components/modalComponents/ModalCloseButton.vue'
import { getContacts } from '@/services/contactsService'
import {
  deleteDepartment,
  getDepartment,
  getDepartmentRelationsWithGroup,
  getDepartments,
} from '@/services/departmentService'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Department } from '@/typings/interface/Department'
import { NotificationType } from '@/typings/interface/NotificationType'
const emit = defineEmits(['close-pressed'])
const props = defineProps<{
  currentDepartment: Department | null
}>()
const notif = useNotificationStore()

async function deleteSelectedDepartment() {
  try {
    if (props.currentDepartment != null) {
      const filterString = `department_id='${props.currentDepartment.id}'`
      const [data, items, number] = await getContacts(undefined, undefined, filterString)
      if (data.length > 0) {
        notif.addNotification(
          `Klaida: ${props.currentDepartment.name} ištrinti nepavyko. Patikrinkite ar šis skyrius neturi susijusių ryšių`,
          NotificationType.danger,
        )
        return
      }

      const IsDeleted = await getDepartment(props.currentDepartment.name)
      if (IsDeleted.length == 0) {
        notif.addNotification(
          `Klaida: ${props.currentDepartment.name} ištrinti nepavyko. Skyrius jau panaikintas!`,
          NotificationType.danger,
        )
        return
      }

      const hasRelations = await getDepartmentRelationsWithGroup(props.currentDepartment.id)
      if (hasRelations.length > 0) {
        notif.addNotification(
          `Klaida: ${props.currentDepartment.name} ištrinti nepavyko. Skyrius turi priskirtų grupių!`,
          NotificationType.danger,
        )
        return
      }

      await deleteDepartment(props.currentDepartment.id)
      notif.addNotification('Sėkmingai panaikintas skyrius', NotificationType.success)
      emit('close-pressed')
    }
  } catch (error: any) {
    if (error == 404) {
      notif.addNotification(
        `Klaida: ${props.currentDepartment?.name} ištrinti nepavyko. Neturite tam teisių!`,
        NotificationType.danger,
      )
    } else {
      notif.addNotification(`Įvyko klaidą ištrinant skyrių!`, NotificationType.danger)
      emit('close-pressed', true)
    }
  }
}
</script>

<template>
  <div class="sm:items-start m-5 pr-50">
    <h1 class="text-xl">Ar tikrai norite ištrinti skyrių?</h1>
    <h1 class="text-sm text-gray-700">Pavadinimas: {{ currentDepartment?.name }}</h1>
    <div class="absolute text-blue-500 bottom-0 right-0 flex">
      <ModalCloseButton :isDeleteModal="true" @close-modal="emit('close-pressed', true)" />
      <button class="hover:bg-gray-300 rounded-xl p-2" @click="deleteSelectedDepartment">
        Taip
      </button>
    </div>
  </div>
</template>
