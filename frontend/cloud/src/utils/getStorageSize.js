/*
Функция getStorageSize принимает массив файлов и возвращает общий размер всех файлов в байтах.

Функция принимает один параметр files, который представляет собой массив объектов файлов.
Затем функция создает переменную totalSize, которая будет содержать общий размер всех файлов.
В цикле for функция проходит по каждому файлу в массиве files и добавляет его размер к переменной totalSize.
После обработки всех файлов функция возвращает общий размер всех файлов в байтах.
Например, если вызвать getStorageSize([{name: 'file1.txt', size: 1024}, {name: 'file2.txt', size: 2048}]), функция вернет 3072, так как общий размер двух файлов составляет 3072 байт.*/


const getStorageSize = (files) => {
  let totalSize = 0
  for (let i = 0; i < files.length; i++) {
    totalSize += files[i].size
  }
  return totalSize
}

export default getStorageSize