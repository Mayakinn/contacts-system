<script lang="ts" setup>
import GroupCreateForm from '@/components/formComponents/structureFormComponents/GroupCreateForm.vue'
import Pagination from '@/components/pageComponents/Pagination.vue'
import GroupTable from '@/components/structureComponents/GroupTable.vue'
import { getGroups } from '@/services/groupService'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Group } from '@/typings/interface/Group'
import { NotificationType } from '@/typings/interface/NotificationType'
import { onMounted, ref } from 'vue'

const loading = ref<boolean>(true)
const empty = ref<boolean>(false)
const notifs = useNotificationStore()
const currentPage = ref<number>(1)
const totalPages = ref<number>(0)
const totalItems = ref<number>(0)
const groups = ref<Group[]>([])
const emit = defineEmits(['change-create-form'])
function onPageChange(page: number) {
  currentPage.value = page
  loadData()
}
async function loadData() {
  try {
    const result = await getGroups(currentPage.value)

    if (result != null) {
      const [data, total, pages] = result
      groups.value = data
      totalItems.value = total
      loading.value = false
      totalPages.value = pages
      emit('change-create-form', GroupCreateForm)

      if (currentPage.value > totalPages.value && totalPages.value > 0) {
        currentPage.value = totalPages.value
        await loadData()
        return
      }

      if (totalItems.value == undefined || totalItems.value == 0) {
        empty.value = true
        notifs.addNotification('Grupių sąrašas tusčias!', NotificationType.danger)
        return
      } else if (totalItems.value > 0) {
        empty.value = false
        notifs.addNotification('Grupės sėkmingai užkrautos!', NotificationType.success)
      }
    } else {
      loading.value = false
      empty.value = true
      groups.value = []
      totalItems.value = 0
      totalPages.value = 0

      notifs.addNotification('Nepavyko užkrauti grupių!', NotificationType.danger)
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
  <GroupTable :groups="groups" @edit-group="" @delete-group="" />
  <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="onPageChange" />
</template>
