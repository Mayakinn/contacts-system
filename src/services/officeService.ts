import type { Company } from '@/typings/interface/Company'
import type { CompanyOffice } from '@/typings/interface/CompanyOffice'
import axios from 'axios'

const DB_URL = import.meta.env.VITE_POCKETBASE_API

const instance = axios.create({
  baseURL: DB_URL,
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' },
})

instance.interceptors.response.use(undefined, (error) => {
  if (!error.response) {
    throw new Error('Tinklo klaida!')
  }

  const { status, data } = error.response

  if (status === 404) {
    throw new Error('Ofisas nerastas!')
  }
  if (status === 401) {
    throw new Error('Autorizacijos klaida, prisijunkite!')
  }
  if (status === 400) {
    throw new Error('Autorizacijos klaida, neturite tam teisių!')
  }

  return new Error('Serverio klaida!')
})

const getOffices = async (selectedCompany: string): Promise<CompanyOffice[]> => {
  try {
    const response = await instance.get(
      `

api/collections/companies_offices/records`,
      {
        params: {
          expand: 'office_id',
          filter: `company_id='${selectedCompany}'`,
        },
      },
    )
    const data: CompanyOffice[] = response.data.items
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export { getOffices }
