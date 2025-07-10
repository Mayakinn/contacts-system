import type { Contact } from '@/typings/interface/Contact'
import axios, { Axios } from 'axios'
import PocketBase from 'pocketbase'
import type { List } from 'postcss/lib/list'

const DB_URL = import.meta.env.VITE_POCKETBASE_API

const pb = new PocketBase(DB_URL)

const getContacts = async (
  selectedOption = 25,
): Promise<[Contact[], number, number] | undefined> => {
  try {
    const response = await axios.get(`${DB_URL}/api/collections/employees/records`, {
      params: {
        perPage: selectedOption,
        expand: 'office_id',
      },
    })
    const data: Contact[] = response.data.items
    const totalItems: number = response.data.totalItems
    const totalPages: number = response.data.totalPages
    return [data, totalItems, totalPages]
  } catch (error) {
    return undefined
  }
}

export { getContacts }
