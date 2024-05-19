const getTime = (datetime) => {
  if (datetime) {
    const date = new Date(datetime)
    return `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)} 
    ${('0' + date.getDate()).slice(-2)}.${('0' + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear()}`
  }
  return null
}

export default getTime