<script lang="ts" setup>
import { adminChangePassword } from '@/auth/authContext'
import router from '@/router'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/typings/interface/NotificationType'
import { computed, ref } from 'vue'
import PasswordValidator from 'password-validator'

const schema = new PasswordValidator()
const passwordFirst = ref<string>('')
const passwordSecond = ref<string>('')
const notifs = useNotificationStore()
const auth = useAuthStore()
const successMessage = ref<boolean>(false)

schema.has().not().spaces()

async function changePassword() {
  if (!arePasswordsSame.value) {
    notifs.addNotification('Slaptažodžiai nesutampa!', NotificationType.warning)
    return
  }
  if (!isMoreThan8LessThan72.value) {
    notifs.addNotification('Slaptažodis turi būti nuo 8 iki 72 simbolių.', NotificationType.warning)
    return
  }
  if (!schema.validate(passwordFirst.value)) {
    notifs.addNotification('Slaptažodyje negali būti tarpų!', NotificationType.warning)
    return
  }
  try {
    const response = await adminChangePassword(passwordFirst.value, passwordSecond.value)
    successMessage.value = true
    return
  } catch (error: any) {
    notifs.addNotification(error, NotificationType.danger)
  }
}

const arePasswordsSame = computed(() => {
  return passwordFirst.value == passwordSecond.value
})

const isMoreThan8LessThan72 = computed(() => {
  return passwordFirst.value.length >= 8 && passwordFirst.value.length <= 72
})

function goBackToLogin() {
  setTimeout(() => router.push('login'), 100)
}
</script>

<template>
  <div class="flex flex-col justify-center px-6 my-25 py-6 lg:px-40 bg-white">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-4xl tracking-tight text-gray-900" v-if="!successMessage">
        Pakeisti slaptažodį
      </h2>
    </div>
    <div v-if="successMessage">
      Slaptažodis pakeistas sėkmingai
      <button
        class="flex w-full justify-center rounded-md bg-teltonika-blue my-10 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        @click="goBackToLogin"
      >
        Grįžti į prisijungimo puslapį
      </button>
    </div>

    <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-sm" v-if="!successMessage">
      <form class="space-y-6" @submit.prevent="changePassword()">
        <div class="mt-5">
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm/6 font-medium text-gray-900"
              >Naujas slaptažodis:</label
            >
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            fill="currentColor"
            class="absolute w-5 h-5 text-slate-600 m-2"
          >
            <path
              clip-rule="evenodd"
              fill-rule="evenodd"
              d="M24 14v-4a8 8 0 0 0-16 0v4a3.24 3.24 0 0 0-3 3.21v9.54A3.23 3.23 0 0 0 8.23 30h15.54A3.23 3.23 0 0 0 27 26.77v-9.54A3.24 3.24 0 0 0 24 14zM16 4a6 6 0 0 1 6 6v4H10v-4a6 6 0 0 1 6-6zm9 22.77A1.23 1.23 0 0 1 23.77 28H8.23A1.23 1.23 0 0 1 7 26.77v-9.54A1.23 1.23 0 0 1 8.23 16h15.54A1.23 1.23 0 0 1 25 17.23z"
            />
          </svg>
          <input
            type="password"
            v-model="passwordFirst"
            required
            maxlength="72"
            placeholder="Įveskite slaptažodį..."
            class="w-full bg-gray-100 placeholder:text-gray-400 text-slate-700 text-sm border border-slate-200 rounded-xs pl-10 pr-3 py-2 transition duration-300 ease"
          />
        </div>
        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm/6 font-medium text-gray-900"
              >Pakartokite slaptažodį:</label
            >
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            fill="currentColor"
            class="absolute w-5 h-5 text-slate-600 m-2"
          >
            <path
              clip-rule="evenodd"
              fill-rule="evenodd"
              d="M24 14v-4a8 8 0 0 0-16 0v4a3.24 3.24 0 0 0-3 3.21v9.54A3.23 3.23 0 0 0 8.23 30h15.54A3.23 3.23 0 0 0 27 26.77v-9.54A3.24 3.24 0 0 0 24 14zM16 4a6 6 0 0 1 6 6v4H10v-4a6 6 0 0 1 6-6zm9 22.77A1.23 1.23 0 0 1 23.77 28H8.23A1.23 1.23 0 0 1 7 26.77v-9.54A1.23 1.23 0 0 1 8.23 16h15.54A1.23 1.23 0 0 1 25 17.23z"
            />
          </svg>
          <input
            type="password"
            v-model="passwordSecond"
            required
            maxlength="72"
            placeholder="Įveskite slaptažodį..."
            class="w-full bg-gray-100 placeholder:text-gray-400 text-slate-700 text-sm border border-slate-200 rounded-xs pl-10 pr-3 py-2 transition duration-300 ease"
          />
        </div>
        <div v-if="!arePasswordsSame" class="text-sm">Slaptažodžiai skiriasi!</div>
        <div v-if="!isMoreThan8LessThan72" class="text-sm">
          Slaptažodis turi būti tarp 8 ir 72 simbolių ilgio
        </div>
        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-teltonika-blue mb-10 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Pakeisti
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
