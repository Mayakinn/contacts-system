<script setup lang="ts">
import SingleContactCard from '@/components/contactComponents/SingleContactCard.vue'
import router from '@/router'
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
  try {
    const result = await getContact(route.params.id as string)
    if (result != null) {
      contact.value = result
      notifs.addNotification('Kontaktas sėkmingai užkrautas!', NotificationType.success)
    } else {
      contact.value = undefined
      router.push('/notfound')
    }
  } catch (error: any) {
    notifs.addNotification(error, NotificationType.danger)
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
