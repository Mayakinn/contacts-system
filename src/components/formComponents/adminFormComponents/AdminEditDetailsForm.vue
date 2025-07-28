<script lang="ts" setup>
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/typings/interface/NotificationType'
import { computed, ref, watchEffect } from 'vue'
import type { User } from '@/typings/interface/User'
import { updateAdmin } from '@/services/adminService'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import ModalCloseButton from '@/components/modalComponents/ModalCloseButton.vue'

const schema = yup.object({
  email: yup.string().required('Įveskite el.paštą').email('Įveskite validų el. paštą').trim(),
  name: yup
    .string()
    .required('Neįvestas vardas')
    .max(30, 'Vardas per ilgas. Max. 30 simboliai')
    .trim(),
})

const props = defineProps<{
  currentAdmin: User | null
}>()

const emit = defineEmits(['close-pressed'])

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: schema,
})

const [email, emailAttrs] = defineField('email')
const [name, nameAttrs] = defineField('name')

const notifs = useNotificationStore()
const selectedFile = ref<File | null>(null)
const formData = new FormData()
const MAXFILESIZE = 5242880
const isFileAnImage = ref<boolean>(true)
const isFileSizeOk = ref<boolean>(true)

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target && target.files && target.files.length > 0) {
    if (target.files[0].name.match(/\.(jpg|jpeg|png|gif)$/)) {
      isFileAnImage.value = true
      if (target.files[0].size <= MAXFILESIZE) {
        selectedFile.value = target.files[0]
        isFileSizeOk.value = true
      } else {
        isFileSizeOk.value = false
      }
    } else {
      isFileAnImage.value = false
    }
  }
}

const onSubmit = handleSubmit(async () => {
  try {
    const currentSelectedAdmin = props.currentAdmin
    if (!currentSelectedAdmin?.permissions_id) {
      return
    }
    const emailChanged = email.value.trim() !== currentSelectedAdmin.email
    const nameChanged = name.value.trim() !== currentSelectedAdmin.name
    if (!nameChanged && !emailChanged && selectedFile.value == null) {
      emit('close-pressed', true)
      return
    }
    if (emailChanged) {
      formData.append('email', email.value.trim())
    }
    if (nameChanged) {
      formData.append('name', name.value.trim())
    }

    formData.append('permissions_id', currentSelectedAdmin.permissions_id)

    if (selectedFile.value != null) {
      formData.append('avatar', selectedFile.value)
    }

    updateAdminInfo()
  } catch (error: any) {
    notifs.addNotification('Įvyko klaida validuojant duomenis', NotificationType.warning)
  }
})

const avatarExisted = computed(() => {
  return props.currentAdmin?.avatar != '' ? true : false
})

const fileHasBeenUploaded = computed(() => {
  if (isFileSizeOk.value == false) {
    return 'File is too big (Max. 5MB)'
  }
  if (isFileAnImage.value == false) {
    return 'File is not an image.'
  }
  if (avatarExisted.value == true && selectedFile.value == null) {
    return props.currentAdmin?.avatar
  }
  return selectedFile.value?.name ? selectedFile.value?.name : 'No photo uploaded.'
})

async function updateAdminInfo() {
  try {
    if (props.currentAdmin?.id != null) {
      const result = await updateAdmin(formData, props.currentAdmin?.id)
      if (result != null) {
        notifs.addNotification('Adminas atnaujintas sėkmingai!', NotificationType.success)
        emit('close-pressed')
      }
    }
  } catch (error: any) {
    notifs.addNotification(error, NotificationType.danger)
  }
}
watchEffect(() => {
  if (props.currentAdmin) {
    const p = props.currentAdmin
    email.value = p.email ?? ''
    name.value = p.name ?? ''
  }
})
</script>

<template>
  <div class="sm:items-start m-5">
    <form @submit.prevent="onSubmit">
      <h1 class="text-xl">Redaguoti paskyrą:</h1>
      <div class="mt-10 justify-items-stretch">
        <div class="space-y-3 pb-10">
          <div>
            <label for="name" class="block text-gray-500 text-sm">Vardas:</label>
            <input
              type="name"
              id="name"
              placeholder="Įveskite vardą..."
              v-model="name"
              maxlength="30"
              v-bind="nameAttrs"
              class="w-full bg-gray-100 placeholder:text-gray-400 text-slate-700 text-sm border border-slate-200 rounded-xs pl-2 pr-3 py-2 transition duration-300 ease"
            />
            <p class="text-red-500">{{ errors.name }}</p>
          </div>
          <div>
            <label for="email" class="block text-gray-500 text-sm">Elektroninis paštas:</label>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              fill="currentColor"
              class="absolute w-5 h-5 text-slate-600 m-2"
            >
              <path
                clip-rule="evenodd"
                fill-rule="evenodd"
                d="M29 4H3a3 3 0 0 0-3 3v18a3 3 0 0 0 3 3h26a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-.72 2L16 14.77 3.72 6zM30 25a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.23l13.42 9.58a1 1 0 0 0 1.16 0L30 7.23z"
              />
            </svg>
            <input
              type="email"
              id="email"
              v-model="email"
              v-bind="emailAttrs"
              placeholder="Įveskite el. pašto adresą..."
              autocomplete="email"
              class="w-full bg-gray-100 placeholder:text-gray-400 text-slate-700 text-sm border border-slate-200 rounded-xs pl-10 pr-3 py-2 transition duration-300 ease"
            />
            <p class="text-red-500">{{ errors.email }}</p>
          </div>
          <div class="flex flex-col items-center justify-center mt-10">
            <label
              class="bg-button-blue text-white text-xs rounded-xs hover:bg-blue-800 w-full h-6 text-center pt-1"
              id="myFile"
              title="Upload image file"
              for="inputImage"
            >
              Įkelti nuotrauką
            </label>
            <input
              type="file"
              id="inputImage"
              name="filename"
              hidden
              accept=".jpg, .jpeg, .png"
              ref="file"
              @change="handleFileUpload"
            />

            <span class="text-sm text-gray-600 mt-1 truncate w-full max-w-50">{{
              fileHasBeenUploaded
            }}</span>
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
  <ModalCloseButton :isDeleteModal="false" @close-modal="emit('close-pressed', true)" />
</template>
