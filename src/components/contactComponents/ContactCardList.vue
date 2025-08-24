<script lang="ts" setup>
import type { Contact } from '@/typings/interface/Contact'
import ContactCard from './ContactCard.vue'
const props = defineProps<{
  contacts: Contact[] | undefined
}>()

const emit = defineEmits(['edit-contact', 'delete-contact'])

function deleteContactPressed(contact: Contact) {
  emit('delete-contact', contact)
}

function editContactPressed(contact: Contact) {
  emit('edit-contact', contact)
}
</script>

<template>
  <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div v-for="contact in props.contacts" key="contact.id" class="">
      <ContactCard
        :contact="contact"
        @delete-contact="deleteContactPressed"
        @edit-contact="editContactPressed"
      />
    </div>
  </div>
</template>
