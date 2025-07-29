<script lang="ts" setup>
import { computed, watch } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['page-change'])

watch(
  () => props.totalPages,
  () => {
    calculatePages()
  },
)

function calculatePages() {
  if (props.currentPage > props.totalPages) {
    emit('page-change', props.totalPages)
  }
}

const changePage = (page: number) => {
  if (page < 1 || page > props.totalPages) {
    return
  }
  emit('page-change', page)
}

const canGoBack = computed(() => {
  return props.currentPage === 1 ? true : false
})

const canGoForward = computed(() => {
  return props.currentPage === props.totalPages ? true : false
})
</script>

<template>
  <div class="flex justify-center items-center my-3">
    <button
      class="flex items-center w-50 h-7 bg-button-blue text-white text-right text-sm rounded-xs"
      :class="{ 'cursor-pointer hover:bg-blue-500': !canGoBack }"
      @click="changePage(currentPage - 1)"
      :disabled="currentPage == 1"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 -960 960 960"
        class="mr-2"
      >
        <path
          d="M440-240 200-480l240-240 56 56-183 184 183 184zm264 0L464-480l240-240 56 56-183 184 183 184z"
          clip-rule="evenodd"
          fill-rule="evenodd"
          fill="#FFFFFF"
        />
      </svg>
      <p class="m-1 ml-13">Praeitas puslapis</p>
    </button>

    <p class="m-0.5 mx-2">{{ currentPage }}/{{ totalPages }}</p>
    <button
      class="flex items-center w-50 h-7 bg-button-blue text-white text-left text-sm rounded-xs"
      :class="{ 'cursor-pointer hover:bg-blue-500': !canGoForward }"
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
    >
      <p class="m-1 ml-2">Kitas puslapis</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 -960 960 960"
        class="ml-19"
      >
        <path
          d="M383-480 200-664l56-56 240 240-240 240-56-56zm264 0L464-664l56-56 240 240-240 240-56-56z"
          clip-rule="evenodd"
          fill-rule="evenodd"
          fill="#FFFFFF"
        />
      </svg>
    </button>
  </div>
</template>
