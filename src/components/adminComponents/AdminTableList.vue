<script setup lang="ts">
import type { Contact } from '@/typings/interface/Contact'
import AdminTableRow from './AdminTableRow.vue'
import { useRoute, useRouter } from 'vue-router'
import type { User } from '@/typings/interface/User'

const props = defineProps<{
  users: User[] | undefined
}>()
const router = useRouter()
</script>

<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg mr-30">
    <table class="text-sm text-left w-full">
      <thead class="text-xl text-center bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3">Vardas</th>
          <th scope="col" class="px-6 py-3">El. paštas</th>
          <th scope="col" class="px-6 py-3">Veiksmas</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in props.users"
          class="bg-white border-b border-gray-200 hover:bg-gray-200 text-center"
        >
          <AdminTableRow :user="user" />
        </tr>
      </tbody>
    </table>
  </div>
</template>
