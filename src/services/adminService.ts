import type { Contact } from '@/typings/interface/Contact'
import type { User } from '@/typings/interface/User'
import axios from 'axios'

const DB_URL = import.meta.env.VITE_POCKETBASE_API

const instance = axios.create({
  baseURL: DB_URL,
  timeout: 1000,
  headers: { Authorization: localStorage.getItem('token') },
})

instance.interceptors.response.use(undefined, (error) => {
  if (!error.response) {
    throw new Error('Tinklo klaida!')
  }

  const { status, data } = error.response

  if (status === 404) {
    throw new Error('adminas/-ai nerastas/-i!')
  }
  if (status === 403) {
    throw new Error('Neturite tam teisių!')
  }
  if (status === 401) {
    throw new Error('Autorizacijos klaida, prisijunkite!')
  }
  if (status === 400) {
    throw new Error('Paštas užimtas ir/arba nevalidus el.paštas!')
  }
  throw new Error('Serverio klaida!')
})

const getAdmins = async (currentPage = 1, perPage = 10): Promise<[User[], number, number]> => {
  try {
    const response = await instance.get(`/api/collections/users/records`, {
      params: {
        page: currentPage,
        perPage: perPage,
        expand: 'permissions_id',
      },
    })
    const data: User[] = response.data.items
    const totalItems: number = response.data.totalItems
    const totalPages: number = response.data.totalPages
    return [data, totalItems, totalPages]
  } catch (error) {
    return Promise.reject(error)
  }
}

const createAdmin = async (permissions: object, formData: FormData) => {
  let permissionId : string = ''
  let noErrors : boolean = false
  try {
    const firstResponse = await instance.post(`/api/collections/user_permissions/records`, {
      ...permissions,
      
    })
    permissionId = firstResponse.data.id
    formData.append('permissions_id', permissionId)
    await instance.post(`/api/collections/users/records`, formData)
    noErrors = true

    return
  } catch (error) {
    return Promise.reject(error)
  }
  finally{
    if (!noErrors && permissionId != ''){
      try{
      await instance.delete(`/api/collections/user_permissions/records/${permissionId}`)
      }catch (error){
      Promise.reject(error)
    }
    } 
  }
}

const updateAdminPermissions = async (permissions: object, id: string) => {
  try {
    const response = await instance.patch(`/api/collections/user_permissions/records/${id}`, {
      ...permissions,
    })
    return response.data
  } catch (error) {
    return Promise.reject(error)
  }
}

const updateAdmin = async (formData: FormData, id: string) => {
  try {
    const response = await instance.patch(`/api/collections/users/records/${id}`, formData)
    return response.data
  } catch (error) {
    return Promise.reject(error)
  }
}

const deleteAdmin = async( admin : User ) => {
  let adminDeleted = false
  try{
    await instance.delete(`/api/collections/users/records/${admin.id}`)
    adminDeleted = true

  } catch (error) {
    return Promise.reject(error)
  }
  finally {
    if(adminDeleted){
      try {
        await instance.delete(`/api/collections/user_permissions/records/${admin.permissions_id}`)
        return
      }
      catch (error){
        return Promise.reject(error)
      }
    }
  }
}


export { getAdmins, createAdmin, updateAdminPermissions, updateAdmin, deleteAdmin }
