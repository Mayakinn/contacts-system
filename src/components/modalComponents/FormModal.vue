<script setup lang="ts">
const props = defineProps<{
  isActive: boolean
}>()

const emit = defineEmits(['close-modal'])
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

              <button
                class="w-10 h-10 bg-button-blue rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-800"
                @click="emit('close-modal')"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 17L7 7.00002M17 7L7.00001 17"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
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
