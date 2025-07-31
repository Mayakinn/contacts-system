<script setup lang="ts">
import ModalCloseButton from '@/components/modalComponents/ModalCloseButton.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/typings/interface/NotificationType'
import { onMounted, ref } from 'vue'

import type { Company } from '@/typings/interface/Company'
import { getCompanies } from '@/services/companiesService'
import {
  getOfficeCompanies,
  updateAddOfficeCompanies,
  updateDeleteOfficeCompanies,
  updateOfficeDetails,
} from '@/services/officeService'
import type { Office } from '@/typings/interface/Office'
import type { CompanyOffice } from '@/typings/interface/CompanyOffice'

const empty = ref<boolean>(false)
const currentPage = ref<number>(1)
const companiesArray = ref<Company[]>([])
const regexExpressionStringAndNumbers = /^[\p{L}\p{N} ]+$/u
const regexExpressionString = /^\p{L}+$/u
import _ from 'lodash'

const props = defineProps<{
  currentOffice: Office | null
}>()

async function loadData() {
  try {
    const result = await getCompanies(currentPage.value)
    if (result != null) {
      const [data] = result
      companiesArray.value = data
    } else {
      companiesArray.value = []
    }
  } catch (error: any) {
    empty.value = true
    notifs.addNotification(error, NotificationType.danger)
  }
}

const companyIds = ref<string[]>([])
const OfficeCompanies = ref<CompanyOffice[]>([])

async function loadSelectedCompanies() {
  if (!props.currentOffice?.id) return
  const result = await getOfficeCompanies(props.currentOffice.id)
  if (result) {
    companyIds.value = result.map((d) => d.company_id)
    OfficeCompanies.value = result
  } else {
    companyIds.value = []
    OfficeCompanies.value = []
  }
}

const schema = yup.object({
  name: yup
    .string()
    .required('Įveskite ofiso pavadinimą')
    .max(50, 'Pavadinimas per ilgas. Max. 50 simboliai')
    .trim(),
  street: yup
    .string()
    .required('Įveskite gatvę')
    .max(50, 'Gatvė per ilga. Max. 50 simboliai')
    .trim(),
  street_number: yup
    .string()
    .required('Įveskite pastato numerį')
    .max(30, 'Pastato numeris per ilgas. Max. 30 simboliai')
    .trim(),
  city: yup
    .string()
    .required('Įveskite miestą')
    .max(60, 'Miesto pavadinimas per ilgas. Max. 60 simboliai')
    .matches(regexExpressionStringAndNumbers, 'Negalimi specialūs simboliai')
    .trim(),
  country: yup
    .string()
    .required('Įveskite šalį')
    .max(60, 'Miesto pavadinimas per ilgas. Max. 60 simboliai')
    .matches(regexExpressionString, 'Negalimi skaičiai ir specialūs simboliai')
    .trim(),
  companies: yup
    .array()
    .required()
    .min(1, 'Pasirinkite bent vieną įmonę')
    .of(yup.string().required()),
})

const { defineField, errors, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    name: props.currentOffice?.name,
    street: props.currentOffice?.street,
    street_number: props.currentOffice?.street_number,
    city: props.currentOffice?.city,
    country: props.currentOffice?.country,
    companies: companyIds.value,
  },
})

const [name, nameAttrs] = defineField('name')
const [street, streetAttrs] = defineField('street')

const [street_number, street_numberAttrs] = defineField('street_number')

const [city, cityAttrs] = defineField('city')

const [country, countryAttrs] = defineField('country')

const [companies, companiesAttrs] = defineField('companies')

const notifs = useNotificationStore()

const emit = defineEmits(['close-pressed'])

const onSubmit = handleSubmit(async () => {
  try {
    if (name.value == undefined) return
    if (street.value == undefined) return
    if (street_number.value == undefined) return
    if (city.value == undefined) return
    if (country.value == undefined) return

    const formDataToAdd = new FormData()
    const formDataToDelete = new FormData()

    const equalCompanyArrays = _.isEmpty(_.xor(companies.value, companyIds.value))

    if (
      street.value?.trim() == props.currentOffice?.street &&
      street_number.value?.trim() == props.currentOffice?.street_number &&
      country.value?.trim() == props.currentOffice?.country &&
      city.value?.trim() == props.currentOffice?.city &&
      name.value?.trim() == props.currentOffice?.name &&
      equalCompanyArrays
    ) {
      emit('close-pressed', true)
      return
    }

    if (!equalCompanyArrays) {
      const relationsToAdd = companies.value.filter((id) => !companyIds.value.includes(id))
      relationsToAdd.forEach((companyId: number | string) => {
        formDataToAdd.append('company_id', companyId.toString())
      })
      //Rasti kurie isimti
      const removedDepartmentIds = companyIds.value.filter((id) => !companies.value.includes(id))
      //rasti kuriuos relation lenteles panaikinti
      const relationIdsToDelete = OfficeCompanies.value
        .filter((rel) => removedDepartmentIds.includes(rel.company_id))
        .map((rel) => rel.id)

      relationIdsToDelete.forEach((id: string) => {
        formDataToDelete.append('id', id)
      })

      if (!formDataToAdd.entries().next().done) {
        await updateAddOfficeCompanies(formDataToAdd, props.currentOffice?.id)
      }
      if (!formDataToDelete.entries().next().done) {
        await updateDeleteOfficeCompanies(formDataToDelete)
      }
    }

    if (
      name.value?.trim() !== props.currentOffice?.name ||
      street.value?.trim() !== props.currentOffice?.street ||
      street_number.value?.trim() !== props.currentOffice?.street_number ||
      city.value?.trim() !== props.currentOffice?.city ||
      country.value?.trim() !== props.currentOffice?.country
    ) {
      const detailsFormData = new FormData()
      detailsFormData.append('name', name.value.trim())
      detailsFormData.append('street', street.value.trim())
      detailsFormData.append('street_number', street_number.value.trim())
      detailsFormData.append('city', city.value.trim())
      detailsFormData.append('country', country.value.trim())

      await updateOfficeDetails(detailsFormData, props.currentOffice?.id)
    }

    notifs.addNotification('Ofisas sėkmingai atnaujintas', NotificationType.success)
    emit('close-pressed')
  } catch (error: any) {
    notifs.addNotification(error, NotificationType.danger)
  }
})

onMounted(async () => {
  await loadData()

  if (props.currentOffice) {
    await loadSelectedCompanies()

    resetForm({
      values: {
        name: props.currentOffice?.name || '',
        street: props.currentOffice?.street || '',
        street_number: props.currentOffice?.street_number || '',
        city: props.currentOffice?.city || '',
        country: props.currentOffice?.country || '',
        companies: companyIds.value || [],
      },
    })
  }
})
</script>

<template>
  <div class="sm:items-start m-5">
    <form @submit.prevent="onSubmit">
      <p class="text-2xl">Pridėti naują ofisą:</p>
      <div class="grid sm:grid-cols-1 md:grid-cols-2 pr-50">
        <div class="mr-40 space-y-1 mt-10 w-full">
          <label for="name" class="block text-gray-500 text-sm">Ofiso pavadinimas:</label>
          <input
            type="name"
            id="name"
            placeholder="Įveskite ofiso pavadinimą..."
            v-model="name"
            maxlength="50"
            v-bind="nameAttrs"
            class="w-full bg-gray-100 placeholder:text-gray-400 text-slate-700 text-sm border border-slate-200 rounded-xs pl-2 pr-3 py-2 transition duration-300 ease"
          />
          <p class="text-red-500">{{ errors.name }}</p>
          <label for="street" class="block text-gray-500 text-sm">Gatvė:</label>
          <input
            type="street"
            id="street"
            placeholder="Įveskite gatvės pavadinimą..."
            v-model="street"
            maxlength="50"
            v-bind="streetAttrs"
            class="w-full bg-gray-100 placeholder:text-gray-400 text-slate-700 text-sm border border-slate-200 rounded-xs pl-2 pr-3 py-2 transition duration-300 ease"
          />
          <p class="text-red-500">{{ errors.street }}</p>
          <label for="street_number" class="block text-gray-500 text-sm">Pastato numeris:</label>
          <input
            type="street_number"
            id="street_number"
            placeholder="Įveskite pastato numerį..."
            v-model="street_number"
            maxlength="30"
            v-bind="street_numberAttrs"
            class="w-full bg-gray-100 placeholder:text-gray-400 text-slate-700 text-sm border border-slate-200 rounded-xs pl-2 pr-3 py-2 transition duration-300 ease"
          />
          <p class="text-red-500">{{ errors.street_number }}</p>
          <label for="city" class="block text-gray-500 text-sm">Miestas:</label>
          <input
            type="city"
            id="city"
            placeholder="Įveskite miestą..."
            v-model="city"
            maxlength="60"
            v-bind="cityAttrs"
            class="w-full bg-gray-100 placeholder:text-gray-400 text-slate-700 text-sm border border-slate-200 rounded-xs pl-2 pr-3 py-2 transition duration-300 ease"
          />
          <p class="text-red-500">{{ errors.city }}</p>
          <label for="country" class="block text-gray-500 text-sm">Šalis:</label>
          <input
            type="country"
            id="country"
            placeholder="Įveskite šalį..."
            v-model="country"
            maxlength="60"
            v-bind="countryAttrs"
            class="w-full bg-gray-100 placeholder:text-gray-400 text-slate-700 text-sm border border-slate-200 rounded-xs pl-2 pr-3 py-2 transition duration-300 ease"
          />
          <p class="text-red-500">{{ errors.country }}</p>
          <button
            class="h-7 w-45 mt-10 bg-button-blue text-white text-xs rounded-xs hover:bg-blue-800"
          >
            Pridėti
          </button>
        </div>
        <div class="ml-10">
          <label class="block text-gray-500 text-sm mb-2 mt-20">Įmonės:</label>
          <div class="space-y-1 overflow-y-scroll h-50 w-70">
            <div
              v-for="company in companiesArray"
              :key="company.id"
              class="flex items-center space-x-2 select-none"
            >
              <input
                type="checkbox"
                :id="'company-' + company.id"
                :value="company.id"
                v-model="companies"
                class="hidden peer"
              />
              <label
                :for="'company-' + company.id"
                class="text-sm text-black bg-gray-100 peer-checked:bg-blue-700 w-70 h-10 text-center items-center justify justify-center flex"
              >
                {{ company.name }}
              </label>
            </div>
          </div>
          <p class="text-red-500 text-sm mt-1">{{ errors.companies }}</p>
        </div>
      </div>
    </form>
  </div>
  <ModalCloseButton :isDeleteModal="false" @close-modal="emit('close-pressed', true)" />
</template>
