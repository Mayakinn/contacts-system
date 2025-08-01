import type { Company } from '@/typings/interface/Company'
import type { CompanyOffice } from '@/typings/interface/CompanyOffice'
import type { Office } from '@/typings/interface/Office'
import type { OfficeDivision } from '@/typings/interface/OfficeDivision'
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
const getOfficesForFilter = async (selectedCompany: string): Promise<CompanyOffice[]> => {
  try {
    const response = await instance.get(`api/collections/companies_offices/records`, {
      params: {
        expand: 'office_id',
        filter: `company_id='${selectedCompany}'`,
      },
    })
    const data: CompanyOffice[] = response.data.items
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

const getOffices = async (currentPage = 1, perPage = 10): Promise<[Office[], number, number]> => {
  try {
    const response = await instance.get(`api/collections/offices/records`, {
      params: {
        page: currentPage,
        perPage: perPage,
      },
    })
    const data: Office[] = response.data.items
    const totalItems: number = response.data.totalItems
    const totalPages: number = response.data.totalPages
    return [data, totalItems, totalPages]
  } catch (error) {
    return Promise.reject(error)
  }
}

const getOffice = async (officeName: string): Promise<Office[]> => {
  try {
    const response = await instance.get(`api/collections/offices/records`, {
      params: {
        filter: `name='${officeName}'`,
      },
    })
    const data: Office[] = response.data.items

    return data
  } catch (error) {
    return Promise.reject(error)
  }
}
const getOfficeRelationsWithDivisions = async (
  selectedOffice: string,
): Promise<OfficeDivision[]> => {
  try {
    const response = await instance.get(`api/collections/offices_divisions/records`, {
      params: {
        filter: `office_id='${selectedOffice}'`,
      },
    })
    const data: OfficeDivision[] = response.data.items
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}
const createOffice = async (formDataCompanies: FormData, formDataOffice: FormData) => {
  const promises: Promise<any>[] = []

  try {
    const office_id = await instance.post(`api/collections/offices/records`, formDataOffice)
    const data = office_id.data.id
    if (data != null) {
      formDataCompanies.forEach(async (company_id) => {
        const payload = {
          office_id: data,
          company_id: company_id,
        }
        promises.push(instance.post(`api/collections/companies_offices/records`, payload))
      })
    }
    await Promise.all(promises)
    return
  } catch (error) {
    return Promise.reject(error)
  }
}

const updateOfficeDetails = async (formData: FormData, office_id: string | undefined) => {
  try {
    await instance.patch(`api/collections/offices/records/${office_id}`, formData)
    return
  } catch (error) {
    return Promise.reject(error)
  }
}

const getOfficeCompanies = async (selectedOffice: string): Promise<CompanyOffice[]> => {
  try {
    const response = await instance.get(`api/collections/companies_offices/records`, {
      params: {
        expand: 'company_id',
        filter: `office_id='${selectedOffice}'`,
      },
    })
    const data: CompanyOffice[] = response.data.items
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

const updateAddOfficeCompanies = async (formData: FormData, office_id: string | undefined) => {
  try {
    const promises: Promise<any>[] = []

    formData.forEach(async (company_id) => {
      const payload = {
        office_id: office_id,
        company_id: company_id,
      }
      promises.push(instance.post(`/api/collections/companies_offices/records`, payload))
    })
    await Promise.all(promises)

    return
  } catch (error) {
    return Promise.reject(error)
  }
}

const updateDeleteOfficeCompanies = async (formData: FormData) => {
  try {
    const promises: Promise<any>[] = []

    formData.forEach(async (id) => {
      promises.push(instance.delete(`/api/collections/companies_offices/records/${id}`))
    })
    await Promise.all(promises)

    return
  } catch (error) {
    return Promise.reject(error)
  }
}

const deleteOffice = async (officeId: string) => {
  try {
    await instance.delete(`api/collections/offices/records/${officeId}`)
    return
  } catch (error) {
    return Promise.reject(error)
  }
}

export {
  getOfficesForFilter,
  getOffices,
  createOffice,
  deleteOffice,
  updateOfficeDetails,
  getOfficeCompanies,
  updateAddOfficeCompanies,
  updateDeleteOfficeCompanies,
  getOffice,
  getOfficeRelationsWithDivisions,
}
