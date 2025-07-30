<script lang="ts" setup>
import DivisionCreateForm from '@/components/formComponents/structureFormComponents/DivisionCreateForm.vue'
import Pagination from '@/components/pageComponents/Pagination.vue'
import DivisionTable from '@/components/structureComponents/DivisionTable.vue'
import { getDivisions } from '@/services/divisionService'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Division } from '@/typings/interface/Division'
import { NotificationType } from '@/typings/interface/NotificationType'
import { onMounted, ref } from 'vue'

const loading = ref<boolean>(true)
const empty = ref<boolean>(false)
const notifs = useNotificationStore()
const currentPage = ref<number>(1)
const totalPages = ref<number>(0)
const totalItems = ref<number>(0)
const divisions = ref<Division[]>([])
const emit = defineEmits(['change-create-form'])
function onPageChange(page: number) {
  currentPage.value = page
  loadData()
}

async function loadData() {
  try {
    const result = await getDivisions(currentPage.value)

    if (result != null) {
      const [data, total, pages] = result
      divisions.value = data
      totalItems.value = total
      loading.value = false
      totalPages.value = pages
      emit('change-create-form', DivisionCreateForm)

      if (currentPage.value > totalPages.value && totalPages.value > 0) {
        currentPage.value = totalPages.value
        await loadData()
        return
      }

      if (totalItems.value == undefined || totalItems.value == 0) {
        empty.value = true
        notifs.addNotification('Padalinių sąrašas tusčias!', NotificationType.danger)
        return
      } else if (totalItems.value > 0) {
        empty.value = false
        notifs.addNotification('Padaliniai sėkmingai užkrauti!', NotificationType.success)
      }
    } else {
      loading.value = false
      empty.value = true
      divisions.value = []
      totalItems.value = 0
      totalPages.value = 0

      notifs.addNotification('Nepavyko užkrauti padalinių!', NotificationType.danger)
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
  <DivisionTable :divisions="divisions" @edit-division="" @delete-division="" />
  <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="onPageChange" />
</template>
