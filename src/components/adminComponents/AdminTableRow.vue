<script setup lang="ts">
import type { User } from '@/typings/interface/User'

const props = defineProps<{
  user: User | undefined
}>()
</script>

<template>
  <th class="px-6 py-4 font-medium whitespace-nowrap">
    {{ props.user?.name }}
  </th>
  <td class="px-6 py-4">{{ props.user?.email }}</td>
  <td class="px-6 py-4 space-x-5 text-white font-medium">
    <button class="bg-button-blue rounded-3xl p-1 px-3 hover:bg-blue-500">Keisti leidimus</button>
    <button class="bg-button-blue rounded-3xl p-1 px-3 hover:bg-blue-500">Modifikuoti</button>
    <button class="bg-red-700 rounded-3xl p-1 px-3 hover:bg-red-600">Ištrinti</button>
  </td>
</template>
