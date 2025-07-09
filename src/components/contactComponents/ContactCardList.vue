<script lang="ts" setup>
import { getContacts } from '@/services/contactsService'

const contacts = await getContacts()

console.log(contacts)
</script>

<template>
  <div>{{ contacts }}</div>
</template>
