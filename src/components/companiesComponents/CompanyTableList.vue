<script setup lang="ts">
import CompanyTableRow from './CompanyTableRow.vue'
import type { Company } from '@/typings/interface/Company'
import { useAuthStore } from '@/stores/authStore'

const props = defineProps<{
  companies: Company[] | undefined
}>()

const emit = defineEmits(['edit-company', 'delete-company'])

function editCompanyPressed(company: Company) {
  emit('edit-company', company)
}

function deleteCompanyPressed(company: Company) {
  emit('delete-company', company)
}

const auth = useAuthStore()
</script>

<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg mr-10">
    <table class="text-sm text-left w-full table-fixed">
      <thead class="text-md text-center bg-gray-50">
        <tr class="font-light">
          <th scope="col" class="px-6 py-3">Vardas</th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="
              auth.User?.expand?.permissions_id?.edit_companies ||
              auth.User?.expand?.permissions_id?.delete_companies
            "
          >
            Veiksmai
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="company in props.companies"
          class="bg-white border-b border-gray-200 text-center"
        >
          <CompanyTableRow
            :company="company"
            @edit-company="editCompanyPressed"
            @delete-company="deleteCompanyPressed"
          />
        </tr>
      </tbody>
    </table>
  </div>
</template>
