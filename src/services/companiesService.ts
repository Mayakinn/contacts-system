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
    throw 'Tinklo klaida!'
  }

  const { status, data } = error.response

  if (status === 403) {
    throw 'Neturite teisių atlikti šio veiksmo!'
  }
  if (status === 401) {
    throw 'Klaida: Autorizacijos klaida, prisijunkite!'
  }
  throw status
})
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})
const getCompanies = async (
  currentPage = 1,
  perPage = 10,
): Promise<[Company[], number, number]> => {
  try {
    const response = await instance.get(`api/collections/companies/records`, {
      params: {
        page: currentPage,
        perPage: perPage,
      },
    })
    const data: Company[] = response.data.items
    const totalItems: number = response.data.totalItems
    const totalPages: number = response.data.totalPages
    return [data, totalItems, totalPages]
  } catch (error) {
    return Promise.reject(error)
  }
}
const getCompany = async (companyName: string): Promise<Company[]> => {
  try {
    const response = await instance.get(`/api/collections/companies/records`, {
      params: {
        filter: `name~'${companyName}'`,
      },
    })
    const data: Company[] = response.data.items

    return data
  } catch (error) {
    return Promise.reject(error)
  }
}
const createCompany = async (formData: FormData) => {
  try {
    await instance.post(`api/collections/companies/records`, formData)
    return
  } catch (error) {
    return Promise.reject(error)
  }
}

const editCompany = async (companyId: string, formData: FormData) => {
  try {
    await instance.patch(`api/collections/companies/records/${companyId}`, formData)
    return
  } catch (error) {
    return Promise.reject(error)
  }
}

const deleteCompany = async (companyId: string) => {
  try {
    await instance.delete(`api/collections/companies/records/${companyId}`)
    return
  } catch (error) {
    return Promise.reject(error)
  }
}

const getCompanyRelationsWithOffice = async (selectedCompany: string): Promise<CompanyOffice[]> => {
  try {
    const response = await instance.get(`api/collections/companies_offices/records`, {
      params: {
        filter: `company_id='${selectedCompany}'`,
      },
    })
    const data: CompanyOffice[] = response.data.items
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export {
  getCompanies,
  createCompany,
  editCompany,
  deleteCompany,
  getCompany,
  getCompanyRelationsWithOffice,
}
