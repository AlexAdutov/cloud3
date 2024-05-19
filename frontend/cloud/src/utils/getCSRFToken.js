/*Эта функция getCSRFToken выполняет асинхронный запрос к серверу для получения токена CSRF (Cross-Site Request Forgery). CSRFToken, если он доступен, затем возвращается из функции.

Внутри функции выполняется запрос к /api/csrf/ на сервере.
Запрос включает параметр credentials: 'include', чтобы включить отправку и принятие куки, необходимых для аутентификации.
После получения ответа от сервера функция пытается преобразовать ответ в формат JSON.
Если статус ответа равен 200, функция извлекает токен CSRF из JSON-ответа и возвращает его. В противном случае возвращается null.
Функция может использоваться для получения токена CSRF, который затем может быть включен в заголовок запроса для защиты от атак CSRF при выполнении запросов к серверу.
*/

const getCSRFToken = async () => {
  let CSRFToken
  try {
    const response = await fetch(
      import.meta.env.VITE_APP_SERVER_URL + '/api/csrf/', {credentials: 'include'})
    const result = await response.json()
    CSRFToken = response.status === 200 ? result.csrf : null
  } catch (error) {
    CSRFToken = null
  }
  return CSRFToken
}

export default getCSRFToken