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
    throw 'Klaida: Autorizacijos klaida, neturite tam teisių!'
  }

  return 'Klaida: Serverio klaida!'
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
