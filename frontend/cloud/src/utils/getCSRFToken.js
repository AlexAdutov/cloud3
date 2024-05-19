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