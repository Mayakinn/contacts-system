<script lang="ts" setup>
import DepartmentCreateForm from '@/components/formComponents/structureFormComponents/DepartmentCreateForm.vue'
import DepartmentDeleteForm from '@/components/formComponents/structureFormComponents/DepartmentDeleteForm.vue'
import DepartmentEditForm from '@/components/formComponents/structureFormComponents/DepartmentEditForm.vue'
import FormModal from '@/components/modalComponents/FormModal.vue'
import Pagination from '@/components/pageComponents/Pagination.vue'
import DepartmentTable from '@/components/structureComponents/DepartmentTable.vue'
import { getDepartments } from '@/services/departmentService'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Department } from '@/typings/interface/Department'
import { NotificationType } from '@/typings/interface/NotificationType'
import { onMounted, ref, shallowRef, type Component } from 'vue'

const loading = ref<boolean>(true)
const empty = ref<boolean>(false)
const notifs = useNotificationStore()
const currentPage = ref<number>(1)
const totalPages = ref<number>(0)
const totalItems = ref<number>(0)
const departments = ref<Department[]>([])
const emit = defineEmits(['change-create-form'])

const currentDepartment = ref<Department | null>(null)
const currentForm = shallowRef<Component>()
const formModalActive = ref<boolean>(false)

function onPageChange(page: number) {
  currentPage.value = page
  loadData()
}

async function loadData() {
  try {
    const result = await getDepartments(currentPage.value)

    if (result != null) {
      const [data, total, pages] = result
      departments.value = data
      totalItems.value = total
      loading.value = false
      totalPages.value = pages
      emit('change-create-form', DepartmentCreateForm)

      if (currentPage.value > totalPages.value && totalPages.value > 0) {
        currentPage.value = totalPages.value
        await loadData()
        return
      }

      if (totalItems.value == undefined || totalItems.value == 0) {
        empty.value = true
        notifs.addNotification('Skyrių sąrašas tusčias!', NotificationType.danger)
        return
      } else if (totalItems.value > 0) {
        empty.value = false
        notifs.addNotification('Skyriai sėkmingai užkrauti!', NotificationType.success)
      }
    } else {
      loading.value = false
      empty.value = true
      departments.value = []
      totalItems.value = 0
      totalPages.value = 0

      notifs.addNotification('Nepavyko užkrauti skyrių!', NotificationType.danger)
    }
  } catch (error: any) {
    empty.value = true
    notifs.addNotification(error, NotificationType.danger)
  }
}

function OpenModal() {
  formModalActive.value = true
}

function openDeleteDepartmentForm(department: Department) {
  currentForm.value = DepartmentDeleteForm
  currentDepartment.value = department
  OpenModal()
}

function openDepartmentEditForm(department: Department) {
  currentForm.value = DepartmentEditForm
  currentDepartment.value = department
  OpenModal()
}

const closeModal = () => {
  formModalActive.value = false
  currentForm.value = undefined
  currentDepartment.value = null
}
function closeModalAfterForm(flag: boolean) {
  formModalActive.value = false
  currentDepartment.value = null
  if (flag) {
    return
  } else {
    loadData()
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div v-if="empty" class="text-3xl ml-24 mt-10">Sąrašas tusčias</div>
  <div v-else-if="loading" class="text-3xl ml-24 mt-10">Kraunama...</div>
  <div v-else>
    <DepartmentTable
      :departments="departments"
      @edit-department="openDepartmentEditForm"
      @delete-department="openDeleteDepartmentForm"
    />
    <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="onPageChange" />
  </div>

  <FormModal :isActive="formModalActive" @close-modal="closeModal">
    <component
      @close-pressed="closeModalAfterForm"
      :is="currentForm"
      :currentDepartment="currentDepartment"
      :key="currentForm"
    ></component>
  </FormModal>
</template>
