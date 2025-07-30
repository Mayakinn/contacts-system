<script setup lang="ts">
import ModalCloseButton from '@/components/modalComponents/ModalCloseButton.vue'
const emit = defineEmits(['close-pressed'])
</script>

<template>
  Pridėkite naują ofisą
  <ModalCloseButton :isDeleteModal="false" @close-modal="emit('close-pressed')" />
</template>
