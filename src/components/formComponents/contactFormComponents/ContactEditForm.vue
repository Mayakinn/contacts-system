<script lang="ts" setup>
import ModalCloseButton from '@/components/modalComponents/ModalCloseButton.vue'
import { getCompanies } from '@/services/companiesService'
import { updateContact } from '@/services/contactsService'
import { getDepartments } from '@/services/departmentService'
import { getDivisions } from '@/services/divisionService'
import { getGroups } from '@/services/groupService'
import { getOffices } from '@/services/officeService'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Company } from '@/typings/interface/Company'
import type { CompanyOffice } from '@/typings/interface/CompanyOffice'
import type { Contact } from '@/typings/interface/Contact'
import type { DepartmentGroup } from '@/typings/interface/DepartmentGroup'
import type { DivisionDepartment } from '@/typings/interface/DivisionDepartment'
import { NotificationType } from '@/typings/interface/NotificationType'
import type { OfficeDivision } from '@/typings/interface/OfficeDivision'
import { useForm } from 'vee-validate'
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import * as yup from 'yup'
const regexExpressionPhone = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/

const schema = yup.object({
  email: yup.string().required('Įveskite el.paštą').email('Įveskite validų el. paštą').trim(),
  name: yup
    .string()
    .required('Įveskite vardą')
    .max(30, 'Vardas per ilgas. Max. 30 simboliai')
    .trim(),
  lastName: yup
    .string()
    .required('Įveskite pavardę')
    .max(30, 'Pavardė per ilga. Max. 30 simboliai')
    .trim(),
  phoneNumber: yup
    .string()
    .max(17, 'Telefono numeris per ilgas. Max. 17 simboliai')
    .matches(regexExpressionPhone, 'Įveskite validų telefono numerį')
    .trim(),
  position: yup
    .string()
    .required('Įveskite poziciją')
    .max(40, 'Pozicija per ilga. Max. 40 simboliai')
    .trim(),
  chosenCompany: yup.string().required('Būtina pasirinkti įmonę'),
  chosenOffice: yup.string().required('Būtina pasirinkti ofisą'),
  chosenDivision: yup.string().required('Būtina pasirinkti padalinį'),
  chosenDepartment: yup.string(),
  chosenGroup: yup.string(),
})

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
    name: '',
    lastName: '',
    phoneNumber: '',
    position: '',
    chosenCompany: '',
    chosenOffice: '',
    chosenDivision: '',
    chosenDepartment: '',
    chosenGroup: '',
  },
})

const props = defineProps<{
  currentContact: Contact | null
}>()

const emit = defineEmits(['close-pressed'])

const [email, emailAttrs] = defineField('email')
const [name, nameAttrs] = defineField('name')
const [lastName, lastNameAttrs] = defineField('lastName')
const [phoneNumber, phoneNumberAttrs] = defineField('phoneNumber')
const [position, positionAttrs] = defineField('position')
const [chosenCompany, chosenCompanyAttrs] = defineField('chosenCompany')
const [chosenOffice, chosenOfficeAttrs] = defineField('chosenOffice')
const [chosenDivision, chosenDivisionAttrs] = defineField('chosenDivision')
const [chosenDepartment, chosenDepartmentAttrs] = defineField('chosenDepartment')
const [chosenGroup, chosenGroupAttrs] = defineField('chosenGroup')

const companies = ref<Company[]>([])
const companyOffices = ref<CompanyOffice[]>([])
const officeDivisions = ref<OfficeDivision[]>([])
const divisionDepartments = ref<DivisionDepartment[]>([])
const departmentGroups = ref<DepartmentGroup[]>([])

const selectedFile = ref<File | null>(null)
const formData = new FormData()
const isFileAnImage = ref<boolean>(true)
const isFileSizeOk = ref<boolean>(true)
const MAXFILESIZE = 5242880
const notifs = useNotificationStore()

async function onCompanyValueChange() {
  companyOffices.value = await getOffices(chosenCompany.value)
  chosenOffice.value = ''
  chosenDivision.value = ''
  chosenDepartment.value = ''
  chosenGroup.value = ''
}
async function onOfficeValueChange() {
  officeDivisions.value = await getDivisions(chosenOffice.value)
  chosenDivision.value = ''
  chosenDepartment.value = ''
  chosenGroup.value = ''
}

async function onDivisionValueChange() {
  divisionDepartments.value = await getDepartments(chosenDivision.value)
  chosenDepartment.value = ''
  chosenGroup.value = ''
}

async function onDepartmentValueChange() {
  departmentGroups.value = await getGroups(chosenDepartment.value)
  chosenGroup.value = ''
}

const photoExisted = computed(() => {
  return props.currentContact?.photo != '' ? true : false
})

const fileHasBeenUploaded = computed(() => {
  if (isFileSizeOk.value == false) {
    return 'File is too big (Max. 5MB)'
  }
  if (isFileAnImage.value == false) {
    return 'File is not an image.'
  }
  if (photoExisted.value == true && selectedFile.value == null) {
    return props.currentContact?.photo
  }
  return selectedFile.value?.name != null ? selectedFile.value?.name : 'No photo uploaded.'
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

onMounted(async () => {
  companies.value = await getCompanies()
})

const onSubmit = handleSubmit(async () => {
  const currentlySelectedContact = props.currentContact
  if (currentlySelectedContact != null) {
    if (email.value.trim() != currentlySelectedContact.email) {
      formData.append('email', email.value.trim())
    }
    if (name.value.trim() != currentlySelectedContact.name) {
      formData.append('name', name.value.trim())
    }
    if (lastName.value.trim() != currentlySelectedContact.surname) {
      formData.append('surname', lastName.value.trim())
    }
    if (phoneNumber.value.trim() != currentlySelectedContact.phone_number) {
      formData.append('phone_number', phoneNumber.value.trim())
    }
    if (position.value.trim() != currentlySelectedContact.position) {
      formData.append('position', position.value.trim())
    }
    if (chosenCompany.value != currentlySelectedContact.company_id) {
      formData.append('company_id', chosenCompany.value)
    }
    if (chosenOffice.value != currentlySelectedContact.office_id) {
      formData.append('office_id', chosenOffice.value)
    }
    if (chosenDivision.value != currentlySelectedContact.division_id) {
      formData.append('division_id', chosenDivision.value)
    }
    if (chosenDepartment.value != currentlySelectedContact.department_id) {
      formData.append('department_id', chosenDepartment.value)
    }
    if (chosenGroup.value != currentlySelectedContact.group_id) {
      formData.append('group_id', chosenGroup.value)
    }
    if (selectedFile.value != null) {
      formData.append('photo', selectedFile.value)
    }
    if (formData.entries().next().done) {
      emit('close-pressed', true)
      return
    }

    editContact()
  } else {
    emit('close-pressed', true)
    return
  }
})

async function editContact() {
  if (props.currentContact?.id == null) {
    return
  }
  try {
    await updateContact(props.currentContact?.id, formData)
    emit('close-pressed')
    notifs.addNotification('Kontaktas sėkmingai atnaujintas!', NotificationType.success)
    return
  } catch (error: any) {
    notifs.addNotification(error, NotificationType.danger)
    emit('close-pressed', true)
  }
}

watchEffect(async () => {
  if (props.currentContact) {
    const p = props.currentContact
    email.value = p.email ?? ''
    name.value = p.name ?? ''
    lastName.value = p.surname ?? ''
    phoneNumber.value = p.phone_number ?? ''
    position.value = p.position ?? ''
    chosenCompany.value = p.company_id ?? ''
    await onCompanyValueChange()
    chosenOffice.value = p.office_id ?? ''
    await onOfficeValueChange()
    chosenDivision.value = p.division_id ?? ''
    await onDivisionValueChange()
    chosenDepartment.value = p.department_id ?? ''
    await onDepartmentValueChange()
    chosenGroup.value = p.group_id ?? ''
  }
})
</script>

<template>
  <div class="sm:items-start m-5">
    <form @submit.prevent="onSubmit">
      <p class="text-2xl">Redaguoti kontaktą:</p>
      <div class="grid sm:grid-cols-1 md:grid-cols-2 pr-50">
        <div class="pr-10 space-y-5">
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
            <label for="lastName" class="block text-gray-500 text-sm">Pavardė:</label>
            <input
              type="lastName"
              id="lastName"
              placeholder="Įveskite pavardę..."
              v-model="lastName"
              maxlength="30"
              v-bind="lastNameAttrs"
              class="w-full bg-gray-100 placeholder:text-gray-400 text-slate-700 text-sm border border-slate-200 rounded-xs pl-2 pr-3 py-2 transition duration-300 ease"
            />
            <p class="text-red-500">{{ errors.lastName }}</p>
          </div>
          <div>
            <label for="position" class="block text-gray-500 text-sm">Pozicija:</label>
            <input
              type="position"
              id="position"
              placeholder="Įveskite poziciją..."
              v-model="position"
              maxlength="30"
              v-bind="positionAttrs"
              class="w-full bg-gray-100 placeholder:text-gray-400 text-slate-700 text-sm border border-slate-200 rounded-xs pl-2 pr-3 py-2 transition duration-300 ease"
            />
            <p class="text-red-500">{{ errors.position }}</p>
          </div>
          <p class="text-2xl">Kontaktinė informacija:</p>
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
          <div>
            <label for="phoneNumber" class="block text-gray-500 text-sm">Telefono numeris:</label>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 28.314 28.323"
              style="enable-background: new 0 0 28.314 28.323"
              class="absolute w-5 h-5 text-slate-600 m-2"
              xml:space="preserve"
            >
              <path
                clip-rule="evenodd"
                fill-rule="evenodd"
                d="m27.728 20.384-4.242-4.242a1.982 1.982 0 0 0-1.413-.586h-.002c-.534 0-1.036.209-1.413.586L17.83 18.97l-8.485-8.485 2.828-2.828c.78-.78.78-2.05-.001-2.83L7.929.585A1.986 1.986 0 0 0 6.516
              0h-.001C5.98 0 5.478.209 5.101.587L.858 4.83C.729 4.958-.389 6.168.142 8.827c.626 3.129 3.246 7.019 7.787 11.56 6.499 6.499 10.598 7.937 12.953 7.937 1.63 0
              2.426-.689 2.604-.867l4.242-4.242c.378-.378.587-.881.586-1.416 0-.534-.208-1.037-.586-1.415zm-5.656 5.658c-.028.028-3.409 2.249-12.729-7.07C-.178 9.452 2.276 6.243 2.272 6.244L6.515 2l4.243
              4.244-3.535 3.535a.999.999 0 0 0 0 1.414l9.899 9.899a.999.999 0 0 0 1.414 0l3.535-3.536 4.243 4.244-4.242 4.242z"
              />
            </svg>
            <input
              type="phoneNumber"
              id="phoneNumber"
              v-model="phoneNumber"
              v-bind="phoneNumberAttrs"
              placeholder="Įveskite telefono numerį..."
              autocomplete="tel"
              class="w-full bg-gray-100 placeholder:text-gray-400 text-slate-700 text-sm border border-slate-200 rounded-xs pl-10 pr-3 py-2 transition duration-300 ease"
            />
            <p class="text-red-500">{{ errors.phoneNumber }}</p>
          </div>
        </div>
        <div class="">
          <p class="text-2xl">Įmonės detalės:</p>
          <div class="flex flex-col gap-3 text-md items-left">
            <div>
              <label class="block">Įmonė:</label>
              <select
                class="h-10 w-65 rounded-md bg-white text-sm text-gray-500 shadow-md shadow-gray-500"
                @change="onCompanyValueChange()"
                v-model="chosenCompany"
                v-bind="chosenCompanyAttrs"
              >
                <option value="" selected>Pasirinkite įmonę...</option>
                <option v-for="company in companies" :value="company.id" :key="company.id">
                  {{ company.name }}
                </option>
              </select>
              <p class="text-red-500">{{ errors.chosenCompany }}</p>
            </div>
            <div>
              <label class="block">Ofisas:</label>
              <select
                class="rounded-sm w-65 h-10 text-gray-500 text-sm shadow-md shadow-gray-500"
                v-model="chosenOffice"
                v-bind="chosenOfficeAttrs"
                @change="onOfficeValueChange()"
              >
                <option value="" selected>Pasirinkite ofisą...</option>
                <option
                  v-for="office in companyOffices"
                  :value="office.expand?.office_id.id"
                  :key="office.expand?.office_id.id"
                >
                  {{ office.expand?.office_id.name }}
                </option>
              </select>
              <p class="text-red-500">{{ errors.chosenOffice }}</p>
            </div>
            <div>
              <label class="block">Padalinys:</label>
              <select
                class="rounded-sm w-65 h-10 text-gray-500 text-sm shadow-md shadow-gray-500"
                v-model="chosenDivision"
                v-bind="chosenDivisionAttrs"
                @change="onDivisionValueChange()"
              >
                <option value="" selected>Pasirinkite padalinį...</option>
                <option
                  v-for="division in officeDivisions"
                  :key="division.expand?.division_id.id"
                  :value="division.expand?.division_id.id"
                >
                  {{ division.expand?.division_id.name }}
                </option>
              </select>
              <p class="text-red-500">{{ errors.chosenDivision }}</p>
            </div>
            <div>
              <label class="block">Skyrius:</label>
              <select
                class="rounded-sm w-65 h-10 text-gray-500 text-sm shadow-md shadow-gray-500"
                v-model="chosenDepartment"
                v-bind="chosenDepartmentAttrs"
                @change="onDepartmentValueChange()"
              >
                <option value="" selected>Pasirinkite skyrių...</option>
                <option
                  v-for="department in divisionDepartments"
                  :key="department.expand?.department_id.id"
                  :value="department.expand?.department_id.id"
                >
                  {{ department.expand?.department_id.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block">Grupė:</label>
              <select
                class="rounded-sm w-65 h-10 text-gray-500 text-sm shadow-md shadow-gray-500"
                v-model="chosenGroup"
                v-bind="chosenGroupAttrs"
              >
                <option value="" selected>Pasirinkite grupę...</option>
                <option
                  v-for="group in departmentGroups"
                  :key="group.expand?.group_id.id"
                  :value="group.expand?.group_id.id"
                >
                  {{ group.expand?.group_id.name }}
                </option>
              </select>
            </div>
            <div class="flex flex-col items-center justify-center mt-1">
              <label
                class="bg-button-blue text-white text-xs rounded-xs hover:bg-blue-800 w-60 h-6 text-center pt-1"
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
        </div>
      </div>

      <button
        class="h-7 w-45 bg-button-blue absolute right-5 bottom-5 text-white text-xs rounded-xs hover:bg-blue-800"
      >
        Išsaugoti
      </button>
    </form>
  </div>
  <ModalCloseButton :isDeleteModal="false" @close-modal="emit('close-pressed', true)" />
</template>
