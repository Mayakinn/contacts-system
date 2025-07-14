<script setup lang="ts">
import type { Contact } from '@/typings/interface/Contact'
import { computed } from 'vue'

const props = defineProps<{
  contact: Contact | undefined
}>()

const name = computed(() => {
  return
})
</script>

<template>
  <th class="px-6 py-4 font-medium whitespace-nowrap">
    {{ props.contact?.name }} {{ props.contact?.surname }}
  </th>
  <td class="px-6 py-4">{{ props.contact?.position }}</td>
  <td class="px-6 py-4">{{ props.contact?.phone_number }}</td>
  <td class="px-6 py-4">{{ props.contact?.email }}</td>
  <td class="px-6 py-4">{{ props.contact?.expand?.office_id.street }}</td>
</template>
