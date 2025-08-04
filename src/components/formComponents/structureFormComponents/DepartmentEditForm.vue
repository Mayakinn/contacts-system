<script setup lang="ts">
import ModalCloseButton from '@/components/modalComponents/ModalCloseButton.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/typings/interface/NotificationType'
import { onMounted, ref } from 'vue'
import _ from 'lodash'
import { getDivisions } from '@/services/divisionService'
import type { Division } from '@/typings/interface/Division'
import {
  getDepartment,
  getDepartmentDivisions,
  updateAddDepartmentDivisions,
  updateDeleteDepartmentDivisions,
  updateDepartmentName,
} from '@/services/departmentService'
import type { Department } from '@/typings/interface/Department'
import type { DivisionDepartment } from '@/typings/interface/DivisionDepartment'

const props = defineProps<{
  currentDepartment: Department | null
}>()

const empty = ref<boolean>(false)
const currentPage = ref<number>(1)
const divisionArray = ref<Division[]>([])
const DivisionDepartments = ref<DivisionDepartment[]>([])
const divisionIds = ref<string[]>([])

async function loadData() {
  try {
    const result = await getDivisions(currentPage.value, 30)
    if (result != null) {
      const [data] = result
      divisionArray.value = data
    } else {
      divisionArray.value = []
    }
  } catch (error: any) {
    empty.value = true
    notifs.addNotification(error, NotificationType.danger)
  }
}

async function loadSelectedDivisions() {
  if (!props.currentDepartment?.id) return
  const result = await getDepartmentDivisions(props.currentDepartment.id)
  if (result) {
    divisionIds.value = result.map((d) => d.division_id)
    DivisionDepartments.value = result
  } else {
    divisionIds.value = []
    DivisionDepartments.value = []
  }
}

const schema = yup.object({
  name: yup
    .string()
    .required('Įveskite skyriaus pavadinimą')
    .max(50, 'Pavadinimas per ilgas. Max. 50 simboliai')
    .trim(),
  divisions: yup
    .array()
    .required()
    .min(1, 'Pasirinkite bent vieną padalinį')
    .of(yup.string().required()),
})

const { defineField, errors, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    name: props.currentDepartment?.name,
    divisions: divisionIds.value,
  },
})

const [name, nameAttrs] = defineField('name')
const [divisions, divisionsAttrs] = defineField('divisions')

const notifs = useNotificationStore()

const emit = defineEmits(['close-pressed'])

const onSubmit = handleSubmit(async () => {
  try {
    if (name.value == undefined) return

    const formDataToAdd = new FormData()
    const formDataToDelete = new FormData()
    const result = await getDepartment(name.value)
    if (result.length > 0 && props.currentDepartment?.name != name.value) {
      notifs.addNotification(
        `Klaida: ${name.value} redaguoti nepavyko. Skyrius tokiu pavadinimu jau egzistuoja`,
        NotificationType.danger,
      )
      return
    }
    const equalDivisionArrays = _.isEmpty(_.xor(divisions.value, divisionIds.value))

    if (name.value.trim() == props.currentDepartment?.name && equalDivisionArrays) {
      emit('close-pressed', true)
      return
    }

    if (!equalDivisionArrays) {
      const relationsToAdd = divisions.value.filter((id) => !divisionIds.value.includes(id))
      relationsToAdd.forEach((divisionsId: number | string) => {
        formDataToAdd.append('division_id', divisionsId.toString())
      })
      //Rasti kurie isimti
      const removedDivisionIds = divisionIds.value.filter((id) => !divisions.value.includes(id))
      //rasti kuriuos relation lenteles panaikinti
      const relationIdsToDelete = DivisionDepartments.value
        .filter((rel) => removedDivisionIds.includes(rel.division_id))
        .map((rel) => rel.id)

      relationIdsToDelete.forEach((id: string) => {
        formDataToDelete.append('id', id)
      })

      if (!formDataToAdd.entries().next().done) {
        await updateAddDepartmentDivisions(formDataToAdd, props.currentDepartment?.id)
      }
      if (!formDataToDelete.entries().next().done) {
        await updateDeleteDepartmentDivisions(formDataToDelete)
      }
    }

    if (name.value.trim() !== props.currentDepartment?.name) {
      await updateDepartmentName(name.value.trim(), props.currentDepartment?.id)
    }

    notifs.addNotification('Skyrius sėkmingai atnaujintas', NotificationType.success)
    emit('close-pressed')
  } catch (error: any) {
    notifs.addNotification(
      `Klaida: ${props.currentDepartment?.name} redaguoti nepavyko.`,
      NotificationType.danger,
    )
  }
})

onMounted(async () => {
  await loadData()

  if (props.currentDepartment) {
    await loadSelectedDivisions()

    resetForm({
      values: {
        name: props.currentDepartment.name || '',
        divisions: divisionIds.value,
      },
    })
  }
})
</script>

<template>
  <div class="sm:items-start m-5">
    <form @submit.prevent="onSubmit">
      <p class="text-2xl">Redaguoti skyrių:</p>
      <div class="grid sm:grid-cols-1 md:grid-cols-2 pr-50">
        <div class="mr-40 space-y-5 mt-10 w-full">
          <label for="name" class="block text-gray-500 text-sm">Skyrio pavadinimas:</label>
          <input
            type="name"
            id="name"
            placeholder="Įveskite skyriaus pavadinimą..."
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
          <label class="block text-gray-500 text-sm mb-2">Pasirinkite padalinius:</label>
          <div class="space-y-1 overflow-y-scroll h-50 w-70">
            <div
              v-for="division in divisionArray"
              :key="division.id"
              class="flex items-center space-x-2 select-none"
            >
              <input
                type="checkbox"
                :id="'division-' + division.id"
                :value="division.id"
                v-model="divisions"
                class="hidden peer"
              />
              <label
                :for="'division-' + division.id"
                class="text-sm text-black bg-gray-100 peer-checked:bg-blue-700 w-70 h-10 text-center items-center justify justify-center flex"
              >
                {{ division.name }}
              </label>
            </div>
          </div>
          <p class="text-red-500 text-sm mt-1">{{ errors.divisions }}</p>
        </div>
      </div>
    </form>
  </div>
  <ModalCloseButton :isDeleteModal="false" @close-modal="emit('close-pressed', true)" />
</template>
