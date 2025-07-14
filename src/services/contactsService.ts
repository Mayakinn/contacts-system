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
    throw new Error('Tinklo klaida!')
  }

  const { status, data } = error.response

  if (status === 404) {
    router.push('NotFoundPage')
  }
  if (status === 401) {
    throw new Error('Autorizacijos klaida, prisijunkite!')
  }
  if (status === 400) {
    throw new Error('Autorizacijos klaida, neturite tam teisių!')
  }

  return new Error('Serverio klaida!')
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

const getContact = async (employeeId: string): Promise<Contact | undefined> => {
  try {
    const response = await axios.get(`${DB_URL}/api/collections/employees/records/${employeeId}`, {
      params: {
        expand: 'office_id, division_id,group_id,department_id,company_id',
      },
    })
    const data: Contact = response.data
    return data
  } catch (error) {
    return undefined
  }
}

export { getContacts, getContact }
