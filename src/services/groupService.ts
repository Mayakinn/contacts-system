import type { DepartmentGroup } from '@/typings/interface/DepartmentGroup'
import type { Group } from '@/typings/interface/Group'
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
    throw 'Klaida: Grupė nerasta!'
  }
  if (status === 401) {
    throw 'Klaida: Autorizacijos klaida, prisijunkite!'
  }
  if (status === 400) {
    throw 'Klaida: Tokia grupė jau egzistuoja!'
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
const getGroupsForFilter = async (selectedDepartment: string): Promise<DepartmentGroup[]> => {
  try {
    const response = await instance.get(
      `

api/collections/departments_groups/records`,
      {
        params: {
          expand: 'group_id',
          filter: `department_id='${selectedDepartment}'`,
        },
      },
    )
    const data: DepartmentGroup[] = response.data.items
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

const getGroups = async (currentPage = 1): Promise<[Group[], number, number]> => {
  try {
    const response = await instance.get(`api/collections/groups/records`, {
      params: {
        page: currentPage,
      },
    })
    const data: Group[] = response.data.items

    const totalItems: number = response.data.totalItems
    const totalPages: number = response.data.totalPages
    return [data, totalItems, totalPages]
  } catch (error) {
    return Promise.reject(error)
  }
}

const createGroup = async (formData: FormData) => {
  try {
    await instance.post(`/api/collections/groups/records`, formData)
    return
  } catch (error) {
    return Promise.reject(error)
  }
}

export { getGroupsForFilter, getGroups, createGroup }
