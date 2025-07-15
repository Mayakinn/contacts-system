<script setup lang="ts">
import { getCompanies } from '@/services/companiesService'
import { getDepartments } from '@/services/departmentService'
import { getDivisions } from '@/services/divisionService'
import { getGroups } from '@/services/groupService'
import { getOffices } from '@/services/officeService'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Company } from '@/typings/interface/Company'
import type { CompanyOffice } from '@/typings/interface/CompanyOffice'
import type { DepartmentGroup } from '@/typings/interface/DepartmentGroup'
import type { DivisionDepartment } from '@/typings/interface/DivisionDepartment'
import { NotificationType } from '@/typings/interface/NotificationType'
import type { OfficeDivision } from '@/typings/interface/OfficeDivision'
import { computed, onMounted, ref } from 'vue'

const chosenCompany = ref<string>('')
const chosenOffice = ref<string>('')
const chosenDivision = ref<string>('')
const chosenDepartment = ref<string>('')
const chosenGroup = ref<string>('')

const companies = ref<Company[]>([])
const companyOffices = ref<CompanyOffice[]>([])
const officeDivisions = ref<OfficeDivision[]>([])
const divisionDepartments = ref<DivisionDepartment[]>([])
const departmentGroups = ref<DepartmentGroup[]>([])

const emit = defineEmits(['filter-change'])

const notifs = useNotificationStore()
const recievedError = ref<boolean>(false)

const filterParamString = computed(() => {
  const filters: string[] = []

  if (chosenCompany.value != '') {
    filters.push(`company_id='${chosenCompany.value}'`)
  }
  if (chosenOffice.value != '') {
    filters.push(`office_id='${chosenOffice.value}'`)
  }
  if (chosenDivision.value != '') {
    filters.push(`division_id='${chosenDivision.value}'`)
  }
  if (chosenDepartment.value != '') {
    filters.push(`department_id='${chosenDepartment.value}'`)
  }
  if (chosenGroup.value != '') {
    filters.push(`group_id='${chosenGroup.value}'`)
  }

  if (filters.length > 0) {
    return `(${filters.join(' && ')})`
  }

  return ''
})
async function onCompanyValueChange() {
  try {
    companyOffices.value = await getOffices(chosenCompany.value)
    chosenOffice.value = ''
    chosenDivision.value = ''
    chosenDepartment.value = ''
    chosenGroup.value = ''
    officeDivisions.value = []
    divisionDepartments.value = []
    departmentGroups.value = []
    emit('filter-change', filterParamString.value)
  } catch (error: any) {
    notifs.addNotification(error, NotificationType.danger)
    recievedError.value = true
  }
}
async function onOfficeValueChange() {
  try {
    officeDivisions.value = await getDivisions(chosenOffice.value)
    chosenDivision.value = ''
    chosenDepartment.value = ''
    chosenGroup.value = ''
    divisionDepartments.value = []
    departmentGroups.value = []
    emit('filter-change', filterParamString.value)
  } catch (error: any) {
    recievedError.value = true
    notifs.addNotification(error, NotificationType.danger)
  }
}

async function onDivisionValueChange() {
  try {
    divisionDepartments.value = await getDepartments(chosenDivision.value)
    chosenDepartment.value = ''
    chosenGroup.value = ''
    departmentGroups.value = []
    emit('filter-change', filterParamString.value)
  } catch (error: any) {
    notifs.addNotification(error, NotificationType.danger)
    recievedError.value = true
  }
}

async function onDepartmentValueChange() {
  try {
    departmentGroups.value = await getGroups(chosenDepartment.value)
    chosenGroup.value = ''
    emit('filter-change', filterParamString.value)
  } catch (error: any) {
    notifs.addNotification(error, NotificationType.danger)
    recievedError.value = true
  }
}

onMounted(async () => {
  try {
    companies.value = await getCompanies()
  } catch (error: any) {
    notifs.addNotification(error, NotificationType.danger)
    recievedError.value = true
  }
})
</script>

<template>
  <div class="flex flex-wrap gap-10 font-light">
    <div class="">
      <label class="block">Įmonė:</label>
      <select
        class="border rounded-sm w-55 border-gray-300 h-6 text-gray-500"
        v-model="chosenCompany"
        @change="onCompanyValueChange()"
        :disabled="recievedError"
      >
        <option value="" selected>Filtruoti įmones...</option>
        <option v-for="company in companies" :value="company.id">
          {{ company.name }}
        </option>
      </select>
    </div>
    <div>
      <label class="block">Ofisas:</label>
      <select
        class="border rounded-sm w-55 border-gray-300 h-6 text-gray-500"
        v-model="chosenOffice"
        @change="onOfficeValueChange()"
        :disabled="recievedError"
      >
        <option value="" selected>Filtruoti ofisus...</option>
        <option v-for="office in companyOffices" :value="office.expand?.office_id.id">
          {{ office.expand?.office_id.name }}
        </option>
      </select>
    </div>
    <div>
      <label class="block"> Padalinys: </label>
      <select
        class="border rounded-sm w-55 border-gray-300 h-6 text-gray-500"
        v-model="chosenDivision"
        @change="onDivisionValueChange()"
        :disabled="recievedError"
      >
        <option value="" selected>Filtruoti padalinius...</option>
        <option v-for="division in officeDivisions" :value="division.expand?.division_id.id">
          {{ division.expand?.division_id.name }}
        </option>
      </select>
    </div>

    <div>
      <label class="block"> Skyrius: </label>
      <select
        class="border rounded-sm w-65 border-gray-300 h-6 text-gray-500"
        v-model="chosenDepartment"
        @change="onDepartmentValueChange()"
        :disabled="recievedError"
      >
        <option value="" selected>Filtruoti skyrius...</option>
        <option
          v-for="department in divisionDepartments"
          :value="department.expand?.department_id.id"
        >
          {{ department.expand?.department_id.name }}
        </option>
      </select>
    </div>
    <div>
      <label class="block"> Grupė: </label>

      <select
        class="border rounded-sm w-55 border-gray-300 h-6 text-gray-500"
        v-model="chosenGroup"
        :disabled="recievedError"
      >
        <option value="" selected>Filtruoti grupes...</option>
        <option v-for="group in departmentGroups" :value="group.expand?.group_id.id">
          {{ group.expand?.group_id.name }}
        </option>
      </select>
    </div>
  </div>
</template>
