<script setup lang="ts">
import SingleContactCard from '@/components/contactComponents/SingleContactCard.vue'
import { getContact } from '@/services/contactsService'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Contact } from '@/typings/interface/Contact'
import { NotificationType } from '@/typings/interface/NotificationType'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const notifs = useNotificationStore()
const contact = ref<Contact>()

async function loadData() {
  const result = await getContact(route.params.id as string)
  if (result) {
    contact.value = result
    console.log(contact.value)
    notifs.addNotification('Kontaktas sėkmingai užkrautas!', NotificationType.success)
  } else {
    contact.value = undefined

    notifs.addNotification('Nepavyko užkrauti kontakto!', NotificationType.danger)
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div>
    <SingleContactCard :contact="contact" />
  </div>
</template>
