<script setup lang="ts">
import { createAdmin } from '@/services/adminService'
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/typings/interface/NotificationType'
import { computed, ref } from 'vue'
import { randomPassword } from 'secure-random-password'
import type { User } from '@/typings/interface/User'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import ModalCloseButton from '@/components/modalComponents/ModalCloseButton.vue'
const regexExpressionString = /^\p{L}+$/u

const props = defineProps<{
  currentAdmin: User | null
}>()

const schema = yup.object({
  email: yup.string().required('Įveskite el.paštą').email('Įveskite validų el. paštą').trim(),
  name: yup
    .string()
    .required('Įveskite vardą')
    .max(30, 'Vardas per ilgas. Max. 30 simboliai')
    .matches(regexExpressionString, 'Negalimi jokie specialūs simboliai/skaičiai')
    .min(2, 'Vardas per trumpas')
    .trim(),
})

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: schema,
})

const [email, emailAttrs] = defineField('email')
const [name, nameAttrs] = defineField('name')
const editCreateContacts = ref<boolean>(false)
const deleteContacts = ref<boolean>(false)
const createEditCompanies = ref<boolean>(false)
const deleteCompanies = ref<boolean>(false)
const createEditOffices = ref<boolean>(false)
const deleteOffices = ref<boolean>(false)
const createEditStructures = ref<boolean>(false)
const deleteStructures = ref<boolean>(false)
const selectedFile = ref<File | null>(null)
const password = ref<string>('password')
const formData = new FormData()
const showTempPassword = ref<boolean>(false)
const isFileAnImage = ref<boolean>(true)
const isFileSizeOk = ref<boolean>(true)
const MAXFILESIZE = 5242880
const notifs = useNotificationStore()

const emit = defineEmits(['close-pressed'])

async function createNewAdmin(permissions: object) {
  try {
    await createAdmin(permissions, formData)
    showTempPassword.value = true
  } catch (error: any) {
    notifs.addNotification(error, NotificationType.danger)
  }
}

const onSubmit = handleSubmit(async () => {
  password.value = randomPassword({ length: 12, characters: 'alphanumeric' })
  formData.append('email', email.value.trim())
  formData.append('name', name.value.trim())
  if (selectedFile.value != null) {
    formData.append('avatar', selectedFile.value)
  }
  formData.append('password', password.value)
  formData.append('passwordConfirm', password.value)
  const permissions = {
    edit_employees: editCreateContacts.value,
    delete_employees: deleteContacts.value,
    edit_companies: createEditCompanies.value,
    delete_companies: deleteCompanies.value,
    edit_offices: createEditOffices.value,
    delete_offices: deleteOffices.value,
    edit_structure: createEditStructures.value,
    delete_structure: deleteStructures.value,
    read_permissions: true,
  }
  createNewAdmin(permissions)
})

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

const fileHasBeenUploaded = computed(() => {
  if (isFileSizeOk.value == false) {
    return 'File is too big (Max. 5MB)'
  }
  if (isFileAnImage.value == false) {
    return 'File is not an image.'
  }
  if (isFileSizeOk.value == true && selectedFile.value == null) {
    return props.currentAdmin?.avatar
  }
  return selectedFile.value?.name ? selectedFile.value?.name : 'No photo uploaded.'
})
</script>

<template>
  <div class="sm:items-start m-5">
    <div v-if="showTempPassword" class="mt-10 pr-50">
      <h1 class="text-xl">Laikinas slaptažodis:</h1>
      <p class="mt-10 text-gray-600">Laikinas paskyros slaptažodis : {{ password }}</p>
    </div>
    <form @submit.prevent="onSubmit" v-if="!showTempPassword">
      <h1 class="text-xl">Pridėti naują admin paskyrą:</h1>
      <div class="grid sm:grid-cols-1 md:grid-cols-2 mt-10 pr-50 justify-items-stretch">
        <div class="pr-10 space-y-3 pb-50">
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

            <span class="text-sm text-gray-600 mt-1 truncate w-full">{{
              fileHasBeenUploaded
            }}</span>
          </div>
        </div>
        <div class="">
          <p class="mx-5 mb-3">Administracinės teisės:</p>
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
      </div>

      <button
        class="h-7 w-45 bg-button-blue absolute right-5 bottom-5 text-white text-xs rounded-xs hover:bg-blue-800"
      >
        Pridėti
      </button>
    </form>
  </div>
  <ModalCloseButton
    v-if="!showTempPassword"
    :isDeleteModal="false"
    @close-modal="emit('close-pressed', true)"
  />
  <ModalCloseButton
    v-if="showTempPassword"
    :isDeleteModal="false"
    @close-modal="emit('close-pressed')"
  />
</template>
