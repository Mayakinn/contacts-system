<script lang="ts" setup>
import DepartmentCreateForm from '@/components/formComponents/structureFormComponents/DepartmentCreateForm.vue'
import DepartmentDeleteForm from '@/components/formComponents/structureFormComponents/DepartmentDeleteForm.vue'
import DepartmentEditForm from '@/components/formComponents/structureFormComponents/DepartmentEditForm.vue'
import FormModal from '@/components/modalComponents/FormModal.vue'
import Pagination from '@/components/pageComponents/Pagination.vue'
import StructureTable from '@/components/structureComponents/StructureTable.vue'
import { getDepartments } from '@/services/departmentService'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Department } from '@/typings/interface/Department'
import { NotificationType } from '@/typings/interface/NotificationType'
import { computed, onMounted, ref, shallowRef, type Component } from 'vue'

const loading = ref<boolean>(true)
const empty = ref<boolean>(false)
const notifs = useNotificationStore()
const currentPage = ref<number>(1)
const totalPages = ref<number>(0)
const totalItems = ref<number>(0)
const departments = ref<Department[]>([])
const emit = defineEmits(['change-create-form'])

const currentDepartment = ref<Department | undefined>(undefined)
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

const mappedDepartments = computed(() =>
  departments.value.map((department) => ({
    id: department.id,
    name: department.name || 'Nežinomas Skyrius',
  })),
)
const fields = [{ key: 'name', label: 'Pavadinimas' }]

function OpenModal() {
  formModalActive.value = true
}

function openDeleteDepartmentForm(departmentId: string) {
  currentForm.value = DepartmentDeleteForm
  currentDepartment.value = departments.value.find((department) => department.id === departmentId)
  OpenModal()
}

function openDepartmentEditForm(departmentId: string) {
  currentForm.value = DepartmentEditForm
  currentDepartment.value = departments.value.find((department) => department.id === departmentId)
  OpenModal()
}

const closeModal = () => {
  formModalActive.value = false
  currentForm.value = undefined
  currentDepartment.value = undefined
}
function closeModalAfterForm(flag: boolean) {
  formModalActive.value = false
  currentDepartment.value = undefined
  if (flag) {
    return
  } else {
    loadData()
  }
}

const auth = useAuthStore()
const canUserDelete = computed(() => {
  return auth.User?.expand?.permissions_id?.delete_structure
})
const canUserEdit = computed(() => {
  return auth.User?.expand?.permissions_id?.edit_structure
})

onMounted(() => {
  loadData()
})
</script>

<template>
  <div v-if="empty" class="text-3xl ml-24 mt-10">Sąrašas tusčias</div>
  <div v-else-if="loading" class="text-3xl ml-24 mt-10">Kraunama...</div>
  <div v-else>
    <StructureTable
      :data="mappedDepartments"
      :fields="fields"
      :canUserDelete="canUserDelete"
      :canUserEdit="canUserEdit"
      @edit="openDepartmentEditForm"
      @delete="openDeleteDepartmentForm"
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
