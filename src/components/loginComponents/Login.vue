<script lang="ts" setup>
import { login } from '@/auth/authContext'
import router from '@/router'
import { useAuthStore } from '@/stores/authStore'
import { ref } from 'vue'

const auth = useAuthStore()

const email = ref<string>('')
const password = ref<string>('')

async function loginAdmin() {
  auth.loginUser(email.value, password.value)
}
</script>

<template>
  <div class="flex flex-col justify-center px-6 my-25 py-6 lg:px-40 bg-white">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-4xl tracking-tight text-gray-900">Admin prisijungimas:</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="loginAdmin">
        <div>
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
            id="email"
            placeholder="Įveskite el.pašto adresą..."
            autocomplete="email"
            required
            class="w-full bg-gray-100 placeholder:text-gray-400 text-slate-700 text-sm border border-slate-200 rounded-xs pl-10 pr-3 py-2 transition duration-300 ease"
          />
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm/6 font-medium text-gray-900"
              >Slaptažodis:</label
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
            v-model="password"
            id="password"
            autocomplete="current-password"
            required
            placeholder="Įveskite slaptažodį..."
            class="w-full bg-gray-100 placeholder:text-gray-400 text-slate-700 text-sm border border-slate-200 rounded-xs pl-10 pr-3 py-2 transition duration-300 ease"
          />
        </div>
        <div
          class="my-10 font-light text-blue-600 cursor-pointer"
          @click="router.push('ForgotPassword')"
        >
          Slaptažodžio atkūrimas
        </div>
        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-teltonika-blue mb-40 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Prisijungti
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
