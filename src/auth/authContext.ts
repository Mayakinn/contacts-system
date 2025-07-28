import router from '@/router'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'

const DB_URL = import.meta.env.VITE_POCKETBASE_API

const instance = axios.create({
  baseURL: DB_URL,
  timeout: 1000,
  headers: { Authorization: localStorage.getItem('token') },
})

instance.interceptors.response.use(undefined, (error) => {
  if (!error.response) {
    throw 'Klaida: Tinklo klaida!'
  }

  const { status, data } = error.response

  if (status === 404) {
    throw 'Klaida: Vartotojas nerastas!'
  }
  if (status === 401) {
    throw 'Klaida: Autorizacijos klaida, prisijunkite!'
  }
  if (status === 400) {
    throw 'Klaida: Neteisingi prisijungimo duomenys!'
  }

  return 'Klaida: Serverio klaida!'
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

const login = async (email: string, password: string) => {
  try {
    const response = await instance.post(
      `api/collections/users/auth-with-password`,
      {
        identity: email,
        password: password,
      },
      {
        params: {
          expand: 'permissions_id',
        },
      },
    )
    const data = response.data
    console.log(data)
    localStorage.setItem('token', data.token)
    router.push('contacts')
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

const tokenRefresh = async () => {
  try {
    const response = await instance.post(
      `
api/collections/users/auth-refresh`,
      {},
      {
        params: {
          expand: 'permissions_id',
        },
      },
    )
    const data = response.data
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

const adminForgotPassword = async (email: string) => {
  try {
    const response = await instance.post(
      `
api/collections/users/request-password-reset`,
      {
        email: email,
      },
    )

    return
  } catch (error) {
    return Promise.reject(error)
  }
}

const adminChangePassword = async (passwordFirst: string, passwordSecond: string) => {
  const auth = useAuthStore()
  try {
    const response = await instance.patch(
      `
api/collections/users/records/${auth.User?.id}`,
      {
        password: passwordFirst,
        passwordConfirm: passwordSecond,
      },
    )
    if (response != null) {
      auth.logOutUser()
    }
    return response
  } catch (error) {
    return Promise.reject(error)
  }
}

export { login, adminForgotPassword, tokenRefresh, adminChangePassword }
