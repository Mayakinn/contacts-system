import type { Department } from '@/typings/interface/Department'
import type { DepartmentGroup } from '@/typings/interface/DepartmentGroup'
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

  if (status === 401) {
    throw 'Klaida: Autorizacijos klaida, prisijunkite!'
  }
  if (status === 400) {
    throw 'Klaida: Toks skyrius jau egzistuoja!'
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

const getDepartments = async (
  currentPage = 1,
  perPage = 10,
): Promise<[Department[], number, number]> => {
  try {
    const response = await instance.get(`api/collections/departments/records`, {
      params: {
        page: currentPage,
        perPage: perPage,
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

const createDepartment = async (name: string) => {
  try {
    const department_id = await instance.post(`api/collections/departments/records`, {
      name: name,
    })

    return department_id.data.id
  } catch (error) {
    return Promise.reject(error)
  }
}

const getDepartment = async (departmentName: string): Promise<Department[]> => {
  try {
    const response = await instance.get(`api/collections/departments/records`, {
      params: {
        filter: `name='${departmentName}'`,
      },
    })
    const data: Department[] = response.data.items

    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

const updateDepartmentName = async (name: string, departmentId: string | undefined) => {
  try {
    await instance.patch(`api/collections/departments/records/${departmentId}`, {
      name: name,
    })
    return
  } catch (error) {
    return Promise.reject(error)
  }
}

const getDepartmentDivisions = async (
  selectedDepartment: string,
): Promise<DivisionDepartment[]> => {
  try {
    const response = await instance.get(`api/collections/divisions_departments/records`, {
      params: {
        expand: 'divisions_id',
        filter: `department_id='${selectedDepartment}'`,
      },
    })
    const data: DivisionDepartment[] = response.data.items
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

const updateAddDepartmentDivisions = async (
  formData: FormData,
  department_id: string | undefined,
) => {
  try {
    const promises: Promise<any>[] = []

    formData.forEach(async (division_id) => {
      const payload = {
        department_id: department_id,
        division_id: division_id,
      }
      promises.push(instance.post(`api/collections/divisions_departments/records`, payload))
    })
    await Promise.all(promises)

    return
  } catch (error) {
    return Promise.reject(error)
  }
}

const updateDeleteDepartmentDivisions = async (formData: FormData) => {
  try {
    const promises: Promise<any>[] = []

    formData.forEach(async (id) => {
      promises.push(instance.delete(`api/collections/divisions_departments/records/${id}`))
    })
    await Promise.all(promises)

    return
  } catch (error) {
    return Promise.reject(error)
  }
}

const getDepartmentRelationsWithGroup = async (
  selectedDepartment: string,
): Promise<DepartmentGroup[]> => {
  try {
    const response = await instance.get(`api/collections/departments_groups/records`, {
      params: {
        filter: `department_id='${selectedDepartment}'`,
      },
    })
    const data: DepartmentGroup[] = response.data.items
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

const deleteDepartment = async (departmentId: string) => {
  try {
    await instance.delete(`api/collections/departments/records/${departmentId}`)
    return
  } catch (error) {
    return Promise.reject(error)
  }
}

export {
  getDepartmentsForFilter,
  getDepartments,
  createDepartment,
  deleteDepartment,
  updateDepartmentName,
  getDepartmentDivisions,
  updateDeleteDepartmentDivisions,
  updateAddDepartmentDivisions,
  getDepartment,
  getDepartmentRelationsWithGroup,
}
