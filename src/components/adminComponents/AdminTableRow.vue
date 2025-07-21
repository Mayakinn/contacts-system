<script setup lang="ts">
import type { Contact } from '@/typings/interface/Contact'
import type { User } from '@/typings/interface/User'
import { computed } from 'vue'

const props = defineProps<{
  user: User | undefined
}>()
</script>

<template>
  <th class="px-6 py-4 font-medium whitespace-nowrap">
    {{ props.user?.name }}
  </th>
  <td class="px-6 py-4">{{ props.user?.email }}</td>
  <td class="px-6 py-4"></td>
</template>
