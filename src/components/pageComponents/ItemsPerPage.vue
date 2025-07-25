<script setup lang="ts">
import { ref } from 'vue'
import { onBeforeUnmount, onMounted } from 'vue'
const options = [5, 10, 25, 50, 100, 'All']
const showHideMenuSelect = ref<boolean>(false)
const dropdownRef = ref<HTMLElement | null>(null)
const selectedOption = ref<number | undefined>(25)

const props = defineProps<{
  TotalItems: number | undefined
}>()

const emit = defineEmits(['number-change'])

const toggleOptionSelect = (option: number | string) => {
  if (option === 'All') {
    selectedOption.value = props.TotalItems
    emit('number-change', props.TotalItems)
  } else {
    emit('number-change', option)
  }
}

const showHideMenu = () => {
  return (showHideMenuSelect.value = !showHideMenuSelect.value)
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showHideMenuSelect.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div
    ref="dropdownRef"
    class="bg-button-blue rounded-xs w-11.5 h-10 ml-5 flex items-center cursor-pointer"
    @click="showHideMenu"
  >
    <img src="../../assets/dropdown.png" class="pt-2" />
    <transition-group name="select-fade">
      <div class="w-11.5 space-y-0.5 absolute top-full z-10 mt-1" v-if="showHideMenuSelect">
        <div
          class="h-4 bg-teltonika-blue hover:bg-blue-500 rounded-xs text-center text-xs text-white"
          v-for="(option, index) in options"
          :key="index"
          @click="toggleOptionSelect(option)"
        >
          {{ option }}
        </div>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.select-fade-enter-from,
.select-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.select-fade-enter-active,
.select-fade-leave-active {
  transition: all 0.3s ease;
}

.select-fade-enter-to,
.select-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
