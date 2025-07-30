<script setup lang="ts">
import ModalCloseButton from '@/components/modalComponents/ModalCloseButton.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/typings/interface/NotificationType'
import { createGroup } from '@/services/groupService'

const schema = yup.object({
  name: yup
    .string()
    .required('Įveskite grupės pavadinimą')
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
  createNewGroup(formData)
})

async function createNewGroup(formData: FormData) {
  try {
    await createGroup(formData)
    notifs.addNotification('Grupė sėkmingai pridėta', NotificationType.success)
    emit('close-pressed')
  } catch (error: any) {
    notifs.addNotification(error, NotificationType.danger)
  }
}
</script>

<template>
  <div class="sm:items-start m-5">
    <form @submit.prevent="onSubmit">
      <p class="text-2xl">Pridėti naują grupę:</p>
      <div class="mr-40 space-y-5 mt-10 w-full">
        <div>
          <label for="name" class="block text-gray-500 text-sm">Grupės pavadinimas:</label>
          <input
            type="name"
            id="name"
            placeholder="Įveskite grupės pavadinimą..."
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
