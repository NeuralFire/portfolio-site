import { useCallback, useEffect, useState } from 'react'
import { apiClient, getErrorMessage } from '../lib/api.js'

export function useApi(request, options = {}) {
  const { initialData = null, immediate = true } = options
  const [data, setData] = useState(initialData)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(immediate)

  const runRequest = useCallback(async (signal) => {
    setLoading(true)
    setError(null)

    try {
      const result = await request({ client: apiClient, signal })
      if (!signal?.aborted) {
        setData(result)
      }
      return result
    } catch (requestError) {
      if (signal?.aborted) {
        return null
      }
      const message = getErrorMessage(requestError)
      setError(message)
      throw requestError
    } finally {
      if (!signal?.aborted) {
        setLoading(false)
      }
    }
  }, [request])

  useEffect(() => {
    if (!immediate) {
      return undefined
    }

    const controller = new AbortController()
    queueMicrotask(() => {
      runRequest(controller.signal).catch(() => null)
    })

    return () => controller.abort()
  }, [immediate, runRequest])

  const refetch = useCallback(async () => {
    const controller = new AbortController()
    try {
      return await runRequest(controller.signal)
    } finally {
      controller.abort()
    }
  }, [runRequest])

  return {
    data,
    error,
    loading,
    refetch,
  }
}