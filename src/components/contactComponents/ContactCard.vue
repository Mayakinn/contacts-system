<script setup lang="ts">
import type { Contact } from '@/typings/interface/Contact'
import { computed } from 'vue'
import noImage from '../../assets/noPhoto.png'

const props = defineProps<{
  contact: Contact | undefined
}>()
const DB_URL = import.meta.env.VITE_POCKETBASE_API
const image = computed(() => {
  const imageURL = `${DB_URL}/api/files/${props.contact?.collectionId}/${props.contact?.id}/${props.contact?.photo}`
  return props.contact?.photo != '' ? imageURL : noImage
})

const email = computed(() => {
  return props.contact?.email ? props.contact.email : '-'
})

const phoneNumber = computed(() => {
  return props.contact?.phone_number ? props.contact.phone_number : '-'
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
        <p class="font-light">Telefono nr: {{ phoneNumber }}</p>
        <p class="font-light">El. Paštas: {{ email }}</p>
        <p class="font-light">
          Adresas: {{ props.contact?.expand?.office_id.street }}
          {{ props.contact?.expand?.office_id.street_number }}
        </p>
      </div>
    </div>
  </div>
</template>
