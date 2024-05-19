const getShortFilename = (filename, maxLength) => {
  if (filename.length > maxLength) {
    return filename.slice(0, maxLength - 3) + '...';
  }
  return filename
}

export default getShortFilename