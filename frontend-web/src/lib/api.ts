import axios, { AxiosError } from 'axios'
import { getAccessToken } from './auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function getApiErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const message =
      (error.response?.data as { message?: string | string[] } | undefined)?.message ?? error.message
    if (Array.isArray(message)) {
      return message.join(', ')
    }
    return message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Unexpected error'
}

export const apiBaseUrl = API_BASE_URL
