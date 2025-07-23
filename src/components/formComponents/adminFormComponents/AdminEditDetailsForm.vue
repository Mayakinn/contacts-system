<script lang="ts" setup>
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/typings/interface/NotificationType'
import { computed, ref, watchEffect } from 'vue'
import validator from 'email-validator'
import type { User } from '@/typings/interface/User'
import { updateAdmin } from '@/services/adminService'
const props = defineProps<{
  currentAdmin: User | null
  users: User[]
}>()

const emit = defineEmits(['close-pressed'])

const fileTooBig = ref<boolean>(false)

const notifs = useNotificationStore()
const email = ref<string>('')
const name = ref<string>('')
const selectedFile = ref<File | null>(null)
const formData = new FormData()
const emailErrorMessage = ref<string>('')

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target && target.files && target.files.length > 0) {
    if (target.files[0].size <= 5242880) {
      selectedFile.value = target.files[0]
      fileTooBig.value = false
    } else {
      fileTooBig.value = true
    }
  }
}

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
    emit('close-pressed')
  }
}

function validateForm() {
  if (props.currentAdmin?.permissions_id == null) {
    return
  }
  const result = props.users.filter((obj) =>
    Object.values(obj).some((val) => String(val).toLowerCase().includes(email.value.toLowerCase())),
  )
  if (result.length > 0 && email.value != '') {
    emailErrorMessage.value = 'Paštas jau egzistuoja!'
    return
  }
  if (email.value != '') {
    if (validator.validate(email.value) == false) {
      emailErrorMessage.value = 'Įveskita validų el.paštą!'
      return
    } else {
      formData.append('email', email.value.trim())
    }
  }
  if (name.value != '') {
    formData.append('name', name.value.trim())
  }
  formData.append('permissions_id', props.currentAdmin?.permissions_id)
  if (selectedFile.value != null) {
    formData.append('avatar', selectedFile.value)
  }

  updateAdminInfo()
}

const nameExisted = computed(() => {
  return props.currentAdmin?.name != '' ? props.currentAdmin?.name : 'Įveskite vardą...'
})

const avatarExisted = computed(() => {
  return props.currentAdmin?.avatar != '' ? true : false
})

const emailExisted = computed(() => {
  return props.currentAdmin?.email != '' ? props.currentAdmin?.email : 'Įveskite el.pašto adresą...'
})

const fileHasBeenUploaded = computed(() => {
  if (fileTooBig.value) {
    return 'File is too big (Max. 5MB)'
  }
  if (avatarExisted.value == true && selectedFile.value == null) {
    return props.currentAdmin?.avatar
  }
  return selectedFile.value?.name ? selectedFile.value?.name : 'No photo uploaded.'
})
</script>

<template>
  <div class="sm:items-start m-5">
    <form @submit.prevent="validateForm">
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
              class="w-full bg-gray-100 placeholder:text-gray-400 text-slate-700 text-sm border border-slate-200 rounded-xs pl-2 pr-3 py-2 transition duration-300 ease"
            />
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
              placeholder="Įveskite el. pašto adresą..."
              autocomplete="email"
              class="w-full bg-gray-100 placeholder:text-gray-400 text-slate-700 text-sm border border-slate-200 rounded-xs pl-10 pr-3 py-2 transition duration-300 ease"
            />
            {{ emailErrorMessage }}
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
</template>
