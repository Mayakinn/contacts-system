<script setup lang="ts">
import { getCompanies } from '@/services/companiesService'
import { getDepartments } from '@/services/departmentService'
import { getDivisions } from '@/services/divisionService'
import { getGroups } from '@/services/groupService'
import { getOffices } from '@/services/officeService'
import type { Company } from '@/typings/interface/Company'
import type { CompanyOffice } from '@/typings/interface/CompanyOffice'
import type { DepartmentGroup } from '@/typings/interface/DepartmentGroup'
import type { DivisionDepartment } from '@/typings/interface/DivisionDepartment'
import type { OfficeDivision } from '@/typings/interface/OfficeDivision'
import { computed, onMounted, ref, watch } from 'vue'
import FilterSelect from './FilterSelect.vue'

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

const mappedCompanies = computed(() =>
  companies.value.map((company) => ({ id: company.id, name: company.name })),
)

const mappedOffices = computed(() =>
  companyOffices.value.map((office) => ({
    id: office.expand?.office_id?.id,
    name: office.expand?.office_id?.name || 'Nežinomas ofisas',
  })),
)

const mappedDivisions = computed(() =>
  officeDivisions.value.map((division) => ({
    id: division.expand?.division_id?.id,
    name: division.expand?.division_id?.name || 'Nežinomas skyrius',
  })),
)

const mappedDepartments = computed(() =>
  divisionDepartments.value.map((department) => ({
    id: department.expand?.department_id?.id,
    name: department.expand?.department_id?.name || 'Nežinomas padalinys',
  })),
)

const mappedGroups = computed(() =>
  departmentGroups.value.map((group) => ({
    id: group.expand?.group_id?.id,
    name: group.expand?.group_id?.name || 'Nežinoma grupė',
  })),
)

const emit = defineEmits(['filter-change', 'error-received'])

const recievedError = ref<boolean>(false)

const filterParamMap = computed(() => {
  const filters: Record<string, string> = {}

  if (chosenCompany.value && chosenCompany.value !== '') {
    filters['company_id'] = chosenCompany.value
  }
  if (chosenOffice.value && chosenOffice.value !== '') {
    filters['office_id'] = chosenOffice.value
  }
  if (chosenDivision.value && chosenDivision.value !== '') {
    filters['division_id'] = chosenDivision.value
  }
  if (chosenDepartment.value && chosenDepartment.value !== '') {
    filters['department_id'] = chosenDepartment.value
  }
  if (chosenGroup.value && chosenGroup.value !== '') {
    filters['group_id'] = chosenGroup.value
  }

  return filters
})

onMounted(async () => {
  try {
    companies.value = await getCompanies()
  } catch (error: any) {
    emit('error-received', error)
    recievedError.value = true
  }
})

watch(
  filterParamMap,
  (newFilters) => {
    try {
      emit('filter-change', { ...newFilters })
    } catch (error) {
      emit('error-received', error)
      recievedError.value = true
    }
  },
  { deep: true },
)

async function onCompanyValueChange(value: string) {
  try {
    chosenCompany.value = value
    chosenOffice.value = ''
    chosenDivision.value = ''
    chosenDepartment.value = ''
    chosenGroup.value = ''

    companyOffices.value = await getOffices(value)
    officeDivisions.value = []
    divisionDepartments.value = []
    departmentGroups.value = []
  } catch (error: any) {
    emit('error-received', error)
    recievedError.value = true
  }
}

async function onOfficeValueChange(value: string) {
  try {
    chosenOffice.value = value
    chosenDivision.value = ''
    chosenDepartment.value = ''
    chosenGroup.value = ''

    officeDivisions.value = await getDivisions(value)
    divisionDepartments.value = []
    departmentGroups.value = []
  } catch (error: any) {
    emit('error-received', error)
    recievedError.value = true
  }
}

async function onDivisionValueChange(value: string) {
  try {
    chosenDivision.value = value
    chosenDepartment.value = ''
    chosenGroup.value = ''

    divisionDepartments.value = await getDepartments(value)
    departmentGroups.value = []
  } catch (error: any) {
    emit('error-received', error)
    recievedError.value = true
  }
}

async function onDepartmentValueChange(value: string) {
  try {
    chosenDepartment.value = value
    departmentGroups.value = await getGroups(value)
  } catch (error: any) {
    emit('error-received', error)
    recievedError.value = true
  }
}

async function onGroupValueChange(value: string) {
  try {
    chosenGroup.value = value
  } catch (error: any) {
    emit('error-received', error)
    recievedError.value = true
  }
}
</script>

<template>
  <div class="flex flex-wrap gap-10 font-light">
    <FilterSelect
      label="Įmonė"
      :options="mappedCompanies"
      :placeholder="'Filtruoti įmones...'"
      v-model="chosenCompany"
      :isDisabled="recievedError"
      @update:modelValue="onCompanyValueChange"
    />

    <FilterSelect
      label="Ofisas"
      :options="mappedOffices"
      :placeholder="'Filtruoti ofisus...'"
      v-model="chosenOffice"
      :isDisabled="recievedError"
      @update:modelValue="onOfficeValueChange"
    />

    <FilterSelect
      label="Padalinys"
      :options="mappedDivisions"
      :placeholder="'Filtruoti padalinius...'"
      v-model="chosenDivision"
      :isDisabled="recievedError"
      @update:modelValue="onDivisionValueChange"
    />

    <FilterSelect
      label="Skyrius"
      :options="mappedDepartments"
      :placeholder="'Filtruoti skyrius...'"
      v-model="chosenDepartment"
      :isDisabled="recievedError"
      @update:modelValue="onDepartmentValueChange"
    />

    <FilterSelect
      label="Grupė"
      :options="mappedGroups"
      :placeholder="'Filtruoti grupes...'"
      v-model="chosenGroup"
      :isDisabled="recievedError"
      @update:modelValue="onGroupValueChange"
    />
  </div>
</template>
