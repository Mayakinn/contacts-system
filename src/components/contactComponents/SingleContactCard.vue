<script setup lang="ts">
import type { Contact } from '@/typings/interface/Contact'
import { computed } from 'vue'

const props = defineProps<{
  contact: Contact | undefined
}>()

const image = computed(() => {
  const imageURL = `http://127.0.0.1:8090/api/files/${props.contact?.collectionId}/${props.contact?.id}/${props.contact?.photo}`
  return props.contact?.photo != '' ? imageURL : '../../../noPhoto.png'
})
</script>

<template>
  <div><p class="text-5xl ml-30 mt-7">Detalesnė kontakto informacija:</p></div>
  <div class="ml-30 mt-30 flex items-center">
    <img class="size-20 rounded-full mr-4" :src="image" />
    <div>
      <p class="text-4xl leading-none">{{ props.contact?.name }} {{ props.contact?.surname }}</p>
      <p class="text-3xl font-light">Pozicija : {{ props.contact?.position }}</p>
    </div>
  </div>
  <div class="grid grid-cols-2 mx-50 mt-10 text-left">
    <div class="rounded overflow-hidden shadow-lg">
      <div class="ml-10"><p class="ml-10">This is something</p></div>
    </div>
    <div class="rounded overflow-hidden shadow-lg">This is something</div>
  </div>
</template>
