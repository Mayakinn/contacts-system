<script lang="ts" setup>
import { ref } from 'vue'
import _ from 'lodash'

const searchQuery = ref<string>('')
const emit = defineEmits(['query-change'])

const updateSearchTerm = _.debounce(() => {
  const searchParamString = `((name ~ "${searchQuery.value.toLocaleLowerCase()}"  || surname ~ "${searchQuery.value.toLocaleLowerCase()}"  || email ~ "${searchQuery.value.toLocaleLowerCase()}"  || phone_number ~ "${searchQuery.value.toLocaleLowerCase()}" || position ~ "${searchQuery.value.toLocaleLowerCase()}") || 
  (name ~ "${searchQuery.value.toLocaleUpperCase()}" || surname ~ "${searchQuery.value.toLocaleUpperCase()}" || email ~ "${searchQuery.value.toLocaleUpperCase()}" || phone_number ~ "${searchQuery.value.toLocaleUpperCase()}" || position ~ "${searchQuery.value.toLocaleUpperCase()}"))`
  emit('query-change', searchParamString)
}, 1000)
</script>

<template>
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600"
    >
      <path
        fill-rule="evenodd"
        d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
        clip-rule="evenodd"
      />
    </svg>
    <input
      class="w-110 bg-gray-100 placeholder:text-gray-400 text-slate-700 text-sm border border-slate-200 rounded-xs pl-10 pr-3 py-2 transition duration-300 ease"
      placeholder="Ieškoti kontakto..."
      v-model="searchQuery"
      @input="updateSearchTerm"
    />
  </div>
</template>
