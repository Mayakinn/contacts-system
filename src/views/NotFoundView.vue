<script setup lang="ts">
import router from '@/router';

</script>

<template>
  <div class="text-center text-3xl py-30 ">
    <p>Puslapio kurio ieškote neegzistuoja.</p></br>
    <a class="font-semibold underline pointer cursor-pointer" @click="() => router.push('/')">Grįžti į pagrindinį puslapį</a>
  </div>
</template>
