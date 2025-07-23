import type { DivisionDepartment } from '@/typings/interface/DivisionDepartment'
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
    throw new Error('Skyrius nerastas!')
  }
  if (status === 401) {
    throw new Error('Autorizacijos klaida, prisijunkite!')
  }
  if (status === 400) {
    throw new Error('Autorizacijos klaida, neturite tam teisių!')
  }

  return new Error('Serverio klaida!')
})

const getDepartments = async (selectedDivision: string): Promise<DivisionDepartment[]> => {
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

export { getDepartments }
