import type { Department } from '@/typings/interface/Department'
import type { DivisionDepartment } from '@/typings/interface/DivisionDepartment'
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

  if (status === 404) {
    throw 'Klaida: Skyrius nerastas!'
  }
  if (status === 401) {
    throw 'Klaida: Autorizacijos klaida, prisijunkite!'
  }
  if (status === 400) {
    throw 'Klaida: Toks skyrius jau egzistuoja!'
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
const getDepartmentsForFilter = async (selectedDivision: string): Promise<DivisionDepartment[]> => {
  try {
    const response = await instance.get(
      `

api/collections/divisions_departments/records`,
      {
        params: {
          expand: 'department_id',
          filter: `division_id='${selectedDivision}'`,
        },
      },
    )
    const data: DivisionDepartment[] = response.data.items
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

const getDepartments = async (currentPage = 1): Promise<[Department[], number, number]> => {
  try {
    const response = await instance.get(`api/collections/departments/records`, {
      params: {
        page: currentPage,
      },
    })
    const data: Department[] = response.data.items

    const totalItems: number = response.data.totalItems
    const totalPages: number = response.data.totalPages
    return [data, totalItems, totalPages]
  } catch (error) {
    return Promise.reject(error)
  }
}

const createDepartment = async (formData: FormData, name: string) => {
  try {
    const department_id = await instance.post(`/api/collections/departments/records`, {
      name: name,
    })
    const data = department_id.data.id
    if (data != null) {
      formData.forEach(async (group_id) => {
        const payload = {
          department_id: data,
          group_id: group_id,
        }
        await instance.post(`/api/collections/departments_groups/records`, payload)
      })
    }
    return
  } catch (error) {
    return Promise.reject(error)
  }
}

export { getDepartmentsForFilter, getDepartments, createDepartment }
