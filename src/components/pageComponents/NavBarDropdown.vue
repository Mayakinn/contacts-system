<script lang="ts" setup>
import router from '@/router'
import { useAuthStore } from '@/stores/authStore'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
const dropdownRef = ref<HTMLElement | null>(null)
const dropdownVisibility = ref<boolean>(false)
const auth = useAuthStore()
const DB_URL = import.meta.env.VITE_POCKETBASE_API
import noImage from '../../assets/default-admin.png'

function toggleDropdown() {
  dropdownVisibility.value = !dropdownVisibility.value
}

function logOut() {
  auth.logOutUser()
  dropdownVisibility.value = false
}
const image = computed(() => {
  try {
    const avatar = auth.User?.avatar
    if (avatar && avatar !== '') {
      return `${DB_URL}/api/files/${auth.User?.collectionId}/${auth.User?.id}/${avatar}`
    } else {
      return noImage
    }
  } catch (error) {
    return noImage
  }
})

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    dropdownVisibility.value = false
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
    v-if="auth.jwtToken != null"
    @click="toggleDropdown"
    class="relative cursor-pointer"
    ref="dropdownRef"
  >
    <img class="w-10 h-10 rounded-full mr-4" :src="image" />
  </div>
  <div
    v-if="dropdownVisibility"
    class="absolute right-0 mt-43 w-48 bg-white rounded-md shadow-2xl border border-gray-200 z-10"
  >
    <ul>
      <li
        class="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-md"
        @click="router.push('/changepassword')"
      >
        Pakeisti slaptažodį
      </li>
      <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-md" @click="logOut">
        Atsijungti
      </li>
    </ul>
  </div>
</template>
