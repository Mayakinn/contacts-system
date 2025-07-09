<script setup lang="ts">
import ContactCardList from '@/components/contactComponents/ContactCardList.vue'
import { getContacts } from '@/services/contactsService'
import type { Contact } from '@/typings/interface/Contact'
import { ref } from 'vue'
import { onMounted } from 'vue'

const contacts = ref<Contact[]>()
const totalItems = ref<number>()
const totalPages = ref<number>()
async function loadData() {
  const result = await getContacts()

  if (result) {
    const [data, total, pages] = result
    contacts.value = data
    totalItems.value = total
    totalPages.value = pages
  } else {
    contacts.value = []
    totalItems.value = 0
    totalPages.value = 0
  }
}

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
      </div>
    </div>
    <p class="mt-4">
      Iš viso rasta:<strong> {{ totalItems }}</strong>
    </p>
    <br />
    (Čia bus filtrai!!!)
    <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <ContactCardList :Contacts="contacts" />
    </div>
  </div>
</template>
