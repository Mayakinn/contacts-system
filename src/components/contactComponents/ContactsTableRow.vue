<script setup lang="ts">
import type { Contact } from '@/typings/interface/Contact'

const props = defineProps<{
  Contact: Contact | undefined
}>()
</script>

<template>
  <th class="px-6 py-4 font-medium whitespace-nowrap">
    {{ props.Contact?.name }} {{ props.Contact?.surname }}
  </th>
  <td class="px-6 py-4">{{ props.Contact?.position }}</td>
  <td class="px-6 py-4">{{ props.Contact?.phone_number }}</td>
  <td class="px-6 py-4">{{ props.Contact?.email }}</td>
  <td class="px-6 py-4">{{ props.Contact?.expand?.office_id.street }}</td>
</template>
