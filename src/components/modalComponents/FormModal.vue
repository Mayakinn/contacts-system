<script setup lang="ts">
const props = defineProps<{
  isActive: boolean
}>()
</script>

<template>
  <transition name="modal-fade">
    <div v-if="isActive">
      <div class="fixed inset-0 flex justify-center pt-20 bg-gray-500/75">
        <div class="flex flex-col">
          <div
            class="relative overflow-auto rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl"
          >
            <div class="justify-end flex m-3">
              <slot></slot>
            </div>
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"></div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
}
</style>
