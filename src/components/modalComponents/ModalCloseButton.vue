<script lang="ts" setup>
const emit = defineEmits(['close-modal'])

const props = defineProps<{
  isDeleteModal: boolean
}>()
</script>

<template>
  <div v-if="!props.isDeleteModal">
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
  <div v-else>
    <button class="hover:bg-gray-300 rounded-xl p-2" @click="emit('close-modal')">Ne</button>
  </div>
</template>
