<script setup lang="ts">
import ModalCloseButton from '@/components/modalComponents/ModalCloseButton.vue'
import { deleteContact } from '@/services/contactsService'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Contact } from '@/typings/interface/Contact'
import { NotificationType } from '@/typings/interface/NotificationType'
const emit = defineEmits(['close-pressed'])
const props = defineProps<{
  currentContact: Contact | null
}>()
const notif = useNotificationStore()

async function deleteSelectedContact() {
  try {
    if (props.currentContact != null) {
      await deleteContact(props.currentContact.id)
      notif.addNotification('Sėkmingai panaikintas kontaktas', NotificationType.success)
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
    <h1 class="text-xl">Ar tikrai norite ištrinti kontaktą?</h1>
    <h1 class="text-sm text-gray-700">Vardas ir pavardė: {{ currentContact?.name }} {{ currentContact?.surname }} </h1>
    <h1 class="text-sm text-gray-700">Pozicija: {{ currentContact?.position }}</h1>
    <div class="absolute text-blue-500 bottom-0 right-0 flex">
      <ModalCloseButton :isDeleteModal="true" @close-modal="emit('close-pressed', true)" />
      <button class="hover:bg-gray-300 rounded-xl p-2" @click="deleteSelectedContact">Taip</button>
    </div>
  </div>
</template>