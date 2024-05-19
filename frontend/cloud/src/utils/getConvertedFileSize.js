const getConvertedFileSize = (sizeInBytes) => {
  let sizeInKB = sizeInBytes / 1024
  let sizeInMB = sizeInKB / 1024
  let sizeInGB = sizeInMB / 1024
  if (sizeInBytes > 1024 * 1024 && sizeInBytes < 1024 * 1024 * 1024) {
    return sizeInMB.toFixed(2) + ' Мб';
  } else if (sizeInBytes >= 1024 * 1024 * 1024) {
    return sizeInGB.toFixed(2) + ' Гб';
  } else {
    return sizeInKB.toFixed(2) + ' Кб';
  }
}

export default getConvertedFileSize