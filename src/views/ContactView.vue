<script setup lang="ts">
import ContactCardList from '@/components/contactComponents/ContactCardList.vue'
import ContactTableList from '@/components/contactComponents/ContactTableList.vue'
import ItemsPerPage from '@/components/pageComponents/ItemsPerPage.vue'
import { getContacts } from '@/services/contactsService'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Contact } from '@/typings/interface/Contact'
import { NotificationType } from '@/typings/interface/NotificationType'
import { computed, ref, shallowRef, watch, type Component } from 'vue'
import { onMounted } from 'vue'
import cardImage from '../assets/card-icon.png'
import listImage from '../assets/list-icon.png'

const selectedOption = ref<number>(25)
const contacts = ref<Contact[]>()
const totalItems = ref<number | undefined>(25)
const totalPages = ref<number | undefined>()
const notifs = useNotificationStore()
const currentListType = shallowRef<Component>(ContactCardList)
const empty = ref<boolean>(false)
const loading = ref<boolean>(true)

async function loadData() {
  const result = await getContacts(selectedOption.value)

  if (result != null) {
    const [data, total, pages] = result
    contacts.value = data
    totalItems.value = total
    totalPages.value = pages
    if (totalItems.value == undefined || totalItems.value == 0) {
      empty.value = true
      loading.value = false
      notifs.addNotification('Kontaktų sąrašas tusčias!', NotificationType.danger)
      return
    } else if (totalItems.value > 0) {
      loading.value = false
      notifs.addNotification('Kontaktai sėkmingai užkrauti!', NotificationType.success)
    }
  } else {
    loading.value = false
    empty.value = true
    contacts.value = []
    totalItems.value = 0
    totalPages.value = 0

    notifs.addNotification('Nepavyko užkrauti kontaktų!', NotificationType.danger)
  }
}

const image = computed(() => {
  if (currentListType.value == ContactCardList) {
    return cardImage
  } else return listImage
})

function changeListType() {
  if (currentListType.value == ContactCardList) {
    currentListType.value = ContactTableList
    return
  } else currentListType.value = ContactCardList
  return
}

function onNumberChange(emitted: number) {
  selectedOption.value = emitted
}

watch(
  () => selectedOption.value,
  () => {
    loadData()
  },
)

onMounted(async () => {
  await loadData()
})
</script>

<template>
  <div class="ml-24 mt-10">
    <p class="text-6xl">Kontaktų sistema</p>
    <div class="w-full max-w-sm min-w-[200px] mt-4">
      <div class="relative flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600"
        >
          <path
            fill-rule="evenodd"
            d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
            clip-rule="evenodd"
          />
        </svg>
        <input
          class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
          placeholder="Ieškoti kontakto..."
        />

        <ItemsPerPage :TotalItems="totalItems" @number-change="onNumberChange" />
        <button
          @click="changeListType()"
          class="bg-teltonika-blue rounded-xs w-20 h-10 ml-5 hover:bg-blue-500 flex items-center justify-center cursor-pointer"
        >
          <img :src="image" />
        </button>
      </div>
    </div>
    <p class="mt-4">
      Iš viso rasta: <strong> {{ totalItems || 0 }}</strong>
    </p>
    <br />
    (Čia bus filtrai!!!)
    <div v-if="loading" class="text-3xl">Kraunama...</div>
    <div v-else-if="empty" class="text-3xl">Sąrašas tusčias</div>
    <component v-else :is="currentListType" :Contacts="contacts"></component>
  </div>
</template>
