<script lang="ts" setup>
import OfficeCreateForm from '@/components/formComponents/structureFormComponents/OfficeCreateForm.vue'
import OfficeDeleteForm from '@/components/formComponents/structureFormComponents/OfficeDeleteForm.vue'
import OfficeEditForm from '@/components/formComponents/structureFormComponents/OfficeEditForm.vue'
import FormModal from '@/components/modalComponents/FormModal.vue'
import Pagination from '@/components/pageComponents/Pagination.vue'
import OfficeTable from '@/components/structureComponents/OfficeTable.vue'
import { getOffices } from '@/services/officeService'
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/typings/interface/NotificationType'
import type { Office } from '@/typings/interface/Office'
import { onMounted, ref, shallowRef, type Component } from 'vue'

const loading = ref<boolean>(true)
const empty = ref<boolean>(false)
const notifs = useNotificationStore()
const currentPage = ref<number>(1)
const totalPages = ref<number>(0)
const totalItems = ref<number>(0)
const offices = ref<Office[]>([])
const emit = defineEmits(['change-create-form'])
const currentOffice = ref<Office | null>(null)
const currentForm = shallowRef<Component>()
const formModalActive = ref<boolean>(false)

async function loadData() {
  try {
    const result = await getOffices(currentPage.value)

    if (result != null) {
      const [data, total, pages] = result
      offices.value = data
      totalItems.value = total
      loading.value = false
      totalPages.value = pages
      emit('change-create-form', OfficeCreateForm)
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

function closeModalAfterForm(flag: boolean) {
  formModalActive.value = false
  currentOffice.value = null
  if (flag) {
    return
  } else {
    loadData()
  }
}

function OpenModal() {
  formModalActive.value = true
}

function openDeleteOfficeForm(office: Office) {
  currentForm.value = OfficeDeleteForm
  currentOffice.value = office
  OpenModal()
}

function openOfficeEditForm(office: Office) {
  currentOffice.value = office
  currentForm.value = OfficeEditForm
  OpenModal()
}

function onPageChange(page: number) {
  currentPage.value = page
  loadData()
}
const closeModal = () => {
  formModalActive.value = false
  currentForm.value = undefined
  currentOffice.value = null
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div v-if="empty" class="text-3xl ml-24 mt-10">Sąrašas tusčias</div>
  <div v-else-if="loading" class="text-3xl ml-24 mt-10">Kraunama...</div>
  <div v-else>
    <OfficeTable
      :offices="offices"
      @edit-office="openOfficeEditForm"
      @delete-office="openDeleteOfficeForm"
    />
    <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="onPageChange" />
  </div>

  <FormModal :isActive="formModalActive" @close-modal="closeModal">
    <component
      @close-pressed="closeModalAfterForm"
      :is="currentForm"
      :currentOffice="currentOffice"
      :key="currentForm"
    ></component>
  </FormModal>
</template>
