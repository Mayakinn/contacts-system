<script setup lang="ts">
import ModalCloseButton from '@/components/modalComponents/ModalCloseButton.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/typings/interface/NotificationType'
import { onMounted, ref } from 'vue'
import { getGroups } from '@/services/groupService'
import type { Group } from '@/typings/interface/Group'
import { createDepartment } from '@/services/departmentService'

const loading = ref<boolean>(true)
const empty = ref<boolean>(false)
const currentPage = ref<number>(1)
const totalPages = ref<number>(0)
const totalItems = ref<number>(0)
const GroupsArray = ref<Group[]>([])

async function loadData() {
  try {
    const result = await getGroups(currentPage.value)

    if (result != null) {
      const [data, total, pages] = result
      GroupsArray.value = data
      if (totalItems.value == undefined || totalItems.value == 0) {
        empty.value = true
        return
      } else if (totalItems.value > 0) {
        empty.value = false
        notifs.addNotification('Grupės sėkmingai užkrautos!', NotificationType.success)
      }
    } else {
      loading.value = false
      empty.value = true
      GroupsArray.value = []
      totalItems.value = 0
      totalPages.value = 0

      notifs.addNotification('Nepavyko užkrauti grupių!', NotificationType.danger)
    }
  } catch (error: any) {
    empty.value = true
    notifs.addNotification(error, NotificationType.danger)
  }
}

const schema = yup.object({
  name: yup
    .string()
    .required('Įveskite grupės pavadinimą')
    .max(50, 'Pavadinimas per ilgas. Max. 50 simboliai')
    .trim(),
  groups: yup.array().required().min(1, 'Pasirinkite bent vieną grupę').of(yup.string().required()),
})

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    groups: [],
  },
})

const [name, nameAttrs] = defineField('name')
const [groups, groupsAttrs] = defineField('groups')

const notifs = useNotificationStore()

const emit = defineEmits(['close-pressed'])

const onSubmit = handleSubmit(async () => {
  const formData = new FormData()

  groups.value.forEach((groupId: number | string) => {
    formData.append('group_id', groupId.toString())
  })
  createNewGroup(formData, name.value.trim())
})

async function createNewGroup(formData: FormData, name: string) {
  try {
    await createDepartment(formData, name)
    notifs.addNotification('Grupė sėkmingai pridėta', NotificationType.success)
    emit('close-pressed')
  } catch (error: any) {
    notifs.addNotification(error, NotificationType.danger)
  }
}

onMounted(async () => {
  await loadData()
})
</script>

<template>
  <div class="sm:items-start m-5">
    <form @submit.prevent="onSubmit">
      <p class="text-2xl">Pridėti naują skyrių:</p>
      <div class="grid sm:grid-cols-1 md:grid-cols-2 pr-50">
        <div class="mr-40 space-y-5 mt-10 w-full">
          <label for="name" class="block text-gray-500 text-sm">Skyriaus pavadinimas:</label>
          <input
            type="name"
            id="name"
            placeholder="Įveskite skyriaus pavadinimą..."
            v-model="name"
            maxlength="50"
            v-bind="nameAttrs"
            class="w-full bg-gray-100 placeholder:text-gray-400 text-slate-700 text-sm border border-slate-200 rounded-xs pl-2 pr-3 py-2 transition duration-300 ease"
          />
          <p class="text-red-500">{{ errors.name }}</p>
          <button
            class="h-7 w-45 mt-10 bg-button-blue text-white text-xs rounded-xs hover:bg-blue-800"
          >
            Pridėti
          </button>
        </div>
        <div class="ml-10">
          <label class="block text-gray-500 text-sm mb-2">Pasirinkite grupes:</label>
          <div class="space-y-1 overflow-y-scroll h-50 w-70">
            <div
              v-for="group in GroupsArray"
              :key="group.id"
              class="flex items-center space-x-2 select-none"
            >
              <input
                type="checkbox"
                :id="'department-' + group.id"
                :value="group.id"
                v-model="groups"
                class="hidden peer"
              />
              <label
                :for="'department-' + group.id"
                class="text-sm text-black bg-gray-100 peer-checked:bg-blue-700 w-70 h-10 text-center items-center justify justify-center flex"
              >
                {{ group.name }}
              </label>
            </div>
          </div>
          <p class="text-red-500 text-sm mt-1">{{ errors.groups }}</p>
        </div>
      </div>
    </form>
  </div>
  <ModalCloseButton :isDeleteModal="false" @close-modal="emit('close-pressed', true)" />
</template>
