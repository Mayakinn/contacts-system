<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import type { Group } from '@/typings/interface/Group'
import GroupTableRow from './GroupTableRow.vue'

const props = defineProps<{
  groups: Group[] | undefined
}>()

const emit = defineEmits(['edit-group', 'delete-group'])

function editGroupPressed(group: Group) {
  emit('edit-group', group)
}

function deleteGroupPressed(group: Group) {
  emit('delete-group', group)
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
        <tr v-for="group in props.groups" class="bg-white border-b border-gray-200 text-center">
          <GroupTableRow
            :group="group"
            @edit-group="editGroupPressed"
            @delete-group="deleteGroupPressed"
          />
        </tr>
      </tbody>
    </table>
  </div>
</template>
