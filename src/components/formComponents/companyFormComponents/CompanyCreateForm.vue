<script lang="ts" setup>
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import ModalCloseButton from '@/components/modalComponents/ModalCloseButton.vue'
import type { Company } from '@/typings/interface/Company'
import { useNotificationStore } from '@/stores/notificationStore'
import { createCompany, getCompany } from '@/services/companiesService'
import { NotificationType } from '@/typings/interface/NotificationType'

const props = defineProps<{
  currentCompany: Company | null
}>()

const schema = yup.object({
  name: yup
    .string()
    .required('Įveskite įmonės pavadinimą')
    .max(50, 'Pavadinimas per ilgas. Max. 50 simboliai')
    .trim(),
})

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: schema,
})

const [name, nameAttrs] = defineField('name')
const notifs = useNotificationStore()

const emit = defineEmits(['close-pressed'])

const onSubmit = handleSubmit(async () => {
  const formData = new FormData()

  formData.append('name', name.value.trim())
  createNewCompany(formData)
})

async function createNewCompany(formData: FormData) {
  try {
    const result = await getCompany(name.value)
    if (result.length > 0) {
      notifs.addNotification(
        `Klaida: ${name.value} sukurti nepavyko. Tokia įmonė jau egzistuoja`,
        NotificationType.danger,
      )
      return
    }

    await createCompany(formData)
    notifs.addNotification('Įmonė sėkmingai pridėta', NotificationType.success)
    emit('close-pressed')
  } catch (error: any) {
    if (error == 400) {
      notifs.addNotification(
        `Klaida: ${name.value} sukurti nepavyko. Neturite tam teisių!`,
        NotificationType.danger,
      )
      return
    }
    notifs.addNotification(error, NotificationType.danger)
  }
}
</script>

<template>
  <div class="sm:items-start m-5">
    <form @submit.prevent="onSubmit">
      <p class="text-2xl">Pridėti naują įmonę:</p>
      <div class="mr-40 space-y-5 mt-10 w-full">
        <div>
          <label for="name" class="block text-gray-500 text-sm">Įmonės pavadinimas:</label>
          <input
            type="name"
            id="name"
            placeholder="Įveskite įmonės pavadinimą..."
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
      </div>
    </form>
  </div>
  <ModalCloseButton :isDeleteModal="false" @close-modal="emit('close-pressed', true)" />
</template>
