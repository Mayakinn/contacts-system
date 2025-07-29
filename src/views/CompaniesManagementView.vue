<script lang="ts" setup>
import CompanyTableList from '@/components/companiesComponents/CompanyTableList.vue'
import CompanyCreateForm from '@/components/formComponents/companyFormComponents/CompanyCreateForm.vue'
import CompanyDeleteForm from '@/components/formComponents/companyFormComponents/CompanyDeleteForm.vue'
import CompanyEditForm from '@/components/formComponents/companyFormComponents/CompanyEditForm.vue'
import FormModal from '@/components/modalComponents/FormModal.vue'
import Pagination from '@/components/pageComponents/Pagination.vue'
import { getCompanies } from '@/services/companiesService'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Company } from '@/typings/interface/Company'
import { NotificationType } from '@/typings/interface/NotificationType'
import type { User } from '@/typings/interface/User'
import { shallowRef, ref, type Component, onMounted } from 'vue'

const currentCompany = ref<User | null>(null)
const currentForm = shallowRef<Component>()
const formModalActive = ref<boolean>(false)
const companies = ref<Company[]>()
const loading = ref<boolean>(true)
const empty = ref<boolean>(false)
const notifs = useNotificationStore()
const currentPage = ref<number>(1)
const totalPages = ref<number>(0)
const totalItems = ref<number>(0)

async function loadData() {
  try {
    const result = await getCompanies(currentPage.value)

    if (result != null) {
      const [data, total, pages] = result
      companies.value = data
      totalItems.value = total
      loading.value = false

      totalPages.value = pages
      if (totalItems.value == undefined || totalItems.value == 0) {
        empty.value = true
        notifs.addNotification('Įmonių sąrašas tusčias!', NotificationType.danger)
        return
      } else if (totalItems.value > 0) {
        empty.value = false
        notifs.addNotification('Įmonės sėkmingai užkrautos!', NotificationType.success)
      }
    } else {
      loading.value = false
      empty.value = true
      companies.value = []
      totalItems.value = 0
      totalPages.value = 0

      notifs.addNotification('Nepavyko užkrauti įmonių!', NotificationType.danger)
    }
  } catch (error: any) {
    empty.value = true
    notifs.addNotification(error, NotificationType.danger)
  }
}
const closeModal = () => {
  formModalActive.value = false
  currentForm.value = undefined
  currentCompany.value = null
}

function openCompanyCreateForm() {
  currentForm.value = CompanyCreateForm
  OpenModal()
}

function openDeleteCompanyForm(user: User) {
  currentForm.value = CompanyDeleteForm
  currentCompany.value = user
  OpenModal()
}

function openCompanyEditForm(user: User) {
  currentForm.value = CompanyEditForm
  currentCompany.value = user
  OpenModal()
}

function closeModalAfterForm(flag: boolean) {
  formModalActive.value = false
  currentCompany.value = null

  if (flag) {
    return
  } else {
    loadData()
  }
}

function OpenModal() {
  formModalActive.value = true
}

function onPageChange(page: number) {
  currentPage.value = page
  loadData()
}
const auth = useAuthStore()
onMounted(async () => {
  await loadData()
})
</script>

<template>
  <div class="m-10 space-y-10">
    <p class="text-5xl font-light">Įmonės</p>
    <div v-show="!empty">
      <div v-if="auth.User?.expand?.permissions_id?.edit_companies == true" class="flex space-x-10">
        <button
          class="w-10 h-10 bg-button-blue rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-500"
          @click="openCompanyCreateForm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="30" height="30">
            <path
              fill="white"
              d="M10.75 5.75c0-.414-.336-.75-.75-.75s-.75.336-.75.75v3.5h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5Z"
            />
          </svg>
        </button>
        <p class="flex items-center justify-center">Pridėti naują įmonę</p>
      </div>
    </div>
    <div v-if="empty" class="text-3xl ml-24 mt-10">Sąrašas tusčias</div>
    <div v-else-if="loading" class="text-3xl ml-24 mt-10">Kraunama...</div>
    <div v-else>
      <CompanyTableList
        :companies="companies"
        @edit-company="openCompanyEditForm"
        @delete-company="openDeleteCompanyForm"
      />
      <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="onPageChange" />
    </div>
  </div>
  <FormModal :isActive="formModalActive" @close-modal="closeModal">
    <component
      @close-pressed="closeModalAfterForm"
      :is="currentForm"
      :currentCompany="currentCompany"
    ></component>
  </FormModal>
</template>
