import axios from 'axios'

const DEFAULT_API_BASE_URL = '/api'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  timeout: 10000,
})

export function getErrorMessage(error) {
  if (error?.code === 'ERR_CANCELED') {
    return 'Request canceled.'
  }

  return (
    error?.response?.data?.detail ??
    error?.message ??
    'Request failed. Check backend availability and try again.'
  )
}