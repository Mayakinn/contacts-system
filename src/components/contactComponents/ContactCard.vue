<script setup lang="ts">
import type { Contact } from '@/typings/interface/Contact'
import { computed } from 'vue'

const props = defineProps<{
  contact: Contact | undefined
}>()

const image = computed(() => {
  const imageURL = `http://127.0.0.1:8090/api/files/${props.contact?.collectionId}/${props.contact?.id}/${props.contact?.photo}`
  console.log(props.contact)
  return props.contact?.photo != '' ? imageURL : '../../../noPhoto.png'
})
</script>

<template>
  <div class="rounded overflow-hidden shadow-lg">
    <div class="px-6 py-4">
      <div class="flex items-center">
        <img class="w-15 h-15 rounded-full mr-4" :src="image" />
        <div class="text-sm">
          <p class="text-gray-900 leading-none">
            {{ props.contact?.name }} {{ props.contact?.surname }}
          </p>
          <p class="text-gray-600">{{ props.contact?.position }}</p>
        </div>
      </div>
      <div class="text-left p-4 space-y-4 text-sm">
        <p class="font-light">Telefono nr: {{ props.contact?.phone_number }}</p>
        <p class="font-light">El. Paštas: {{ props.contact?.email }}</p>
        <p class="font-light">Adresas: {{ props.contact?.expand?.office_id.street }}</p>
      </div>
    </div>
  </div>
</template>
