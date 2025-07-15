import type { DepartmentGroup } from '@/typings/interface/DepartmentGroup'
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
    throw new Error('Grupė nerasta!')
  }
  if (status === 401) {
    throw new Error('Autorizacijos klaida, prisijunkite!')
  }
  if (status === 400) {
    throw new Error('Autorizacijos klaida, neturite tam teisių!')
  }

  return new Error('Serverio klaida!')
})

const getGroups = async (selectedDepartment: string): Promise<DepartmentGroup[]> => {
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

export { getGroups }
