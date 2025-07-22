<script lang="ts" setup>
import type { User } from '@/typings/interface/User'
import { onMounted, ref } from 'vue'
const props = defineProps<{
  currentAdmin: User | null
  users: User[]
}>()

const editCreateContacts = ref<boolean>(false)
const deleteContacts = ref<boolean>(false)
const createEditCompanies = ref<boolean>(false)
const deleteCompanies = ref<boolean>(false)
const createEditOffices = ref<boolean>(false)
const deleteOffices = ref<boolean>(false)
const createEditStructures = ref<boolean>(false)
const deleteStructures = ref<boolean>(false)

onMounted(() => {
    editCreateContacts.value = props.currentAdmin?.expand?.permissions_id?.edit_employees != undefined ? props.currentAdmin?.expand?.permissions_id?.edit_employees : false
})

</script>

<template>
  <div class="sm:items-start m-5">
    <form @submit.prevent="" >
      <h1 class="text-xl">Redaguoti paskyros teises:</h1>

        <div class="">
          <p class="mx-5 mt-10 mb-2">Administracinės teisės:</p>
          <div class="flex flex-col gap-4 text-md items-left">
            <div>
              <input type="checkbox" id="editCreateContacts" v-model="editCreateContacts"/>
              <label for="editCreateContacts"> Redaguoti ir kurti kontaktus</label>
            </div>
            <div>
              <input type="checkbox" id="deleteContacts" v-model="deleteContacts"/>
              <label for="deleteContacts"> Trinti kontaktus</label>
            </div>
            <div>
              <input type="checkbox" id="createEditCompanies" v-model="createEditCompanies"/>
              <label for="createEditCompanies"> Redaguoti ir kurti įmones</label>
            </div>
            <div>
              <input type="checkbox" id="deleteCompanies" v-model="deleteCompanies"/>
              <label for="deleteCompanies"> Trinti įmones</label>
            </div>
            <div>
              <input type="checkbox" id="createEditOffices" v-model="createEditOffices"/>
              <label for="createEditOffices"> Redaguoti ir kurti ofisus</label>
            </div>
            <div>
              <input type="checkbox" id="deleteOffices" v-model="deleteOffices"/>
              <label for="deleteOffices"> Trinti ofisus</label>
            </div>
            <div>
              <input type="checkbox" id="createEditStructures" v-model="createEditStructures"/>
              <label for="createEditStructures"> Redaguoti ir kurti struktūras</label>
            </div>
            <div>
              <input type="checkbox" id="deleteStructures" v-model="deleteStructures"/>
              <label for="deleteStructures"> Trinti struktūras</label>
            </div>
          </div>
        </div>

      <button
        class="h-7 w-45 bg-button-blue absolute right-5 bottom-5 text-white text-xs rounded-xs hover:bg-blue-800"
      >
        Atnaujinti
      </button @click=submit>
    </form>
  </div>

</template>