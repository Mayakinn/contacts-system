<script lang="ts" setup>
import DepartmentCreateForm from '@/components/formComponents/structureFormComponents/DepartmentCreateForm.vue'
import DivisionCreateForm from '@/components/formComponents/structureFormComponents/DivisionCreateForm.vue'
import GroupCreateForm from '@/components/formComponents/structureFormComponents/GroupCreateForm.vue'
import OfficeCreateForm from '@/components/formComponents/structureFormComponents/OfficeCreateForm.vue'
import FormModal from '@/components/modalComponents/FormModal.vue'
import router from '@/router'
import { useAuthStore } from '@/stores/authStore'
import { computed, ref, shallowRef, type Component } from 'vue'
import { useRoute } from 'vue-router'

const empty = ref<boolean>(false)
const loading = ref<boolean>(false)
const currentForm = shallowRef<Component>()
const formModalActive = ref<boolean>(false)
const refreshKey = ref<number>(0)
const route = useRoute()

const chosenStructure = ref<string>('')

function onStructureChange() {
  router.push(`/structures/${chosenStructure.value}`)
}

const activeStructure = computed(() => {
  switch (route.path) {
    case '/structures/offices':
      return 'offices'
    case '/structures/departments':
      return 'departments'
    case '/structures/divisions':
      return 'divisions'
    case '/structures/groups':
      return 'groups'
    default:
      return ''
  }
})

function closeModalAfterForm(flag: boolean) {
  formModalActive.value = false

  if (flag) {
    return
  } else {
    refreshKey.value += 1
  }
}

function OpenModal() {
  formModalActive.value = true
}

const closeModal = () => {
  formModalActive.value = false
  currentForm.value = undefined
}
function changeForm(newCreateForm: Component) {
  currentForm.value = newCreateForm
}
const auth = useAuthStore()
</script>
<template>
  <div class="m-10 space-y-10">
    <p class="text-5xl font-light">Struktūra</p>
    <div
      class="flex space-x-10"
      v-if="
        (currentForm == OfficeCreateForm && auth.User?.expand?.permissions_id?.edit_offices) ||
        ((currentForm == GroupCreateForm ||
          currentForm == DepartmentCreateForm ||
          currentForm == DivisionCreateForm) &&
          auth.User?.expand?.permissions_id?.edit_structure)
      "
    >
      <button
        class="w-10 h-10 bg-button-blue rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-500"
        @click="OpenModal"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="30" height="30">
          <path
            fill="white"
            d="M10.75 5.75c0-.414-.336-.75-.75-.75s-.75.336-.75.75v3.5h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5Z"
          />
        </svg>
      </button>
      <p class="flex items-center justify-center">Pridėti naują struktūrą</p>
    </div>
    <div class="flex space-x-5">
      <input
        type="radio"
        id="offices"
        value="offices"
        hidden
        v-model="chosenStructure"
        @change="onStructureChange"
      />
      <label
        for="offices"
        class="py-3 w-30 rounded-xl border text-center"
        :class="{
          'bg-white text-button-blue border-button-blue': activeStructure === 'offices',
          'bg-button-blue text-white hover:bg-white hover:text-button-blue':
            activeStructure !== 'offices',
        }"
      >
        Ofisai
      </label>

      <input
        type="radio"
        id="divisions"
        value="divisions"
        hidden
        v-model="chosenStructure"
        @change="onStructureChange"
      />
      <label
        for="divisions"
        class="py-3 w-30 rounded-xl border text-center"
        :class="{
          'bg-white text-button-blue border-button-blue': activeStructure === 'divisions',
          'bg-button-blue text-white hover:bg-white hover:text-button-blue':
            activeStructure !== 'divisions',
        }"
        >Padaliniai</label
      >
      <input
        type="radio"
        id="departments"
        value="departments"
        hidden
        v-model="chosenStructure"
        @change="onStructureChange"
      />
      <label
        for="departments"
        class="py-3 w-30 rounded-xl border text-center"
        :class="{
          'bg-white text-button-blue border-button-blue': activeStructure === 'departments',
          'bg-button-blue text-white hover:bg-white hover:text-button-blue':
            activeStructure !== 'departments',
        }"
        >Skyriai</label
      >
      <input
        type="radio"
        id="groups"
        value="groups"
        hidden
        v-model="chosenStructure"
        @change="onStructureChange"
      />
      <label
        for="groups"
        class="py-3 w-30 rounded-xl border text-center"
        :class="{
          'bg-white text-button-blue border-button-blue': activeStructure === 'groups',
          'bg-button-blue text-white hover:bg-white hover:text-button-blue':
            activeStructure !== 'groups',
        }"
        >Grupės</label
      >
    </div>
    <div v-if="empty" class="text-3xl ml-24 mt-10">Sąrašas tusčias</div>
    <div v-else-if="loading" class="text-3xl ml-24 mt-10">Kraunama...</div>
    <div v-else>
      <div class="mb-10">
        <RouterView @change-create-form="changeForm" :key="refreshKey" />
      </div>
    </div>
  </div>
  <FormModal :isActive="formModalActive" @close-modal="closeModal">
    <component
      @close-pressed="closeModalAfterForm"
      :is="currentForm"
      :key="currentForm"
    ></component>
  </FormModal>
</template>
