<script setup lang="ts">
import ModalCloseButton from '@/components/modalComponents/ModalCloseButton.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/typings/interface/NotificationType'
import { onMounted, ref } from 'vue'
import { createDivision } from '@/services/divisionService'
import { getOffices } from '@/services/officeService'
import type { Office } from '@/typings/interface/Office'

const loading = ref<boolean>(true)
const empty = ref<boolean>(false)
const currentPage = ref<number>(1)
const totalPages = ref<number>(0)
const totalItems = ref<number>(0)
const officeArray = ref<Office[]>([])

async function loadData() {
  try {
    const result = await getOffices(currentPage.value)

    if (result != null) {
      const [data, total, pages] = result
      officeArray.value = data
      if (totalItems.value == undefined || totalItems.value == 0) {
        empty.value = true
        return
      } else if (totalItems.value > 0) {
        empty.value = false
        notifs.addNotification('Ofisai sėkmingai užkrautos!', NotificationType.success)
      }
    } else {
      loading.value = false
      empty.value = true
      officeArray.value = []
      totalItems.value = 0
      totalPages.value = 0

      notifs.addNotification('Nepavyko užkrauti ofisų!', NotificationType.danger)
    }
  } catch (error: any) {
    empty.value = true
    notifs.addNotification(error, NotificationType.danger)
  }
}

const schema = yup.object({
  name: yup
    .string()
    .required('Įveskite padalinio pavadinimą')
    .max(50, 'Pavadinimas per ilgas. Max. 50 simboliai')
    .trim(),
  offices: yup
    .array()
    .required()
    .min(1, 'Pasirinkite bent vieną ofisą')
    .of(yup.string().required()),
})

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    offices: [],
  },
})

const [name, nameAttrs] = defineField('name')
const [offices, officesAttrs] = defineField('offices')

const notifs = useNotificationStore()

const emit = defineEmits(['close-pressed'])

const onSubmit = handleSubmit(async () => {
  const formData = new FormData()

  offices.value.forEach((officeId: number | string) => {
    formData.append('office_id', officeId.toString())
  })
  createNewDivision(formData, name.value.trim())
})

async function createNewDivision(formData: FormData, name: string) {
  try {
    await createDivision(formData, name)
    notifs.addNotification('Padalinys sėkmingai pridėtas', NotificationType.success)
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
      <p class="text-2xl">Pridėti naują padalinį:</p>
      <div class="grid sm:grid-cols-1 md:grid-cols-2 pr-50">
        <div class="mr-40 space-y-5 mt-10 w-full">
          <label for="name" class="block text-gray-500 text-sm">Padalinio pavadinimas:</label>
          <input
            type="name"
            id="name"
            placeholder="Įveskite padalinio pavadinimą..."
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
          <label class="block text-gray-500 text-sm mb-2">Pasirinkite ofisus:</label>
          <div class="space-y-1 overflow-y-scroll h-50 w-70">
            <div
              v-for="office in officeArray"
              :key="office.id"
              class="flex items-center space-x-2 select-none"
            >
              <input
                type="checkbox"
                :id="'office-' + office.id"
                :value="office.id"
                v-model="offices"
                class="hidden peer"
              />
              <label
                :for="'office-' + office.id"
                class="text-sm text-black bg-gray-100 peer-checked:bg-blue-700 w-70 h-10 text-center items-center justify justify-center flex"
              >
                {{ office.name }}
              </label>
            </div>
          </div>
          <p class="text-red-500 text-sm mt-1">{{ errors.offices }}</p>
        </div>
      </div>
    </form>
  </div>
  <ModalCloseButton :isDeleteModal="false" @close-modal="emit('close-pressed', true)" />
</template>
