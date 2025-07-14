<script setup lang="ts">
import type { Contact } from '@/typings/interface/Contact'
import ContactsTableRow from './ContactsTableRow.vue'

const props = defineProps<{
  contacts: Contact[] | undefined
}>()
</script>

<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg mr-30">
    <table class="text-sm text-left w-full table-fixed">
      <thead class="text-xl text-center bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3">Vardas ir pavardė</th>
          <th scope="col" class="px-6 py-3">Pozicija</th>
          <th scope="col" class="px-6 py-3">Telefono numeris</th>
          <th scope="col" class="px-6 py-3">Elektroninis paštas</th>
          <th scope="col" class="px-6 py-3">Adresas</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="contact in props.contacts"
          class="bg-white border-b border-gray-200 hover:bg-gray-200 text-center"
        >
          <ContactsTableRow :contact="contact" />
        </tr>
      </tbody>
    </table>
  </div>
</template>
