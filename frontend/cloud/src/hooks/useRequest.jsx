import { useState } from 'react'
import getCSRFToken from '../utils/getCSRFToken.js'

const useRequest = (mode) => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = async (url, init) => {
    setLoading(true)

    if (init.method) {
      const CSRFToken = await getCSRFToken()
      init.headers['X-CSRFToken'] = CSRFToken
    }

    try {
      const response = await fetch(import.meta.env.VITE_APP_SERVER_URL + url, init)
      if (mode === 'delete') {
        setData({status: response.status})
      } else {
        const result = await response.json()
        setData({status: response.status, result})
        setTimeout(() => {
          mode === 'uploader' && setData({})
          !response.ok && setData({})
        }, 2000)
      }
    } catch (error) {
      setError(error)
      setTimeout(() => {
        setError(null)
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  return [data, loading, error, request]
}

export default useRequest