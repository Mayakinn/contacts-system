<script setup lang="ts">
import ModalCloseButton from '@/components/modalComponents/ModalCloseButton.vue'
import {
  deleteCompany,
  getCompany,
  getCompanyRelationsWithOffice,
} from '@/services/companiesService'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Company } from '@/typings/interface/Company'
import { NotificationType } from '@/typings/interface/NotificationType'
const emit = defineEmits(['close-pressed'])
const props = defineProps<{
  currentCompany: Company | null
}>()
const notif = useNotificationStore()

async function deleteSelectedCompany() {
  try {
    if (props.currentCompany != null) {
      const result = await getCompany(props.currentCompany.name)
      if (result.length == 0) {
        notif.addNotification(
          `Klaida: ${props.currentCompany.name} ištrinti nepavyko. Įmonė jau panaikinta!`,
          NotificationType.danger,
        )
        return
      }

      const hasRelations = await getCompanyRelationsWithOffice(props.currentCompany.id)
      if (hasRelations.length > 0) {
        notif.addNotification(
          `Klaida: ${props.currentCompany.name} ištrinti nepavyko. Įmonė turi priskirtų ofisų!`,
          NotificationType.danger,
        )
        return
      }

      await deleteCompany(props.currentCompany.id)
      notif.addNotification('Sėkmingai panaikinta įmonė', NotificationType.success)
      emit('close-pressed')
    }
  } catch (error: any) {
    if (error == 400) {
      notif.addNotification(
        `Klaida: ${props.currentCompany?.name} ištrinti nepavyko. Patikrinkite ar ši įmonė neturi susijusių ryšių`,
        NotificationType.danger,
      )
    } else if (error == 404) {
      notif.addNotification(
        `Klaida: ${props.currentCompany?.name} ištrinti nepavyko. Neturite tam teisių!`,
        NotificationType.danger,
      )
    } else {
      notif.addNotification(error, NotificationType.danger)
      emit('close-pressed', true)
    }
  }
}
</script>

<template>
  <div class="sm:items-start m-5 pr-50">
    <h1 class="text-xl">Ar tikrai norite ištrinti įmonę?</h1>
    <h1 class="text-sm text-gray-700">Pavadinimas: {{ currentCompany?.name }}</h1>
    <div class="absolute text-blue-500 bottom-0 right-0 flex">
      <ModalCloseButton :isDeleteModal="true" @close-modal="emit('close-pressed', true)" />
      <button class="hover:bg-gray-300 rounded-xl p-2" @click="deleteSelectedCompany">Taip</button>
    </div>
  </div>
</template>
