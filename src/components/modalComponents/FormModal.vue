<script setup lang="ts">
const props = defineProps<{
  isActive: boolean
}>()

const emit = defineEmits(['close-modal'])
</script>

<template>
  <transition name="modal-fade">
    <div v-if="isActive">
      <div class="fixed inset-0 flex items-center justify-center">
        <div>
          <div aria-hidden="true" class="fixed inset-0 bg-gray-500/75 transition-opacity"></div>

          <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div
              class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
            >
              <div
                class="relative overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
              >
                <div class="justify-end flex m-3">
                  <div
                    class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-800"
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
                  </div>
                </div>

                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <slot></slot>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
