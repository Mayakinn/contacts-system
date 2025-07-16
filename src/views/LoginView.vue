<script setup lang="ts">
import Login from '@/components/loginComponents/Login.vue'
import router from '@/router'
</script>

<template class="">
  <div class="relative" @click="router.back()">
    <button
      class="shadow-lg hover:bg-gray-400 bg-white cursor-pointer rounded-full w-10 h-10 items-center flex absolute top-20 left-40"
    >
      <img class="size-5 m-2.5 mt-3" src="../assets/curved-arrow.png" />
    </button>
  </div>
  <div class="min-h-screen bg-teltonika-blue flex items-center justify-center">
    <div class="bg-white">
      <Login />
    </div>
  </div>
</template>
