<script setup lang="ts">
import router from '@/router'
import { useAuthStore } from '@/stores/authStore'
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
const auth = useAuthStore()

const emit = defineEmits(['edit-contact', 'delete-contact'])
</script>

<template>
  <th class="px-6 py-4 font-medium whitespace-nowrap text-ellipsis overflow-hidden cursor-pointer"
    :title="`${props.contact?.name} ${props.contact?.surname}`"
    @click="router.push({ name: 'contact', params: { id: props.contact?.id } })">
    {{ props.contact?.name }} {{ props.contact?.surname }}
  </th>
  <td class="px-6 py-4">{{ props.contact?.position }}</td>
  <td class="px-6 py-4">{{ phone_number }}</td>
  <td class="px-6 py-4">{{ email }}</td>
  <td class="px-6 py-4">{{ props.contact?.expand?.office_id.street }}</td>
  <td v-if="
    auth.User?.expand?.permissions_id?.delete_employees ||
    auth.User?.expand?.permissions_id?.delete_employees
  " class="space-x-5">
    <button v-show="auth.User?.expand?.permissions_id?.edit_employees" @click="emit('edit-contact', props.contact)"
      class="bg-button-blue rounded-3xl p-1 px-3 hover:bg-blue-500 text-white">
      Modifikuoti
    </button>
    <button v-show="auth.User?.expand?.permissions_id?.delete_employees" @click="emit('delete-contact', props.contact)"
      class="bg-red-700 rounded-3xl p-1 px-3 hover:bg-red-600 text-white">
      Ištrinti
    </button>
  </td>
</template>