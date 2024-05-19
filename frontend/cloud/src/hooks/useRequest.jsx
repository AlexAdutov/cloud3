/*
Этот кастомный хук useRequest предназначен для выполнения HTTP-запросов на сервер. Он использует состояния data, loading и error, управляемые функцией useState, чтобы отслеживать состояние выполнения запроса и любые возможные ошибки.
Хук принимает параметр mode, который указывает на особенности обработки данных при различных типах запросов.
Внутри хука определена функция request, которая выполняет асинхронный запрос на сервер с использованием fetch. Если указан метод запроса, например, для запроса типа POST, хук получает CSRF-токен с помощью функции getCSRFToken и добавляет его в заголовок запроса X-CSRFToken.
После получения ответа от сервера, хук обрабатывает данные в зависимости от режима mode. Если режим установлен как 'delete', данные не обрабатываются как JSON, а устанавливается только статус ответа. В противном случае, данные парсятся как JSON и устанавливаются в состояние data.
В конце, хук завершает выполнение запроса и обновляет состояния loading и error.
Хук возвращает кортеж из состояний data, loading, error и функции request, которые могут быть использованы в компонентах для управления запросами и отображением состояний загрузки и ошибок.
*/

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