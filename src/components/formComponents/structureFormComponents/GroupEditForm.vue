<script setup lang="ts">
import ModalCloseButton from '@/components/modalComponents/ModalCloseButton.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/typings/interface/NotificationType'
import { onMounted, ref } from 'vue'
import { getDepartments } from '@/services/departmentService'
import type { Department } from '@/typings/interface/Department'
import {
  getGroup,
  getGroupsDepartments,
  updateAddGroupDepartments,
  updateDeleteGroupDepartments,
  updateGroupName,
} from '@/services/groupService'
import type { Group } from '@/typings/interface/Group'
import type { DepartmentGroup } from '@/typings/interface/DepartmentGroup'
import _ from 'lodash'

const props = defineProps<{
  currentGroup: Group | null
}>()

const notifs = useNotificationStore()
const emit = defineEmits(['close-pressed'])
const empty = ref<boolean>(false)
const currentPage = ref<number>(1)
const departmentArray = ref<Department[]>([])
const departmentIds = ref<string[]>([])
const GroupDepartments = ref<DepartmentGroup[]>([])

async function loadData() {
  try {
    const result = await getDepartments(currentPage.value, 30)
    if (result != null) {
      const [data] = result
      departmentArray.value = data
    } else {
      departmentArray.value = []
    }
  } catch (error: any) {
    empty.value = true
    notifs.addNotification(error, NotificationType.danger)
  }
}

async function loadSelectedDepartments() {
  if (!props.currentGroup?.id) return
  const result = await getGroupsDepartments(props.currentGroup.id)
  if (result) {
    departmentIds.value = result.map((d) => d.department_id)
    GroupDepartments.value = result
  } else {
    departmentIds.value = []
    GroupDepartments.value = []
  }
}

const schema = yup.object({
  name: yup
    .string()
    .required('Įveskite grupės pavadinimą')
    .max(50, 'Pavadinimas per ilgas. Max. 50 simboliai')
    .trim(),
  departments: yup
    .array()
    .required()
    .min(1, 'Pasirinkite bent vieną skyrių')
    .of(yup.string().required()),
})

const { defineField, errors, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    name: props.currentGroup?.name,
    departments: departmentIds.value,
  },
})

const [name, nameAttrs] = defineField('name')
const [departments, departmentsAttrs] = defineField('departments')

const onSubmit = handleSubmit(async () => {
  try {
    if (name.value == undefined) return

    const result = await getGroup(name.value)
    if (result.length > 0 && props.currentGroup?.name != name.value) {
      notifs.addNotification(
        `Klaida: ${name.value} redaguoti nepavyko. Tokia grupė jau egzistuoja`,
        NotificationType.danger,
      )
      return
    }
    const formDataToAdd = new FormData()
    const formDataToDelete = new FormData()

    const equalDepartmentArrays = _.isEmpty(_.xor(departments.value, departmentIds.value))

    if (name.value.trim() == props.currentGroup?.name && equalDepartmentArrays) {
      emit('close-pressed', true)
      return
    }

    if (!equalDepartmentArrays) {
      const relationsToAdd = departments.value.filter((id) => !departmentIds.value.includes(id))
      relationsToAdd.forEach((departmentId: number | string) => {
        formDataToAdd.append('department_id', departmentId.toString())
      })
      //Rasti kurie isimti
      const removedDepartmentIds = departmentIds.value.filter(
        (id) => !departments.value.includes(id),
      )
      //rasti kuriuos relation lenteles panaikinti
      const relationIdsToDelete = GroupDepartments.value
        .filter((rel) => removedDepartmentIds.includes(rel.department_id))
        .map((rel) => rel.id)

      relationIdsToDelete.forEach((id: string) => {
        formDataToDelete.append('id', id)
      })

      if (!formDataToAdd.entries().next().done) {
        await updateAddGroupDepartments(formDataToAdd, props.currentGroup?.id)
      }
      if (!formDataToDelete.entries().next().done) {
        await updateDeleteGroupDepartments(formDataToDelete)
      }
    }

    if (name.value.trim() !== props.currentGroup?.name) {
      await updateGroupName(name.value.trim(), props.currentGroup?.id)
    }

    notifs.addNotification('Grupė sėkmingai atnaujinta', NotificationType.success)
    emit('close-pressed')
  } catch (error: any) {
    notifs.addNotification(
      `Klaida: ${props.currentGroup?.name} redaguoti nepavyko.`,
      NotificationType.danger,
    )
  }
})

onMounted(async () => {
  await loadData()

  if (props.currentGroup) {
    await loadSelectedDepartments()

    resetForm({
      values: {
        name: props.currentGroup.name || '',
        departments: departmentIds.value,
      },
    })
  }
})
</script>

<template>
  <div class="sm:items-start m-5">
    <form @submit.prevent="onSubmit">
      <p class="text-2xl">Redaguoti grupę:</p>
      <div class="grid sm:grid-cols-1 md:grid-cols-2 pr-50">
        <div class="mr-40 space-y-5 mt-10 w-full">
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
            Redaguoti
          </button>
        </div>
        <div class="ml-10">
          <label class="block text-gray-500 text-sm mb-2">Pasirinkite skyrius:</label>
          <div class="space-y-1 overflow-y-scroll h-50 w-70">
            <div
              v-for="department in departmentArray"
              :key="department.id"
              class="flex items-center space-x-2 select-none"
            >
              <input
                type="checkbox"
                :id="'division-' + department.id"
                :value="department.id"
                v-model="departments"
                class="hidden peer"
              />
              <label
                :for="'division-' + department.id"
                class="text-sm text-black bg-gray-100 peer-checked:bg-blue-700 w-70 h-10 text-center items-center justify justify-center flex"
              >
                {{ department.name }}
              </label>
            </div>
          </div>
          <p class="text-red-500 text-sm mt-1">{{ errors.departments }}</p>
        </div>
      </div>
    </form>
  </div>
  <ModalCloseButton :isDeleteModal="false" @close-modal="emit('close-pressed', true)" />
</template>
