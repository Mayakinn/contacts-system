import PocketBase from 'pocketbase'

const DB_URL = import.meta.env.VITE_POCKETBASE_API

const pb = new PocketBase(DB_URL)

const getContacts = async () => {
  const response = await pb.collection('employess').getList(1, 50)
  return response
}

export { getContacts }
