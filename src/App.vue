<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/pageComponents/Navbar.vue'
import Notification from './components/pageComponents/Notification.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <Navbar />
    </div>
  </header>
  <Notification />
  <RouterView />
</template>
