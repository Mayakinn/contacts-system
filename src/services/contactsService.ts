import router from '@/router'
import type { Contact } from '@/typings/interface/Contact'
import axios, { Axios, isAxiosError } from 'axios'
import PocketBase from 'pocketbase'
import type { List } from 'postcss/lib/list'
import { errorMessages } from 'vue/compiler-sfc'

const DB_URL = import.meta.env.VITE_POCKETBASE_API

const instance = axios.create({
  baseURL: DB_URL,
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' },
})

const pb = new PocketBase(DB_URL)

instance.interceptors.response.use(undefined, (error) => {
  if (!error.response) {
    return Promise.reject(new Error('Network error: Server is down'))
  }

  const { status, data } = error.response

  if (status === 404) {
    router.push('NotFoundPage')
  }

  return Promise.reject(new Error('Server Error'))
})

const getContacts = async (selectedOption = 25): Promise<[Contact[], number, number]> => {
  try {
    const response = await instance.get(`/api/collections/employees/records`, {
      params: {
        perPage: selectedOption,
        expand: 'office_id',
      },
    })
    const data: Contact[] = response.data.items
    const totalItems: number = response.data.totalItems
    const totalPages: number = response.data.totalPages
    return [data, totalItems, totalPages]
  } catch (error) {
    return Promise.reject(error)
  }
}

export { getContacts }
