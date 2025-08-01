<script setup lang="ts">
import ModalCloseButton from '@/components/modalComponents/ModalCloseButton.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/typings/interface/NotificationType'
import { onMounted, ref } from 'vue'
import { getOffices } from '@/services/officeService'
import type { Office } from '@/typings/interface/Office'
import type { Division } from '@/typings/interface/Division'
import type { OfficeDivision } from '@/typings/interface/OfficeDivision'
import {
  getDivisionOffices,
  updateAddDivisionOffices,
  updateDeleteDivisionOffices,
  updateDivisionName,
} from '@/services/divisionService'
import _ from 'lodash'

const empty = ref<boolean>(false)
const currentPage = ref<number>(1)
const officeArray = ref<Office[]>([])

async function loadData() {
  try {
    const result = await getOffices(currentPage.value, 30)
    if (result != null) {
      const [data] = result
      officeArray.value = data
    } else {
      officeArray.value = []
    }
  } catch (error: any) {
    empty.value = true
    notifs.addNotification(error, NotificationType.danger)
  }
}
async function loadSelectedOffices() {
  if (!props.currentDivision?.id) return
  const result = await getDivisionOffices(props.currentDivision.id)
  if (result) {
    officeIds.value = result.map((d) => d.office_id)
    OfficeDivisions.value = result
  } else {
    officeIds.value = []
    OfficeDivisions.value = []
  }
}
const props = defineProps<{
  currentDivision: Division | null
}>()

const OfficeDivisions = ref<OfficeDivision[]>([])
const officeIds = ref<string[]>([])

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

const { defineField, errors, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    name: props.currentDivision?.name,
    offices: officeIds.value,
  },
})

const [name, nameAttrs] = defineField('name')
const [offices, officesAttrs] = defineField('offices')

const notifs = useNotificationStore()

const emit = defineEmits(['close-pressed'])

const onSubmit = handleSubmit(async () => {
  try {
    if (name.value == undefined) return

    const formDataToAdd = new FormData()
    const formDataToDelete = new FormData()

    const equalOfficeArrays = _.isEmpty(_.xor(offices.value, officeIds.value))

    if (name.value.trim() == props.currentDivision?.name && equalOfficeArrays) {
      emit('close-pressed', true)
      return
    }

    if (!equalOfficeArrays) {
      const relationsToAdd = offices.value.filter((id) => !officeIds.value.includes(id))
      relationsToAdd.forEach((officesId: number | string) => {
        formDataToAdd.append('office_id', officesId.toString())
      })
      //Rasti kurie isimti
      const removedOfficeIds = officeIds.value.filter((id) => !offices.value.includes(id))
      //rasti kuriuos relation lenteles panaikinti
      const relationIdsToDelete = OfficeDivisions.value
        .filter((rel) => removedOfficeIds.includes(rel.office_id))
        .map((rel) => rel.id)

      relationIdsToDelete.forEach((id: string) => {
        formDataToDelete.append('id', id)
      })

      if (!formDataToAdd.entries().next().done) {
        await updateAddDivisionOffices(formDataToAdd, props.currentDivision?.id)
      }
      if (!formDataToDelete.entries().next().done) {
        await updateDeleteDivisionOffices(formDataToDelete)
      }
    }

    if (name.value.trim() !== props.currentDivision?.name) {
      await updateDivisionName(name.value.trim(), props.currentDivision?.id)
    }

    notifs.addNotification('Padalinys sėkmingai atnaujintas', NotificationType.success)
    emit('close-pressed')
  } catch (error: any) {
    notifs.addNotification(error, NotificationType.danger)
  }
})

onMounted(async () => {
  await loadData()

  if (props.currentDivision) {
    await loadSelectedOffices()

    resetForm({
      values: {
        name: props.currentDivision.name || '',
        offices: officeIds.value,
      },
    })
  }
})
</script>

<template>
  <div class="sm:items-start m-5">
    <form @submit.prevent="onSubmit">
      <p class="text-2xl">Redaguoti padalinį:</p>
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
            Redaguoti
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
