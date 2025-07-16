import router from '@/router'
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
    throw new Error('Vartotojas nerastas!')
  }
  if (status === 401) {
    throw new Error('Autorizacijos klaida, prisijunkite!')
  }
  if (status === 400) {
    throw new Error('Autorizacijos klaida, neturite tam teisių!')
  }

  return new Error('Serverio klaida!')
})

const login = async (email: string, password: string) => {
  try {
    const response = await instance.post(
      `
api/collections/users/auth-with-password`,
      {
        identity: email,
        password: password,
      },
    )
    const data = response.data
    localStorage.setItem('token', data.token)
    localStorage.setItem('name', data.record.name)

    console.log(data)
    router.push('contacts')
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

const adminForgotPassword = async (email: string) => {
  try {
    const response = await instance.post(
      `
api/collections/users/request-password-reset`,
      {
        email: email,
      },
    )

    return
  } catch (error) {
    return Promise.reject(error)
  }
}

export { login, adminForgotPassword }
