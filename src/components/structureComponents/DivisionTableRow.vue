<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import type { Division } from '@/typings/interface/Division'

const props = defineProps<{
  division: Division | undefined
}>()

const emit = defineEmits(['edit-division', 'delete-division'])
const auth = useAuthStore()
</script>

<template>
  <th
    class="px-6 py-4 font-medium whitespace-nowrap text-ellipsis overflow-hidden"
    :title="`${props.division?.name}`"
  >
    {{ props.division?.name }}
  </th>

  <td
    class="px-6 py-4 space-x-5 text-white font-light"
    v-if="
      auth.User?.expand?.permissions_id?.edit_structure ||
      auth.User?.expand?.permissions_id?.delete_structure
    "
  >
    <button
      class="bg-button-blue rounded-3xl p-1 px-3 hover:bg-blue-500"
      v-show="auth.User?.expand?.permissions_id?.edit_structure"
      @click="emit('edit-division', props.division)"
    >
      Redaguoti
    </button>
    <button
      class="bg-red-700 rounded-3xl p-1 px-3 hover:bg-red-600"
      v-show="auth.User?.expand?.permissions_id?.delete_structure"
      @click="emit('delete-division', props.division)"
    >
      Ištrinti
    </button>
  </td>
</template>
