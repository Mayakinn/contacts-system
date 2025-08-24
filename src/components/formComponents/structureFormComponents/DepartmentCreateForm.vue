<script setup lang="ts">
import ModalCloseButton from '@/components/modalComponents/ModalCloseButton.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/typings/interface/NotificationType'
import { onMounted, ref } from 'vue'

import { getDivisions } from '@/services/divisionService'
import type { Division } from '@/typings/interface/Division'
import {
  createDepartment,
  getDepartment,
  updateAddDepartmentDivisions,
} from '@/services/departmentService'

const loading = ref<boolean>(true)
const empty = ref<boolean>(false)
const currentPage = ref<number>(1)
const totalPages = ref<number>(0)
const totalItems = ref<number>(0)
const divisionArray = ref<Division[]>([])

async function loadData() {
  try {
    const result = await getDivisions(currentPage.value, 30)

    if (result != null) {
      const [data, total, pages] = result
      divisionArray.value = data
      if (totalItems.value == undefined || totalItems.value == 0) {
        empty.value = true
        return
      } else if (totalItems.value > 0) {
        empty.value = false
        notifs.addNotification('Padaliniai sėkmingai užkrauti!', NotificationType.success)
      }
    } else {
      loading.value = false
      empty.value = true
      divisionArray.value = []
      totalItems.value = 0
      totalPages.value = 0

      notifs.addNotification('Nepavyko užkrauti padalinių!', NotificationType.danger)
    }
  } catch (error: any) {
    empty.value = true
    notifs.addNotification(error, NotificationType.danger)
  }
}

const schema = yup.object({
  name: yup
    .string()
    .required('Įveskite skyriaus pavadinimą')
    .max(50, 'Pavadinimas per ilgas. Max. 50 simboliai')
    .trim(),
  divisions: yup
    .array()
    .required()
    .min(1, 'Pasirinkite bent vieną padalinį')
    .of(yup.string().required()),
})

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    divisions: [],
  },
})

const [name, nameAttrs] = defineField('name')
const [divisions, divisionsAttrs] = defineField('divisions')

const notifs = useNotificationStore()

const emit = defineEmits(['close-pressed'])

const onSubmit = handleSubmit(async () => {
  const formData = new FormData()

  const result = await getDepartment(name.value.trim())
  if (result.length > 0) {
    notifs.addNotification(
      `Klaida: ${name.value} sukurti nepavyko. Toks skyrius jau egzistuoja`,
      NotificationType.danger,
    )
    return
  }
  divisions.value.forEach((divisionId: number | string) => {
    formData.append('division_id', divisionId.toString())
  })
  createNewDepartment(formData, name.value.trim())
})

async function createNewDepartment(formData: FormData, name: string) {
  try {
    const department_id = await createDepartmentAndGetId(name)

    if (department_id == null) {
      return
    }
    try {
      await createDepartmentRelations(formData, department_id)
      notifs.addNotification('Skyrius sėkmingai pridėtas', NotificationType.success)
    } catch (relationError) {
      notifs.addNotification(
        'Skyrius sukurtas, bet nepavyko pridėti visų ryšių',
        NotificationType.warning,
      )
    }
    notifs.addNotification('Skyrius sėkmingai pridėtas', NotificationType.success)
    emit('close-pressed')
  } catch (error: any) {
    notifs.addNotification(`Įvyko klaidą kuriant skyrių`, NotificationType.danger)
  }
}

async function createDepartmentAndGetId(name: string) {
  const createdDivision = await createDepartment(name)
  return createdDivision
}

async function createDepartmentRelations(formData: FormData, departmentId: string) {
  await updateAddDepartmentDivisions(formData, departmentId)
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
          <label class="block text-gray-500 text-sm mb-2">Pasirinkite padalinius:</label>
          <div class="space-y-1 overflow-y-scroll h-50 w-70">
            <div
              v-for="division in divisionArray"
              :key="division.id"
              class="flex items-center space-x-2 select-none"
            >
              <input
                type="checkbox"
                :id="'division-' + division.id"
                :value="division.id"
                v-model="divisions"
                class="hidden peer"
              />
              <label
                :for="'division-' + division.id"
                class="text-sm text-black bg-gray-100 peer-checked:bg-blue-700 w-70 h-10 text-center items-center justify justify-center flex"
              >
                {{ division.name }}
              </label>
            </div>
          </div>
          <p class="text-red-500 text-sm mt-1">{{ errors.divisions }}</p>
        </div>
      </div>
    </form>
  </div>
  <ModalCloseButton :isDeleteModal="false" @close-modal="emit('close-pressed', true)" />
</template>
