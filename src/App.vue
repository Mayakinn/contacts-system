<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/pageComponents/Navbar.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <Navbar />
    </div>
  </header>

  <RouterView />
</template>
