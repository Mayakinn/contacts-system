<script setup lang="ts">
import type { Contact } from '@/typings/interface/Contact'
import { computed } from 'vue'

const props = defineProps<{
  contact: Contact | undefined
}>()

const phone_number = computed(() => {
  return props.contact?.phone_number ? props.contact?.phone_number : '-'
})

const email = computed(() => {
  return props.contact?.email ? props.contact?.email : '-'
})
</script>
<template>
  <th
    class="px-6 py-4 font-medium whitespace-nowrap text-ellipsis overflow-hidden"
    :title="`${props.contact?.name} ${props.contact?.surname}`"
  >
    {{ props.contact?.name }} {{ props.contact?.surname }}
  </th>
  <td class="px-6 py-4" :title="props.contact?.position">
    {{ props.contact?.position }}
  </td>
  <td class="px-6 py-4" :title="phone_number">
    {{ phone_number }}
  </td>
  <td class="px-6 py-4" :title="email">
    {{ email }}
  </td>
  <td class="px-6 py-4" :title="props.contact?.expand?.office_id.street">
    {{ props.contact?.expand?.office_id.street }}
  </td>
</template>
