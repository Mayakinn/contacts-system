<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import type { Division } from '@/typings/interface/Division'
import DivisionTableRow from './DivisionTableRow.vue'

const props = defineProps<{
  divisions: Division[] | undefined
}>()

const emit = defineEmits(['edit-division', 'delete-division'])

function editDivisionPressed(division: Division) {
  emit('edit-division', division)
}

function deleteDivisionPressed(division: Division) {
  emit('delete-division', division)
}

const auth = useAuthStore()
</script>

<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg mr-10">
    <table class="text-sm text-left w-full table-fixed">
      <thead class="text-md text-center bg-gray-50">
        <tr class="font-light">
          <th scope="col" class="px-6 py-3">Pavadinimas</th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="
              auth.User?.expand?.permissions_id?.edit_structure ||
              auth.User?.expand?.permissions_id?.delete_structure
            "
          >
            Veiksmai
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="division in props.divisions"
          class="bg-white border-b border-gray-200 text-center"
        >
          <DivisionTableRow
            :division="division"
            @edit-division="editDivisionPressed"
            @delete-division="deleteDivisionPressed"
          />
        </tr>
      </tbody>
    </table>
  </div>
</template>
