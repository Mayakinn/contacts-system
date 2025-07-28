import type { Company } from '@/typings/interface/Company'
import type { CompanyOffice } from '@/typings/interface/CompanyOffice'
import axios from 'axios'

const DB_URL = import.meta.env.VITE_POCKETBASE_API

const instance = axios.create({
  baseURL: DB_URL,
  timeout: 1000,
})

instance.interceptors.response.use(undefined, (error) => {
  if (!error.response) {
    throw 'Klaida: Tinklo klaida!'
  }

  const { status, data } = error.response

  if (status === 404) {
    throw 'Klaida: Įmonė nerasta!'
  }
  if (status === 401) {
    throw 'Klaida: Autorizacijos klaida, prisijunkite!'
  }
  if (status === 400) {
    throw 'Klaida: Autorizacijos klaida, neturite tam teisių!'
  }

  return 'Klaida: Serverio klaida!'
})

const getCompanies = async (): Promise<Company[]> => {
  try {
    const response = await instance.get(
      `
api/collections/companies/records`,
    )
    const data: Company[] = response.data.items
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export { getCompanies }
