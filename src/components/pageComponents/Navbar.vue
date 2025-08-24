<script lang="ts" setup>
import router from '@/router'
import { useAuthStore } from '@/stores/authStore'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import NavBarDropdown from './NavBarDropdown.vue'

const auth = useAuthStore()
</script>

<template>
  <nav class="flex items-center justify-between bg-teltonika-blue pr-5 py-1 relative">
    <img
      class="h-auto w-100 object-contain cursor-pointer"
      src="../../assets/Logo.png"
      alt="Logo"
      @click="router.push('/contacts')"
    />
    <div class="flex space-x-20 text-2xl text-white font-semibold">
      <RouterLink to="/" class="hover:text-gray-300 transition-colors">Kontaktai</RouterLink>
      <RouterLink
        v-if="auth.jwtToken != null"
        to="/companies"
        class="hover:text-gray-300 transition-colors"
        >Įmonės</RouterLink
      >
      <RouterLink
        v-if="auth.jwtToken != null"
        to="/structures/offices"
        class="hover:text-gray-300 transition-colors"
        >Struktūra</RouterLink
      >
      <RouterLink
        v-if="auth.User?.username == 'admin'"
        to="/admin"
        class="hover:text-gray-300 transition-colors"
        >Paskyros</RouterLink
      >
      <RouterLink
        v-if="auth.jwtToken == null"
        to="/login"
        class="hover:text-gray-300 transition-colors"
        >Prisijungti</RouterLink
      >
    </div>
    <NavBarDropdown />
  </nav>
</template>
