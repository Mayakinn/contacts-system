<script setup lang="ts">
import type { Contact } from '@/typings/interface/Contact'
import { useRouter } from 'vue-router'

const props = defineProps<{
  Contact: Contact | undefined
}>()

const router = useRouter()
</script>

<template>
  <td
    class="px-6 py-4 font-medium whitespace-nowrap cursor-pointer"
    @click="router.push({ name: 'contact', params: { id: props.Contact?.id } })"
  >
    {{ props.Contact?.name }} {{ props.Contact?.surname }}
  </td>
  <td class="px-6 py-4">{{ props.Contact?.position }}</td>
  <td class="px-6 py-4">{{ props.Contact?.phone_number }}</td>
  <td class="px-6 py-4">{{ props.Contact?.email }}</td>
  <td class="px-6 py-4">{{ props.Contact?.expand?.office_id.street }}</td>
</template>
