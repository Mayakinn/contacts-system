<script lang="ts" setup>
import router from '@/router'
import { ref } from 'vue'

const empty = ref<boolean>(false)
const loading = ref<boolean>(false)

const officeChosen = ref<boolean>(false)
const departmentChosen = ref<boolean>(false)
const divisionChosen = ref<boolean>(false)
const groupChosen = ref<boolean>(false)
function onStructureChange() {
  officeChosen.value = false
  departmentChosen.value = false
  divisionChosen.value = false
  groupChosen.value = false

  if (chosenStructure.value === 'Office') {
    officeChosen.value = true
    router.push('/structures/offices')
  } else if (chosenStructure.value === 'Department') {
    departmentChosen.value = true
    router.push('/structures/departments')
  } else if (chosenStructure.value === 'Division') {
    divisionChosen.value = true
    router.push('/structures/divisions')
  } else if (chosenStructure.value === 'Group') {
    router.push('/structures/groups')
    groupChosen.value = true
  }
}

const chosenStructure = ref('')
</script>
<template>
  <div class="m-10 space-y-10">
    <p class="text-5xl font-light">Struktūra</p>
    <div class="flex space-x-10">
      <button
        class="w-10 h-10 bg-button-blue rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-500"
        @click="">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="30" height="30">
          <path fill="white"
            d="M10.75 5.75c0-.414-.336-.75-.75-.75s-.75.336-.75.75v3.5h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5Z" />
        </svg>
      </button>
      <p class="flex items-center justify-center">Pridėti naują struktūrą</p>
    </div>
    <div class="flex space-x-5">
      <input type="radio" id="Office" value="Office" hidden v-model="chosenStructure" @change="onStructureChange" />
      <label for="Office" class="py-3 w-30 rounded-xl border text-center" :class="{
        'bg-white text-button-blue border-button-blue': officeChosen,
        'bg-button-blue text-white hover:bg-white hover:text-button-blue': !officeChosen,
      }">
        Ofisai
      </label>

      <input type="radio" id="Department" value="Department" hidden v-model="chosenStructure"
        @change="onStructureChange" />
      <label for="Department" class="py-3 w-30 rounded-xl border text-center" :class="{
        'bg-white text-button-blue border-button-blue': departmentChosen,
        'bg-button-blue text-white hover:bg-white hover:text-button-blue': !departmentChosen,
      }">Padaliniai</label>
      <input type="radio" id="Division" value="Division" hidden v-model="chosenStructure" @change="onStructureChange" />
      <label for="Division" class="py-3 w-30 rounded-xl border text-center" :class="{
        'bg-white text-button-blue border-button-blue': divisionChosen,
        'bg-button-blue text-white hover:bg-white hover:text-button-blue': !divisionChosen,
      }">Skyriai</label>
      <input type="radio" id="Group" value="Group" hidden v-model="chosenStructure" @change="onStructureChange" />
      <label for="Group" class="py-3 w-30 rounded-xl border text-center" :class="{
        'bg-white text-button-blue border-button-blue': groupChosen,
        'bg-button-blue text-white hover:bg-white hover:text-button-blue': !groupChosen,
      }">Grupės</label>
    </div>
    <div v-if="empty" class="text-3xl ml-24 mt-10">Sąrašas tusčias</div>
    <div v-else-if="loading" class="text-3xl ml-24 mt-10">Kraunama...</div>
    <div v-else></div>
    <RouterView />
  </div>
</template>