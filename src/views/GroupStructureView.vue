<script lang="ts" setup>
import GroupCreateForm from '@/components/formComponents/structureFormComponents/GroupCreateForm.vue'
import GroupDeleteForm from '@/components/formComponents/structureFormComponents/GroupDeleteForm.vue'
import GroupEditForm from '@/components/formComponents/structureFormComponents/GroupEditForm.vue'
import FormModal from '@/components/modalComponents/FormModal.vue'
import Pagination from '@/components/pageComponents/Pagination.vue'
import GroupTable from '@/components/structureComponents/GroupTable.vue'
import { getGroups } from '@/services/groupService'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Group } from '@/typings/interface/Group'
import { NotificationType } from '@/typings/interface/NotificationType'
import { onMounted, ref, shallowRef, type Component } from 'vue'

const loading = ref<boolean>(true)
const empty = ref<boolean>(false)
const notifs = useNotificationStore()
const currentPage = ref<number>(1)
const totalPages = ref<number>(0)
const totalItems = ref<number>(0)
const groups = ref<Group[]>([])
const emit = defineEmits(['change-create-form'])
const currentGroup = ref<Group | null>(null)
const currentForm = shallowRef<Component>()
const formModalActive = ref<boolean>(false)

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
function OpenModal() {
  formModalActive.value = true
}

function openDeleteGroupForm(group: Group) {
  currentForm.value = GroupDeleteForm
  currentGroup.value = group
  OpenModal()
}

function openGroupEditForm(group: Group) {
  currentForm.value = GroupEditForm
  currentGroup.value = group
  OpenModal()
}

const closeModal = () => {
  formModalActive.value = false
  currentForm.value = undefined
  currentGroup.value = null
}
function closeModalAfterForm(flag: boolean) {
  formModalActive.value = false
  currentGroup.value = null
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
    <GroupTable
      :groups="groups"
      @edit-group="openGroupEditForm"
      @delete-group="openDeleteGroupForm"
    />
    <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="onPageChange" />
  </div>
  <FormModal :isActive="formModalActive" @close-modal="closeModal">
    <component
      @close-pressed="closeModalAfterForm"
      :is="currentForm"
      :currentGroup="currentGroup"
      :key="currentForm"
    ></component>
  </FormModal>
</template>
