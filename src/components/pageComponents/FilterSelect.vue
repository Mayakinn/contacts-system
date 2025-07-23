<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps<{
  options: Array<{ id: string | undefined; name: string | undefined }>
  label: string
  placeholder: string
  isDisabled: boolean
  modelValue: string
}>()

const selectedValue = ref<string>('')

const emit = defineEmits(['update:modelValue'])

watch(
  () => props.modelValue,
  (newVal) => {
    selectedValue.value = newVal
  },
  { immediate: true },
)

const onValueChange = () => {
  emit('update:modelValue', selectedValue.value)
}
</script>

<template>
  <div>
    <label class="block">{{ label }}</label>
    <select
      class="border rounded-sm w-55 border-gray-300 h-6 text-gray-500"
      v-model="selectedValue"
      @change="onValueChange"
      :disabled="isDisabled"
    >
      <option value="">{{ placeholder }}</option>
      <option v-for="option in options" :value="option.id" :key="option.id">
        {{ option.name }}
      </option>
    </select>
  </div>
</template>
