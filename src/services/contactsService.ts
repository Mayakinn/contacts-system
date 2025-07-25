import type { Contact } from '@/typings/interface/Contact'
import axios from 'axios'

const DB_URL = import.meta.env.VITE_POCKETBASE_API

const instance = axios.create({
  baseURL: DB_URL,
  timeout: 1000,
  headers: { Authorization: localStorage.getItem('token') },
})

instance.interceptors.response.use(undefined, (error) => {
  if (!error.response) {
    throw new Error('Tinklo klaida!')
  }

  const { status, data } = error.response

  if (status === 404) {
    throw new Error('Kontaktas/-ai nerastas/-i!')
  }
  if (status === 401) {
    throw new Error('Autorizacijos klaida, prisijunkite!')
  }
  if (status === 400) {
    throw new Error('Autorizacijos klaida, neturite tam teisių!')
  }

  return new Error('Serverio klaida!')
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

const getContacts = async (
  selectedOption = 25,
  currentPage = 1,
  filterString = '',
): Promise<[Contact[], number, number]> => {
  try {
    const response = await instance.get(`/api/collections/employees/records`, {
      params: {
        filter: filterString,
        perPage: selectedOption,
        page: currentPage,
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
    const response = await instance.get(
      `${DB_URL}/api/collections/employees/records/${employeeId}`,
      {
        params: {
          expand: 'office_id, division_id,group_id,department_id,company_id',
        },
      },
    )
    const data: Contact = response.data
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

const createContact = async (formData: FormData) => {
  try {
    await instance.post(`/api/collections/employees/records`, formData)

    return
  } catch (error) {
    return Promise.reject(error)
  }
}

export { getContacts, getContact, createContact }
