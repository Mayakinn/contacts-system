import type { Division } from '@/typings/interface/Division'
import type { OfficeDivision } from '@/typings/interface/OfficeDivision'
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
    throw 'Klaida: Padalinys nerastas!'
  }
  if (status === 401) {
    throw 'Klaida: Autorizacijos klaida, prisijunkite!'
  }
  if (status === 400) {
    throw 'Klaida: Autorizacijos klaida, neturite tam teisių!'
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
const getDivisionsForFilters = async (selectedOffice: string): Promise<OfficeDivision[]> => {
  try {
    const response = await instance.get(
      `

api/collections/offices_divisions/records`,
      {
        params: {
          expand: 'division_id',
          filter: `office_id='${selectedOffice}'`,
        },
      },
    )
    const data: OfficeDivision[] = response.data.items
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

const getDivisions = async (currentPage = 1): Promise<[Division[], number, number]> => {
  try {
    const response = await instance.get(`api/collections/divisions/records`, {
      params: {
        page: currentPage,
      },
    })
    const data: Division[] = response.data.items

    const totalItems: number = response.data.totalItems
    const totalPages: number = response.data.totalPages
    return [data, totalItems, totalPages]
  } catch (error) {
    return Promise.reject(error)
  }
}

const createDivision = async (formData: FormData, name: string) => {
  try {
    const division_id = await instance.post(`/api/collections/divisions/records`, {
      name: name,
    })
    const data = division_id.data.id
    if (data != null) {
      formData.forEach(async (department_id) => {
        const payload = {
          division_id: data,
          department_id: department_id,
        }
        await instance.post(`/api/collections/divisions_departments/records`, payload)
      })
    }
    return
  } catch (error) {
    return Promise.reject(error)
  }
}

export { getDivisionsForFilters, getDivisions, createDivision }
