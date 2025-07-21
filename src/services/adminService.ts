import type { Contact } from '@/typings/interface/Contact'
import type { User } from '@/typings/interface/User'
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
    throw new Error('adminas/-ai nerastas/-i!')
  }
  if (status === 401) {
    throw new Error('Autorizacijos klaida, prisijunkite!')
  }
  if (status === 400) {
    throw new Error('Autorizacijos klaida, neturite tam teisių!')
  }

  return new Error('Serverio klaida!')
})

const getAdmins = async (currentPage = 1, perPage = 10): Promise<[User[], number, number]> => {
  try {
    const response = await instance.get(`/api/collections/users/records`, {
      params: {
        page: currentPage,
        perPage: perPage,
      },
    })
    console.log(response.data)
    const data: User[] = response.data.items
    const totalItems: number = response.data.totalItems
    const totalPages: number = response.data.totalPages
    return [data, totalItems, totalPages]
  } catch (error) {
    return Promise.reject(error)
  }
}

export { getAdmins }
