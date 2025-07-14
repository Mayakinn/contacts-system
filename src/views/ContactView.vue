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
import Filter from '@/components/pageComponents/Filter.vue'
import Search from '@/components/pageComponents/Search.vue'
import Pagination from '@/components/pageComponents/Pagination.vue'

const selectedOption = ref<number>(25)
const contacts = ref<Contact[]>()
const totalItems = ref<number>(0)
const totalPages = ref<number>(0)
const notifs = useNotificationStore()
const currentListType = shallowRef<Component>(ContactCardList)
const empty = ref<boolean>(true)
const loading = ref<boolean>(true)

async function loadData() {
  try {
    const result = await getContacts(contactsPerPage.value)

    if (!result) {
      empty.value = true
      contacts.value = []
      totalItems.value = 0
      totalPages.value = 0
      notifs.addNotification('Nepavyko užkrauti kontaktų!', NotificationType.danger)
      return
    }

    const [data, total, pages] = result
    contacts.value = data
    totalItems.value = total

    totalPages.value = pages
    if (totalItems.value == undefined || totalItems.value == 0) {
      empty.value = true
      notifs.addNotification('Kontaktų sąrašas tusčias!', NotificationType.danger)
      return
    } else if (totalItems.value > 0) {
      empty.value = false
      notifs.addNotification('Kontaktai sėkmingai užkrauti!', NotificationType.success)
      return
    }
  } catch (error: any) {
    notifs.addNotification(error, NotificationType.danger)
  } finally {
    loading.value = false
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

function onNumberChange(contactsPerPage: number) {
  selectedOption.value = contactsPerPage
  currentPage.value = 1
  loadData()
}

function onPageChange(page: number) {
  currentPage.value = page
  loadData()
}

function onFilterChange(filterParamString: Record<string, string>) {
  filterString.value = combinedFilterParam(filterParamString)
  currentPage.value = 1
  loadData()
}

function handleFilterError(errorMessage: any) {
  notifs.addNotification(errorMessage, NotificationType.danger)
}

function combinedFilterParam(filterParamString: Record<string, string>) {
  const filterEntries = Object.entries(filterParamString)
  return filterEntries.length > 0
    ? `(${filterEntries.map(([key, value]) => `${key}='${value}'`).join(' && ')})`
    : ''
}

onMounted(async () => {
  await loadData()
})
</script>

<template>
  <div class="ml-24 mt-10">
    <p class="text-6xl font-light">Kontaktų sistema</p>
    <div class="w-full mt-4">
      <div class="relative flex items-center">
        <Search />
        <ItemsPerPage :totalItems="totalItems" @number-change="onNumberChange" :active="empty" />
        <button
          @click="changeListType()"
          class="bg-button-blue rounded-xs w-11.5 h-10 ml-5 hover:bg-blue-500 flex items-center justify-center cursor-pointer"
        >
          <img :src="image" />
        </button>
      </div>
    </div>
    <p class="my-3">
      Iš viso rasta: <strong> {{ totalItems }} kontaktų</strong>
    </p>
    <Filter @filter-change="onFilterChange" @error-received="handleFilterError" />
  </div>
  <div v-if="empty" class="text-3xl ml-24 mt-10">Sąrašas tusčias</div>
  <div v-else-if="loading" class="text-3xl ml-24 mt-10">Kraunama...</div>
  <div v-else>
    <component :is="currentListType" :contacts="contacts" class="ml-24 mt-10"></component>
    <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="onPageChange" />
  </div>
  <Pagination />
</template>
