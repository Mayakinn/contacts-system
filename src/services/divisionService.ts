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
    throw 'Klaida: Toks padalinys jau egzistuoja!'
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

const getDivisions = async (
  currentPage = 1,
  perPage = 10,
): Promise<[Division[], number, number]> => {
  try {
    const response = await instance.get(`api/collections/divisions/records`, {
      params: {
        page: currentPage,
        perPage: perPage,
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
      formData.forEach(async (office_id) => {
        const payload = {
          division_id: data,
          office_id: office_id,
        }
        await instance.post(`/api/collections/offices_divisions/records`, payload)
      })
    }
    return
  } catch (error) {
    return Promise.reject(error)
  }
}

const updateDivisionName = async (name: string, divisionId: string | undefined) => {
  try {
    await instance.patch(`/api/collections/divisions/records/${divisionId}`, {
      name: name,
    })
    return
  } catch (error) {
    return Promise.reject(error)
  }
}

const getDivisionOffices = async (selectedDivision: string): Promise<OfficeDivision[]> => {
  try {
    const response = await instance.get(`api/collections/offices_divisions/records`, {
      params: {
        expand: 'office_id',
        filter: `division_id='${selectedDivision}'`,
      },
    })
    const data: OfficeDivision[] = response.data.items
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

const updateAddDivisionOffices = async (formData: FormData, division_id: string | undefined) => {
  try {
    const promises: Promise<any>[] = []

    formData.forEach(async (office_id) => {
      const payload = {
        division_id: division_id,
        office_id: office_id,
      }
      promises.push(instance.post(`/api/collections/offices_divisions/records`, payload))
    })
    await Promise.all(promises)

    return
  } catch (error) {
    return Promise.reject(error)
  }
}

const updateDeleteDivisionOffices = async (formData: FormData) => {
  try {
    const promises: Promise<any>[] = []

    formData.forEach(async (id) => {
      promises.push(instance.delete(`/api/collections/offices_divisions/records/${id}`))
    })
    await Promise.all(promises)

    return
  } catch (error) {
    return Promise.reject(error)
  }
}

const deleteDivision = async (divisionId: string) => {
  try {
    await instance.delete(`api/collections/divisions/records/${divisionId}`)
    return
  } catch (error) {
    return Promise.reject(error)
  }
}

export {
  getDivisionsForFilters,
  getDivisions,
  createDivision,
  deleteDivision,
  updateDivisionName,
  getDivisionOffices,
  updateAddDivisionOffices,
  updateDeleteDivisionOffices,
}
