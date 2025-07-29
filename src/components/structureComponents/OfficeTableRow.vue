<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import type { Office } from '@/typings/interface/Office'

const props = defineProps<{
  office: Office | undefined
}>()

const emit = defineEmits(['edit-office', 'delete-office'])
const auth = useAuthStore()
</script>

<template>
  <th
    class="px-6 py-4 font-medium whitespace-nowrap text-ellipsis overflow-hidden"
    :title="`${props.office?.name}`"
  >
    {{ props.office?.name }}
  </th>
  <th
    class="px-6 py-4 font-medium whitespace-nowrap text-ellipsis overflow-hidden"
    :title="`${props.office?.street},${props.office?.street_number},${props.office?.city},${props.office?.country}`"
  >
    {{ props.office?.name }} {{ props.office?.street_number }} {{ props.office?.city }}
    {{ props.office?.country }}
  </th>
  <td
    class="px-6 py-4 space-x-5 text-white font-light"
    v-if="
      auth.User?.expand?.permissions_id?.edit_offices ||
      auth.User?.expand?.permissions_id?.delete_offices
    "
  >
    <button
      class="bg-button-blue rounded-3xl p-1 px-3 hover:bg-blue-500"
      v-show="auth.User?.expand?.permissions_id?.edit_offices"
      @click="emit('edit-office', props.office)"
    >
      Redaguoti
    </button>
    <button
      class="bg-red-700 rounded-3xl p-1 px-3 hover:bg-red-600"
      v-show="auth.User?.expand?.permissions_id?.delete_offices"
      @click="emit('delete-office', props.office)"
    >
      Ištrinti
    </button>
  </td>
</template>
