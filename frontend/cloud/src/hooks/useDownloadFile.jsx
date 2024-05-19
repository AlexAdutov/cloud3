/*
Этот кастомный хук useDownloadFile предназначен для загрузки файлов из облачного сервера. Внутри него используются состояния data, loading и error, управляемые функцией useState, чтобы отслеживать состояние загрузки файла и любые возможные ошибки. Хук экспортирует функцию request, которая выполняет асинхронный запрос на сервер для загрузки файла по указанному URL. При успешной загрузке файла (status === 200) функция создает и активирует ссылку для скачивания файла.
Хук возвращает кортеж из состояний data, loading, error и функции request, которые могут быть использованы в компонентах для управления загрузкой файлов и отображением состояния загрузки.
*/

import { useState } from 'react'

const useDownloadFile = () => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = async (url, init) => {
    setLoading(true)
    try {
      const response = await fetch(import.meta.env.VITE_APP_SERVER_URL + url, init)
      const headers = Object.fromEntries(response.headers.entries())
      const statusCode = response.status
      if (response.status === 200) {
        const result = await response.blob()
        const url = window.URL.createObjectURL(new Blob([result]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', headers.filename)
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
      }
      setData({status: statusCode})
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
      setTimeout(() => {
        setError(null)
      }, 2000)
    }
  }

  return [data, loading, error, request]
}

export default useDownloadFile