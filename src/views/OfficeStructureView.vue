<script lang="ts" setup>
import OfficeTable from '@/components/structureComponents/OfficeTable.vue'
import { getOffices } from '@/services/officeService'
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/typings/interface/NotificationType'
import type { Office } from '@/typings/interface/Office'
import { onMounted, ref } from 'vue'

const loading = ref<boolean>(true)
const empty = ref<boolean>(false)
const notifs = useNotificationStore()
const currentPage = ref<number>(1)
const totalPages = ref<number>(0)
const totalItems = ref<number>(0)
const offices = ref<Office[]>([])

async function loadData() {
  try {
    const result = await getOffices(currentPage.value)

    if (result != null) {
      const [data, total, pages] = result
      offices.value = data
      totalItems.value = total
      loading.value = false
      totalPages.value = pages
      if (currentPage.value > totalPages.value && totalPages.value > 0) {
        currentPage.value = totalPages.value
        await loadData()
        return
      }

      if (totalItems.value == undefined || totalItems.value == 0) {
        empty.value = true
        notifs.addNotification('Ofisų sąrašas tusčias!', NotificationType.danger)
        return
      } else if (totalItems.value > 0) {
        empty.value = false
        notifs.addNotification('Ofisai sėkmingai užkrauti!', NotificationType.success)
      }
    } else {
      loading.value = false
      empty.value = true
      offices.value = []
      totalItems.value = 0
      totalPages.value = 0

      notifs.addNotification('Nepavyko užkrauti ofisų!', NotificationType.danger)
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
  <OfficeTable :offices="offices" @edit-office="" @delete-office="" />
</template>
