import type { OfficeDivision } from '@/typings/interface/OfficeDivision'
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
    throw new Error('Padalinys nerastas!')
  }
  if (status === 401) {
    throw new Error('Autorizacijos klaida, prisijunkite!')
  }
  if (status === 400) {
    throw new Error('Autorizacijos klaida, neturite tam teisių!')
  }

  return new Error('Serverio klaida!')
})

const getDivisions = async (selectedOffice: string): Promise<OfficeDivision[]> => {
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

export { getDivisions }
