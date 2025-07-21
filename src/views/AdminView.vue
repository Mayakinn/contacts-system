<script lang="ts" setup>
import AdminTableList from '@/components/adminComponents/AdminTableList.vue'
import FormModal from '@/components/modalComponents/FormModal.vue'
import type { User } from '@/typings/interface/User'
import { shallowRef, ref, type Component } from 'vue'
const adminId = ref<number>(0)

const currentForm = shallowRef<Component>()
const formModalActive = ref(false)
const users = ref<User[]>()

const closeModal = () => {
  formModalActive.value = false
  adminId.value = 0
}

function closeModalAfterForm(flag: boolean) {
  formModalActive.value = false
  adminId.value = 0
}

function OpenModal() {
  formModalActive.value = true
}
</script>

<template>
  <FormModal :isActive="formModalActive" @close-modal="closeModal">
    <component
      @close-pressed="closeModalAfterForm"
      :is="currentForm"
      :adminId="adminId"
    ></component>
  </FormModal>
  <div class="m-10 space-y-10">
    <p class="text-5xl font-light">Admin paskyros</p>
    <div class="flex space-x-10">
      <button
        class="w-10 h-10 bg-button-blue rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="30" height="30">
          <path
            fill="white"
            d="M10.75 5.75c0-.414-.336-.75-.75-.75s-.75.336-.75.75v3.5h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5Z"
          />
        </svg>
      </button>
      <p class="flex items-center justify-center">Sukurti naują admin paskyrą</p>
    </div>
    <AdminTableList :users="users" />
  </div>
</template>
