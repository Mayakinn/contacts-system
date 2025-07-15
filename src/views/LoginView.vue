<script setup lang="ts">
import router from '@/router'
</script>

<template>
  <div class="relative" @click="router.back()">
    <div
      class="shadow-lg hover:bg-gray-200 cursor-pointer rounded-full w-10 h-10 items-center flex absolute top-10 left-40"
    >
      <img class="size-5 m-2.5 mt-3" src="../assets/curved-arrow.png" />
    </div>
  </div>
</template>
