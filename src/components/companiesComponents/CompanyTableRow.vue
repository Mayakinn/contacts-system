<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import type { Company } from '@/typings/interface/Company'

const props = defineProps<{
  company: Company | undefined
}>()

const emit = defineEmits(['edit-company', 'delete-company'])
const auth = useAuthStore()
</script>

<template>
  <th
    class="px-6 py-4 font-medium whitespace-nowrap text-ellipsis overflow-hidden"
    :title="`${props.company?.name}`"
  >
    {{ props.company?.name }}
  </th>
  <td
    class="px-6 py-4 space-x-5 text-white font-light"
    v-if="
      auth.User?.expand?.permissions_id?.edit_companies ||
      auth.User?.expand?.permissions_id?.delete_companies
    "
  >
    <button
      class="bg-button-blue rounded-3xl p-1 px-3 hover:bg-blue-500"
      v-show="auth.User?.expand?.permissions_id?.edit_companies"
      @click="emit('edit-company', props.company)"
    >
      Modifikuoti
    </button>
    <button
      class="bg-red-700 rounded-3xl p-1 px-3 hover:bg-red-600"
      v-show="auth.User?.expand?.permissions_id?.delete_companies"
      @click="emit('delete-company', props.company)"
    >
      Ištrinti
    </button>
  </td>
</template>
