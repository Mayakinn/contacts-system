import type { Department } from '@/typings/interface/Department'
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
const getGroupsForFilter = async (selectedDepartment: string): Promise<DepartmentGroup[]> => {
  try {
    const response = await instance.get(`api/collections/departments_groups/records`, {
      params: {
        expand: 'group_id',
        filter: `department_id='${selectedDepartment}'`,
      },
    })
    const data: DepartmentGroup[] = response.data.items
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

const getGroupsDepartments = async (selectedGroup: string): Promise<DepartmentGroup[]> => {
  try {
    const response = await instance.get(`api/collections/departments_groups/records`, {
      params: {
        expand: 'department_id',
        filter: `group_id='${selectedGroup}'`,
      },
    })
    const data: DepartmentGroup[] = response.data.items
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

const getGroup = async (groupName: string): Promise<Group[]> => {
  try {
    const response = await instance.get(`api/collections/groups/records`, {
      params: {
        filter: `name="${encodeURIComponent(groupName)}"`,
      },
    })
    const data: Group[] = response.data.items

    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

const getGroups = async (currentPage = 1, perPage = 10): Promise<[Group[], number, number]> => {
  try {
    const response = await instance.get(`api/collections/groups/records`, {
      params: {
        page: currentPage,
        perPage: perPage,
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

const createGroup = async (formData: FormData, name: string) => {
  try {
    const promises: Promise<any>[] = []

    const group_id = await instance.post(`api/collections/groups/records`, {
      name: name,
    })
    const data = group_id.data.id
    if (data != null) {
      formData.forEach(async (department_id) => {
        const payload = {
          group_id: data,
          department_id: department_id,
        }
        promises.push(instance.post(`api/collections/departments_groups/records`, payload))
      })
      await Promise.all(promises)
    }
    return
  } catch (error) {
    return Promise.reject(error)
  }
}

const updateGroupName = async (name: string, groupId: string | undefined) => {
  try {
    await instance.patch(`api/collections/groups/records/${groupId}`, {
      name: name,
    })
    return
  } catch (error) {
    return Promise.reject(error)
  }
}

const updateAddGroupDepartments = async (formData: FormData, groupId: string | undefined) => {
  try {
    const promises: Promise<any>[] = []

    formData.forEach(async (department_id) => {
      const payload = {
        group_id: groupId,
        department_id: department_id,
      }
      promises.push(instance.post(`api/collections/departments_groups/records`, payload))
    })
    await Promise.all(promises)

    return
  } catch (error) {
    return Promise.reject(error)
  }
}

const updateDeleteGroupDepartments = async (formData: FormData) => {
  try {
    const promises: Promise<any>[] = []

    formData.forEach(async (id) => {
      promises.push(instance.delete(`api/collections/departments_groups/records/${id}`))
    })
    await Promise.all(promises)

    return
  } catch (error) {
    return Promise.reject(error)
  }
}

const deleteGroup = async (groupId: string) => {
  try {
    await instance.delete(`api/collections/groups/records/${groupId}`)
    return
  } catch (error) {
    return Promise.reject(error)
  }
}

export {
  getGroupsForFilter,
  getGroups,
  createGroup,
  deleteGroup,
  getGroupsDepartments,
  updateGroupName,
  updateAddGroupDepartments,
  updateDeleteGroupDepartments,
  getGroup,
}
