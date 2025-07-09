<script lang="ts" setup>
import { getContacts } from '@/services/contactsService'
import type { Contact } from '@/typings/interface/Contact'
import { onMounted, ref } from 'vue'
import ContactCard from './ContactCard.vue'
const props = defineProps<{
  Contacts: Contact[] | undefined
}>()
</script>

<template>
  <div v-for="contact in props.Contacts" key="contact.id" class="">
    <ContactCard :contact="contact" />
  </div>
</template>
