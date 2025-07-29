<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import type { Office } from '@/typings/interface/Office'
import OfficeTableRow from './OfficeTableRow.vue'

const props = defineProps<{
  offices: Office[] | undefined
}>()

const emit = defineEmits(['edit-office', 'delete-office'])

function editOfficePressed(office: Office) {
  emit('edit-office', office)
}

function deleteOfficePressed(office: Office) {
  emit('delete-office', office)
}

const auth = useAuthStore()
</script>

<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg mr-10">
    <table class="text-sm text-left w-full table-fixed">
      <thead class="text-md text-center bg-gray-50">
        <tr class="font-light">
          <th scope="col" class="px-6 py-3">Pavadinimas</th>
          <th scope="col" class="px-6 py-3">Adresas</th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="
              auth.User?.expand?.permissions_id?.edit_offices ||
              auth.User?.expand?.permissions_id?.delete_offices
            "
          >
            Veiksmai
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="office in props.offices" class="bg-white border-b border-gray-200 text-center">
          <OfficeTableRow
            :office="office"
            @edit-office="editOfficePressed"
            @delete-office="deleteOfficePressed"
          />
        </tr>
      </tbody>
    </table>
  </div>
</template>
