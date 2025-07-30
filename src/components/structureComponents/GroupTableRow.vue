<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import type { Group } from '@/typings/interface/Group'

const props = defineProps<{
  group: Group | undefined
}>()

const emit = defineEmits(['edit-group', 'delete-group'])
const auth = useAuthStore()
</script>

<template>
  <th
    class="px-6 py-4 font-medium whitespace-nowrap text-ellipsis overflow-hidden"
    :title="`${props.group?.name}`"
  >
    {{ props.group?.name }}
  </th>

  <td
    class="px-6 py-4 space-x-5 text-white font-light"
    v-if="
      auth.User?.expand?.permissions_id?.edit_structure ||
      auth.User?.expand?.permissions_id?.edit_structure
    "
  >
    <button
      class="bg-button-blue rounded-3xl p-1 px-3 hover:bg-blue-500"
      v-show="auth.User?.expand?.permissions_id?.edit_structure"
      @click="emit('edit-group', props.group)"
    >
      Redaguoti
    </button>
    <button
      class="bg-red-700 rounded-3xl p-1 px-3 hover:bg-red-600"
      v-show="auth.User?.expand?.permissions_id?.delete_structure"
      @click="emit('delete-group', props.group)"
    >
      Ištrinti
    </button>
  </td>
</template>
