<script lang="ts" setup>
import router from '@/router'
import { useAuthStore } from '@/stores/authStore'
import NavBarDropdown from './NavBarDropdown.vue'

const auth = useAuthStore()
</script>

<template>
  <nav class=" flex-row-reverse flex py-5 bg-teltonika-blue pr-5 relative">
    <div class="space-x-20 text-2xl text-white font-semibold">
      <RouterLink to="/" class="hover:text-gray-300 transition-colors">Kontaktai</RouterLink>
      <RouterLink v-if="auth.jwtToken != null" to="/companies" class="hover:text-gray-300 transition-colors">Įmonės
      </RouterLink>
      <RouterLink v-if="auth.jwtToken != null" to="/structures/offices" class="hover:text-gray-300 transition-colors">
        Struktūra</RouterLink>
      <RouterLink v-if="auth.User?.username == 'admin'" to="/admin" class="hover:text-gray-300 transition-colors">
        Paskyros</RouterLink>
      <RouterLink v-if="auth.jwtToken == null" to="/login" class="hover:text-gray-300 transition-colors">Prisijungti
      </RouterLink>
    </div>
    <NavBarDropdown />
  </nav>
</template>