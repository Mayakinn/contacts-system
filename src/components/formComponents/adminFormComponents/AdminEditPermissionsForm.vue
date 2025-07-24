<script lang="ts" setup>
import ModalCloseButton from '@/components/modalComponents/ModalCloseButton.vue'
import { updateAdminPermissions } from '@/services/adminService'
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/typings/interface/NotificationType'
import type { User } from '@/typings/interface/User'
import { ref, watchEffect } from 'vue'
const props = defineProps<{
  currentAdmin: User | null
}>()

const editCreateContacts = ref<boolean>(false)
const deleteContacts = ref<boolean>(false)
const createEditCompanies = ref<boolean>(false)
const deleteCompanies = ref<boolean>(false)
const createEditOffices = ref<boolean>(false)
const deleteOffices = ref<boolean>(false)
const createEditStructures = ref<boolean>(false)
const deleteStructures = ref<boolean>(false)
const emit = defineEmits(['close-pressed'])

const notifs = useNotificationStore()

function formatData() {
  const permissions = {
    edit_employees: editCreateContacts.value,
    delete_employees: deleteContacts.value,
    edit_companies: createEditCompanies.value,
    delete_companies: deleteCompanies.value,
    edit_offices: createEditOffices.value,
    delete_offices: deleteOffices.value,
    edit_structure: createEditStructures.value,
    delete_structure: deleteStructures.value,
  }
  updateSelectedAdminPermissions(permissions)
}
watchEffect(() => {
  if (props.currentAdmin?.expand?.permissions_id) {
    const p = props.currentAdmin.expand.permissions_id
    editCreateContacts.value = p.edit_employees ?? false
    deleteContacts.value = p.delete_employees ?? false
    createEditCompanies.value = p.edit_companies ?? false
    deleteCompanies.value = p.delete_companies ?? false
    createEditOffices.value = p.edit_offices ?? false
    deleteOffices.value = p.delete_offices ?? false
    createEditStructures.value = p.edit_structure ?? false
    deleteStructures.value = p.delete_structure ?? false
  }
})
async function updateSelectedAdminPermissions(permissions: object) {
  try {
    if (props.currentAdmin?.permissions_id != null) {
      const results = await updateAdminPermissions(permissions, props.currentAdmin?.permissions_id)
      if (results != null) {
        notifs.addNotification('Sėkmingai atnaujinti leidimai!', NotificationType.success)
        emit('close-pressed')
      }
    }
  } catch (error: any) {
    notifs.addNotification(error, NotificationType.danger)
    emit('close-pressed')
  }
}
</script>

<template>
  <div class="sm:items-start m-5">
    <form @submit.prevent="formatData">
      <h1 class="text-xl">Redaguoti paskyros teises:</h1>

      <div class="">
        <p class="mx-5 mt-10 mb-2">Administracinės teisės:</p>
        <div class="flex flex-col gap-4 text-md items-left">
          <div>
            <input type="checkbox" id="editCreateContacts" v-model="editCreateContacts" />
            <label for="editCreateContacts"> Redaguoti ir kurti kontaktus</label>
          </div>
          <div>
            <input type="checkbox" id="deleteContacts" v-model="deleteContacts" />
            <label for="deleteContacts"> Trinti kontaktus</label>
          </div>
          <div>
            <input type="checkbox" id="createEditCompanies" v-model="createEditCompanies" />
            <label for="createEditCompanies"> Redaguoti ir kurti įmones</label>
          </div>
          <div>
            <input type="checkbox" id="deleteCompanies" v-model="deleteCompanies" />
            <label for="deleteCompanies"> Trinti įmones</label>
          </div>
          <div>
            <input type="checkbox" id="createEditOffices" v-model="createEditOffices" />
            <label for="createEditOffices"> Redaguoti ir kurti ofisus</label>
          </div>
          <div>
            <input type="checkbox" id="deleteOffices" v-model="deleteOffices" />
            <label for="deleteOffices"> Trinti ofisus</label>
          </div>
          <div>
            <input type="checkbox" id="createEditStructures" v-model="createEditStructures" />
            <label for="createEditStructures"> Redaguoti ir kurti struktūras</label>
          </div>
          <div>
            <input type="checkbox" id="deleteStructures" v-model="deleteStructures" />
            <label for="deleteStructures"> Trinti struktūras</label>
          </div>
        </div>
      </div>

      <button
        class="h-7 w-45 bg-button-blue absolute right-5 bottom-5 text-white text-xs rounded-xs hover:bg-blue-800"
      >
        Atnaujinti
      </button>
    </form>
  </div>
    <ModalCloseButton :isDeleteModal="false" @close-modal="emit('close-pressed', true)"/>

</template>
