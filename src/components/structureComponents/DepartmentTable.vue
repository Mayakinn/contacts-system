<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import type { Department } from '@/typings/interface/Department'
import DepartmentTableRow from './DepartmentTableRow.vue'

const props = defineProps<{
  departments: Department[] | undefined
}>()

const emit = defineEmits(['edit-department', 'delete-department'])

function editDepartmentPressed(department: Department) {
  emit('edit-department', department)
}

function deleteDepartmentPressed(department: Department) {
  emit('delete-department', department)
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
          v-for="department in props.departments"
          class="bg-white border-b border-gray-200 text-center"
        >
          <DepartmentTableRow
            :department="department"
            @edit-department="editDepartmentPressed"
            @delete-department="deleteDepartmentPressed"
          />
        </tr>
      </tbody>
    </table>
  </div>
</template>
