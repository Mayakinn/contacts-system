<script lang="ts" setup>
import GroupCreateForm from '@/components/formComponents/structureFormComponents/GroupCreateForm.vue'
import GroupDeleteForm from '@/components/formComponents/structureFormComponents/GroupDeleteForm.vue'
import GroupEditForm from '@/components/formComponents/structureFormComponents/GroupEditForm.vue'
import FormModal from '@/components/modalComponents/FormModal.vue'
import Pagination from '@/components/pageComponents/Pagination.vue'
import StructureTable from '@/components/structureComponents/StructureTable.vue'
import { getGroups } from '@/services/groupService'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Group } from '@/typings/interface/Group'
import { NotificationType } from '@/typings/interface/NotificationType'
import { computed, onMounted, ref, shallowRef, type Component } from 'vue'

const loading = ref<boolean>(true)
const empty = ref<boolean>(false)
const notifs = useNotificationStore()
const currentPage = ref<number>(1)
const totalPages = ref<number>(0)
const totalItems = ref<number>(0)
const groups = ref<Group[]>([])
const emit = defineEmits(['change-create-form'])
const currentGroup = ref<Group | undefined>(undefined)
const currentForm = shallowRef<Component>()
const formModalActive = ref<boolean>(false)
const fields = [{ key: 'name', label: 'Pavadinimas' }]
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
const mappedGroups = computed(() =>
  groups.value.map((group) => ({
    id: group.id,
    name: group.name || 'Nežinoma grupė',
  })),
)
function openDeleteGroupForm(groupId: string) {
  currentForm.value = GroupDeleteForm
  currentGroup.value = groups.value.find((group) => group.id === groupId)
  OpenModal()
}

const auth = useAuthStore()
const canUserDelete = computed(() => {
  return auth.User?.expand?.permissions_id?.delete_structure
})
const canUserEdit = computed(() => {
  return auth.User?.expand?.permissions_id?.edit_structure
})
function openGroupEditForm(groupId: string) {
  currentForm.value = GroupEditForm
  currentGroup.value = groups.value.find((group) => group.id === groupId)
  OpenModal()
}

const closeModal = () => {
  formModalActive.value = false
  currentForm.value = undefined
  currentGroup.value = undefined
}
function closeModalAfterForm(flag: boolean) {
  formModalActive.value = false
  currentGroup.value = undefined
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
    <StructureTable
      :data="mappedGroups"
      :fields="fields"
      :canUserDelete="canUserDelete"
      :canUserEdit="canUserEdit"
      @edit="openGroupEditForm"
      @delete="openDeleteGroupForm"
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
