<script setup lang="ts">
import type { User } from '@/typings/interface/User'

const props = defineProps<{
  user: User | undefined
}>()

const emit = defineEmits(['edit-permissions', 'edit-admin', 'delete-admin'])
</script>

<template>
  <th
    class="px-6 py-4 font-medium whitespace-nowrap text-ellipsis overflow-hidden"
    :title="`${props.user?.name}`"
  >
    {{ props.user?.name }}
  </th>
  <td class="px-6 py-4 whitespace-nowrap text-ellipsis overflow-hidden" :title="`${props.user?.email}`">{{ props.user?.email }}</td>
  <td class="px-6 py-4 space-x-5 text-white font-light">
    <button
      class="bg-button-blue rounded-3xl p-1 px-3 hover:bg-blue-500"
      @click="emit('edit-permissions', props.user)"
    >
      Keisti leidimus
    </button>
    <button
      class="bg-button-blue rounded-3xl p-1 px-3 hover:bg-blue-500"
      @click="emit('edit-admin', props.user)"
    >
      Modifikuoti
    </button>
    <button class="bg-red-700 rounded-3xl p-1 px-3 hover:bg-red-600" @click="emit('delete-admin',props.user)">Ištrinti</button>
  </td>
</template>
