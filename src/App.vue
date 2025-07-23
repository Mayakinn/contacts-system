<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/pageComponents/Navbar.vue'
import Notification from './components/pageComponents/notificationComponents/NotificationList.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <Navbar v-if="!$route.meta.hideNavbar" />
    </div>
  </header>
  <Notification />
  <RouterView />
</template>
