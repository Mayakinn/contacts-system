<script setup lang="ts">
import router from '@/router'
import { getContact } from '@/services/contactsService'
import type { Contact } from '@/typings/interface/Contact'
import { computed } from 'vue'

const props = defineProps<{
  contact: Contact | undefined
}>()

const image = computed(() => {
  const imageURL = `http://127.0.0.1:8090/api/files/${props.contact?.collectionId}/${props.contact?.id}/${props.contact?.photo}`
  return props.contact?.photo != '' ? imageURL : '../../../noPhoto.png'
})

const email = computed(() => {
  return props.contact?.email
    ? `<p>Elektroninis paštas: <a href="mailto:${props.contact?.email}" class="text-blue-700">  ${props.contact?.email} </a> </p>`
    : '<p>Elektroninis paštas: <span>-<span> </p>'
})

const phoneNumber = computed(() => {
  return props.contact?.phone_number
    ? `<p>Telefono Numeris: <a href="tel:${props.contact?.phone_number}" class="text-blue-700">  ${props.contact?.phone_number} </a> </p>`
    : '<p>Telefono Numeris: <span>-<span> <p>'
})

const office = computed(() => {
  return props.contact?.expand?.office_id
    ? `<p class="">Skyrius: ${props.contact?.expand?.office_id.name} </p>`
    : `<p>Skyrius: <span>-<span></p>`
})

const company = computed(() => {
  return props.contact?.expand?.company_id
    ? `<p class="">Kompanija: ${props.contact?.expand?.company_id.name} </p>`
    : `<p>Kompanija: <span>-<span></p>`
})

const division = computed(() => {
  return props.contact?.expand?.division_id
    ? `<p class="">Būstinė: ${props.contact?.expand?.division_id.name} </p>`
    : `<p>Būstinė: <span>-<span></p>`
})

const department = computed(() => {
  return props.contact?.expand?.department_id
    ? `<p class="">Padalinys: ${props.contact?.expand?.department_id.name} </p>`
    : `<p>Padalinys: <span>-<span></p>`
})

const group = computed(() => {
  return props.contact?.expand?.group_id
    ? `<p class="">Grupė: ${props.contact?.expand?.group_id.name} </p>`
    : `<p>Grupė: <span>-<span></p>`
})
</script>

<template>
  <div class="relative" @click="router.back()">
    <div
      class="shadow-lg hover:bg-gray-200 cursor-pointer rounded-full w-10 h-10 items-center flex absolute top-10 right-40"
    >
      <img class="size-5 m-2.5 mt-3" src="../../../curved-arrow.png" />
    </div>
  </div>

  <div><p class="text-5xl font-light ml-30 mt-7">Detalesnė kontakto informacija:</p></div>
  <div class="flex items-center ml-30 mt-10">
    <img class="size-15 rounded-full mr-4" :src="image" />
    <div class="text-5xl ml-3">
      <p class="leading-none">{{ props.contact?.name }} {{ props.contact?.surname }}</p>
      <p class="text-3xl font-light">Pozicija: {{ props.contact?.position }}</p>
    </div>
  </div>
  <div class="flex mx-30 my-15 shadow-md py-10">
    <div class="space-y-7 w-full ml-8 font-normal">
      <p class="border-b-1 border-gray-100 text-2xl">Kontaktinės detalės:</p>

      <p v-html="email"></p>
      <p v-html="phoneNumber"></p>
    </div>
    <div class="space-y-7 w-full font-normal">
      <p class="border-b-1 border-gray-100 text-2xl">Kompanijos detalės:</p>
      <p v-html="company"></p>
      <p v-html="division"></p>
      <p v-html="department"></p>
      <p v-html="office"></p>
      <p v-html="group"></p>
    </div>
  </div>
</template>
