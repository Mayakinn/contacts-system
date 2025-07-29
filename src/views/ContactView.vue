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
import { useAuthStore } from '@/stores/authStore'
import FormModal from '@/components/modalComponents/FormModal.vue'
import ContactCreateForm from '@/components/formComponents/contactFormComponents/ContactCreateForm.vue'
import ContactDeleteForm from '@/components/formComponents/contactFormComponents/ContactDeleteForm.vue'
import ContactEditForm from '@/components/formComponents/contactFormComponents/ContactEditForm.vue'

const selectedOption = ref<number>(25)
const contacts = ref<Contact[]>()
const totalItems = ref<number>(0)
const totalPages = ref<number>(0)
const notifs = useNotificationStore()
const currentListType = shallowRef<Component>(ContactCardList)
const empty = ref<boolean>(true)
const loading = ref<boolean>(true)
const currentPage = ref<number>(1)
const filterString = ref<string>('')
const searchTerm = ref<string>('')
const searchAndFilterParamString = ref<string>('')
const auth = useAuthStore()
const currentContact = ref<Contact | null>(null)
const currentForm = shallowRef<Component>()
const formModalActive = ref<boolean>(false)

async function loadData() {
  try {
    loading.value = true
    const result = await getContacts(
      selectedOption.value,
      currentPage.value,
      searchAndFilterParamString.value,
    )

    if (result != null) {
      const [data, total, pages] = result
      contacts.value = data
      totalItems.value = total
      loading.value = false
      totalPages.value = pages

      if (currentPage.value > totalPages.value && totalPages.value > 0) {
        currentPage.value = totalPages.value
        await loadData()
        return
      }

      if (totalItems.value == undefined || totalItems.value == 0) {
        empty.value = true
        notifs.addNotification('Kontaktų sąrašas tusčias!', NotificationType.danger)
        return
      } else if (totalItems.value > 0) {
        empty.value = false
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
  } catch (error: any) {
    notifs.addNotification(error, NotificationType.danger)
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

function onSearchTermChange(newQuery: string) {
  searchTerm.value = newQuery
  updateSearchAndFilterParam()
}

function onFilterChange(filterParamString: Record<string, string>) {
  filterString.value = combinedFilterParam(filterParamString)

  currentPage.value = 1
  updateSearchAndFilterParam()
}

function updateSearchAndFilterParam() {
  if (filterString.value != '' && searchTerm.value != '') {
    searchAndFilterParamString.value = `(${filterString.value} && ${searchTerm.value})`
  } else if (filterString.value != '') {
    searchAndFilterParamString.value = filterString.value
  } else if (searchTerm.value != '') {
    searchAndFilterParamString.value = searchTerm.value
  } else {
    searchAndFilterParamString.value = ''
  }
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

function closeModalAfterForm(flag: boolean) {
  formModalActive.value = false
  currentContact.value = null
  if (flag) {
    return
  } else {
    loadData()
  }
}

function OpenModal() {
  formModalActive.value = true
}

const closeModal = () => {
  formModalActive.value = false
  currentForm.value = undefined
  currentContact.value = null
}

function openContactCreateForm() {
  currentForm.value = ContactCreateForm
  OpenModal()
}

function openContactDeleteForm(contact: Contact) {
  currentContact.value = contact
  currentForm.value = ContactDeleteForm
  OpenModal()
}

function openContactEditForm(contact: Contact) {
  currentContact.value = contact
  currentForm.value = ContactEditForm
  OpenModal()
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
        <Search @query-change="onSearchTermChange" />
        <ItemsPerPage :totalItems="totalItems" @number-change="onNumberChange" />
        <button
          @click="changeListType()"
          class="bg-button-blue rounded-xs w-11.5 h-10 ml-5 hover:bg-blue-500 flex items-center justify-center cursor-pointer"
        >
          <img :src="image" />
        </button>
        <button
          v-show="auth.User?.expand?.permissions_id?.edit_employees == true"
          @click="openContactCreateForm"
          class="bg-button-blue rounded-xs w-11.5 h-10 ml-5 hover:bg-blue-500 flex items-center justify-center cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="30" height="30">
            <path
              fill="white"
              d="M10.75 5.75c0-.414-.336-.75-.75-.75s-.75.336-.75.75v3.5h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5Z"
            />
          </svg>
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
  <div v-if="!loading && !empty" :key="currentListType + '-' + currentPage">
    <component
      :is="currentListType"
      :contacts="contacts"
      class="mx-24 mt-10"
      @delete-contact="openContactDeleteForm"
      @edit-contact="openContactEditForm"
    />
    <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="onPageChange" />
  </div>

  <FormModal :isActive="formModalActive" @close-modal="closeModal">
    <component
      @close-pressed="closeModalAfterForm"
      :is="currentForm"
      :currentContact="currentContact"
      :key="currentForm"
    ></component>
  </FormModal>
</template>
