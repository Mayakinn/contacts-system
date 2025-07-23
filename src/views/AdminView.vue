<script lang="ts" setup>
import FormModal from '@/components/modalComponents/FormModal.vue'
import { shallowRef, ref, type Component } from 'vue'
const adminId = ref<number>(0)

const currentForm = shallowRef<Component>()
const formModalActive = ref(false)

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
  <button @click="OpenModal">Press for modal</button>
  <FormModal :isActive="formModalActive" @close-modal="closeModal">
    <component
      @close-pressed="closeModalAfterForm"
      :is="currentForm"
      :adminId="adminId"
    ></component>
  </FormModal>
  <div>Admin management page</div>
</template>
