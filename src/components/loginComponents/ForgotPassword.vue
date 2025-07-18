<script lang="ts" setup>
import { adminForgotPassword } from '@/auth/authContext'
import { useNotificationStore } from '@/stores/notificationStore'
import { NotificationType } from '@/typings/interface/NotificationType'
import { ref } from 'vue'

const email = ref<string>('')
const userHasPressedSend = ref<boolean>(false)
const notifs = useNotificationStore()

async function forgotPassword() {
  try {
    await adminForgotPassword(email.value)
    userHasPressedSend.value = !userHasPressedSend.value
  } catch (error: any) {
    notifs.addNotification(error, NotificationType.danger)
  }
}
</script>

<template>
  <div class="flex flex-col justify-center px-6 my-25 py-6 lg:px-40 bg-white">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2
        class="mt-10 text-center text-4xl tracking-tight text-gray-900"
        v-show="!userHasPressedSend"
      >
        Priminti slaptažodį
      </h2>
    </div>

    <div class="my-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div v-if="userHasPressedSend" class="">
        Slaptažodžio priminimas išsiųstas vartotojui su el.paštu:
        <strong>{{ email }}</strong>
      </div>
      <form v-if="!userHasPressedSend" class="space-y-6" @submit.prevent="forgotPassword">
        <div class="my-15">
          <label for="email" class="block text-sm/6 font-medium text-gray-900"
            >Elektroninis paštas:</label
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            fill="currentColor"
            class="absolute w-5 h-5 text-slate-600 m-2"
          >
            <path
              clip-rule="evenodd"
              fill-rule="evenodd"
              d="M29 4H3a3 3 0 0 0-3 3v18a3 3 0 0 0 3 3h26a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-.72 2L16 14.77 3.72 6zM30 25a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.23l13.42 9.58a1 1 0 0 0 1.16 0L30 7.23z"
            />
          </svg>
          <input
            type="email"
            v-model="email"
            placeholder="Įveskite el.pašto adresą..."
            autocomplete="email"
            required
            class="w-full bg-gray-100 placeholder:text-gray-400 text-slate-700 text-sm border border-slate-200 rounded-xs pl-10 pr-3 py-2 transition duration-300 ease"
          />
        </div>
        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-teltonika-blue mb-50 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Siųsti
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
