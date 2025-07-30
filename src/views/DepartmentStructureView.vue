<script lang="ts" setup>
import DepartmentCreateForm from '@/components/formComponents/structureFormComponents/DepartmentCreateForm.vue'
import Pagination from '@/components/pageComponents/Pagination.vue'
import DepartmentTable from '@/components/structureComponents/DepartmentTable.vue'
import { getDepartments } from '@/services/departmentService'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Department } from '@/typings/interface/Department'
import { NotificationType } from '@/typings/interface/NotificationType'
import { onMounted, ref } from 'vue'

const loading = ref<boolean>(true)
const empty = ref<boolean>(false)
const notifs = useNotificationStore()
const currentPage = ref<number>(1)
const totalPages = ref<number>(0)
const totalItems = ref<number>(0)
const departments = ref<Department[]>([])
const emit = defineEmits(['change-create-form'])
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

onMounted(() => {
  loadData()
})
</script>

<template>
  <DepartmentTable :departments="departments" @edit-department="" @delete-department="" />
  <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="onPageChange" />
</template>
