<script lang="ts" setup>
import AdminTableList from '@/components/adminComponents/AdminTableList.vue'
import AdminCreateForm from '@/components/formComponents/adminFormComponents/AdminCreateForm.vue'
import AdminDeleteForm from '@/components/formComponents/adminFormComponents/AdminDeleteForm.vue'
import AdminEditDetailsForm from '@/components/formComponents/adminFormComponents/AdminEditDetailsForm.vue'
import AdminEditPermissionsForm from '@/components/formComponents/adminFormComponents/AdminEditPermissionsForm.vue'
import FormModal from '@/components/modalComponents/FormModal.vue'
import Pagination from '@/components/pageComponents/Pagination.vue'
import { getAdmins } from '@/services/adminService'
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/typings/interface/NotificationType'
import type { User } from '@/typings/interface/User'
import { shallowRef, ref, type Component, onMounted } from 'vue'
const currentAdmin = ref<User | null>(null)

const currentForm = shallowRef<Component>()
const formModalActive = ref<boolean>(false)
const users = ref<User[]>()
const loading = ref<boolean>(true)
const empty = ref<boolean>(false)
const notifs = useNotificationStore()
const currentPage = ref<number>(1)
const totalPages = ref<number>(0)
const totalItems = ref<number>(0)

async function loadData() {
  try {
    const result = await getAdmins(currentPage.value)

    if (result != null) {
      const [data, total, pages] = result
      users.value = data
      totalItems.value = total
      loading.value = false

      totalPages.value = pages
      if (totalItems.value == undefined || totalItems.value == 0) {
        empty.value = true
        notifs.addNotification('Adminų sąrašas tusčias!', NotificationType.danger)
        return
      } else if (totalItems.value > 0) {
        empty.value = false
        notifs.addNotification('Adminai sėkmingai užkrauti!', NotificationType.success)
      }
    } else {
      loading.value = false
      empty.value = true
      users.value = []
      totalItems.value = 0
      totalPages.value = 0

      notifs.addNotification('Nepavyko užkrauti adminų!', NotificationType.danger)
    }
  } catch (error: any) {
    empty.value = true
    notifs.addNotification(error, NotificationType.danger)
  }
}
const closeModal = () => {
  formModalActive.value = false
  currentForm.value = undefined
  currentAdmin.value = null
}

function openAdminCreateForm() {
  currentForm.value = AdminCreateForm
  OpenModal()
}

function openAdminEditPermissionsForm(user: User) {
  currentForm.value = AdminEditPermissionsForm
  currentAdmin.value = user
  OpenModal()
}

function openDeleteAdminForm(user: User) {
  currentForm.value = AdminDeleteForm
  currentAdmin.value = user
  OpenModal()
}

function openAdminEditForm(user: User) {
  currentForm.value = AdminEditDetailsForm
  currentAdmin.value = user
  OpenModal()
}

function closeModalAfterForm(flag: boolean) {
  formModalActive.value = false
  currentAdmin.value = null

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
onMounted(async () => {
  await loadData()
})
</script>

<template>
  <div class="m-10 space-y-10">
    <p class="text-5xl font-light">Admin paskyros</p>
    <div class="flex space-x-10" v-show="!empty">
      <button
        class="w-10 h-10 bg-button-blue rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-500"
        @click="openAdminCreateForm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="30" height="30">
          <path
            fill="white"
            d="M10.75 5.75c0-.414-.336-.75-.75-.75s-.75.336-.75.75v3.5h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5Z"
          />
        </svg>
      </button>
      <p class="flex items-center justify-center">Sukurti naują admin paskyrą</p>
    </div>
    <div v-if="empty" class="text-3xl ml-24 mt-10">Sąrašas tusčias</div>
    <div v-else-if="loading" class="text-3xl ml-24 mt-10">Kraunama...</div>
    <div v-else>
      <AdminTableList
        :users="users"
        @edit-permissions="openAdminEditPermissionsForm"
        @edit-admin="openAdminEditForm"
        @delete-admin="openDeleteAdminForm"
      />
      <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="onPageChange" />
    </div>
  </div>
  <FormModal :isActive="formModalActive" @close-modal="closeModal">
    <component
      @close-pressed="closeModalAfterForm"
      :is="currentForm"
      :currentAdmin="currentAdmin"
    ></component>
  </FormModal>
</template>
