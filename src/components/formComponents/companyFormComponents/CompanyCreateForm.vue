<script lang="ts" setup>
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import ModalCloseButton from '@/components/modalComponents/ModalCloseButton.vue'
import type { Company } from '@/typings/interface/Company'
import { useNotificationStore } from '@/stores/notificationStore'
import { createCompany } from '@/services/companiesService'
import { NotificationType } from '@/typings/interface/NotificationType'

const props = defineProps<{
  currentCompany: Company | null
}>()

const schema = yup.object({
  name: yup
    .string()
    .required('Įveskite įmonės pavadinimą')
    .max(30, 'Vardas per ilgas. Max. 30 simboliai')
    .trim(),
})

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: schema,
})

const formData = new FormData()

const [name, nameAttrs] = defineField('name')
const notifs = useNotificationStore()

const emit = defineEmits(['close-pressed'])

const onSubmit = handleSubmit(async () => {
  formData.append('name', name.value.trim())
  createNewCompany()
})

async function createNewCompany() {
  try {
    await createCompany(formData)
    notifs.addNotification('Įmonė sėkmingai pridėta', NotificationType.success)
    emit('close-pressed')
  } catch (error: any) {
    notifs.addNotification(error, NotificationType.danger)
  }
}
</script>

<template>
  <div class="sm:items-start m-5">
    <form @submit.prevent="onSubmit">
      <p class="text-2xl">Pridėti naują įmonę:</p>
      <div class="pr-20 space-y-5 mt-10">
        <div>
          <label for="name" class="block text-gray-500 text-sm">Įmonės pavadinimas:</label>
          <input
            type="name"
            id="name"
            placeholder="Įveskite įmonės pavadinimą..."
            v-model="name"
            maxlength="30"
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
      </div>
    </form>
  </div>
  <ModalCloseButton :isDeleteModal="false" @close-modal="emit('close-pressed', true)" />
</template>
