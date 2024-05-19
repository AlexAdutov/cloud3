/*
Этот компонент представляет собой форму загрузки файлов в облачное хранилище. Давайте разберем его функционал:
Импорт библиотек и пользовательских хуков:
Импортируются необходимые функции и хуки из библиотеки React, такие как useContext, useEffect, useState.
Импортируется пользовательский хук useRequest, который предназначен для выполнения HTTP-запросов.
Импортируются вспомогательные функции getShortFilename и getConvertedFileSize из соответствующих утилит.
Импорт компонентов и стилей:
Импортируются компоненты Loader и SystemMessage для отображения индикатора загрузки и системных сообщений соответственно.
Импортируются стили из файла Uploader.scss.
Импортируются иконки для элементов управления загрузкой файла.
Объявление компонента Uploader:
Создается функциональный компонент Uploader.
Определяются состояния для файла (file) и комментария к файлу (comment).
Обработка событий загрузки файла:
Функция fileHandler вызывается при выборе файла пользователем. Она устанавливает выбранный файл в состояние.
Функция cancelFile используется для отмены выбора файла.
Отправка файла на сервер:
Функция uploadFile вызывается при нажатии на кнопку загрузки файла. Она формирует объект FormData, содержащий файл и дополнительные данные (ID пользователя и комментарий), и отправляет его на сервер.
Обработка результатов загрузки:
После загрузки файла на сервер происходит обновление данных (setUpdateDataFlag).
Если загрузка прошла успешно, состояние файла и комментария сбрасываются, а также выводится сообщение об успешной загрузке.
Если произошла ошибка, выводится сообщение об ошибке.
Отображение формы загрузки файла:
Если файл не выбран (!file), отображается область для выбора файла.
Если файл выбран, отображается информация о файле, возможность ввода комментария и кнопки для загрузки и отмены.
Использование контекста:
Используется контекст CloudContext для доступа к данным пользователя.
Экспорт компонента:
Компонент Uploader экспортируется для дальнейшего использования в других частях приложения.
Этот компонент предоставляет удобный интерфейс для загрузки файлов в облачное хранилище с возможностью добавления комментариев к файлам.
*/

// Импорт библиотек и пользовательских хуков
import { useContext, useEffect, useState } from 'react'
import useRequest from '../../hooks/useRequest.jsx' // Подключение пользовательского хука для выполнения HTTP-запросов
import getShortFilename from '../../utils/getFilename.js' // Вспомогательная функция для получения короткого имени файла
import getConvertedFileSize from '../../utils/getConvertedFileSize.js' // Вспомогательная функция для конвертации размера файла

// Импорт компонентов и стилей
import Loader from '../common/Loader/Loader.jsx' // Компонент индикатора загрузки
import SystemMessage from '../common/SystemMessage/SystemMessage.jsx' // Компонент для вывода системных сообщений
import { CloudContext } from '../../contexts/CloudContext.js' // Импорт контекста приложения
import './Uploader.scss' // Стили для компонента
import addIcon from '../../images/icons/add_icon.svg' // Иконка добавления файла
import cancelIcon from '../../images/icons/cancel_icon.svg' // Иконка отмены
import uploadIcon from '../../images/icons/upload_icon.svg' // Иконка загрузки файла


// Объявление компонента Uploader
const Uploader = () => {
  const { userID, setUpdateDataFlag } = useContext(CloudContext) // Получение данных пользователя из контекста

  const [file, setFile] = useState(null) // Состояние для файла
  const [comment, setComment] = useState('') // Состояние для комментария к файлу
  const [dataUpload, loadingUpload, errorUpload, requestUpload] = useRequest('uploader') // Использование пользовательского хука для выполнения HTTP-запросов


  // Обработчик выбора файла пользователем
const fileHandler = (e) => {
  setFile(e.target.files[0]) // Установка выбранного файла в состояние
}

// Функция для отмены выбора файла
const cancelFile = () => {
  setFile(null) // Сброс выбранного файла
}

// Функция для загрузки файла на сервер
const uploadFile = async () => {
  // Создание объекта FormData для передачи файла на сервер
  let formData = new FormData()
  formData.append('content', file)
  formData.append('cloud_user', userID)
  formData.append('comment', comment)

  // Настройка запроса
  const init = {
    method: 'POST',
    credentials: 'include',
    headers: {},
    body: formData
  }

  await requestUpload('/api/files/upload/', init) // Отправка запроса на сервер
}


// Обработка результатов загрузки
useEffect(() => {
  setTimeout(() => {
    // Обновление данных после загрузки файла
    dataUpload.status === 201 && setUpdateDataFlag(true)
    setFile(null) // Сброс выбранного файла
    setComment('') // Сброс комментария к файлу
  }, 2000)
}, [dataUpload])


// Возвращаемый JSX-код компонента
return (
  <div className="upload-container">
    {!file ? (
      // Область для выбора файла, если файл не выбран
      <>
        <label htmlFor="upload-container__file-input">
          <div className="upload-container__add-file-area">
            <input type="file" id="upload-container__file-input" onChange={fileHandler} />
            <img src={addIcon} alt="Иконка добавления файла" className="upload-container__add-file-icon" />
          </div>
        </label>
      </>
    ) : (
      // Информация о выбранном файле, если файл выбран
      <>
        <div className="upload-container__file-info-area">
          {loadingUpload ? (
            // Индикатор загрузки, если происходит загрузка файла
            <Loader />
          ) : errorUpload ? (
            // Сообщение об ошибке, если произошла ошибка загрузки файла
            <SystemMessage type="error" message="Ошибка связи с сервером" />
          ) : dataUpload.status && dataUpload.status === 201 ? (
            // Сообщение об успешной загрузке файла
            <SystemMessage type="success" message="Файл загружен на сервер" />
          ) : dataUpload.status && dataUpload.status === 400 ? (
            // Сообщение об ошибке, если произошла ошибка на сервере
            <SystemMessage type="error" message={dataUpload.result.content[0]} />
          ) : (
            // Информация о выбранном файле и возможность ввода комментария
            <>
              <div className="upload-container__file">
                <div className="upload-container__file-info-area_top">
                  <div className="upload-container__filename file-info">{getShortFilename(file.name, 50)}</div>
                  <div className="upload-container__filesize file-info">{getConvertedFileSize(file.size)}</div>

                  {/* Кнопки для загрузки и отмены */}
                  <div className="upload-container__button button button_ok" onClick={uploadFile}>
                    <img src={uploadIcon} alt="Иконка отправки файла" className="upload-container__icon" />
                  </div>
                  <div className="upload-container__button button button_cancel" onClick={cancelFile}>
                    <img src={cancelIcon} alt="Иконка отмены" className="upload-container__icon" />
                  </div>
                </div>
                {/* Поле для ввода комментария */}
                <input
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                  className="upload-container__comment-input input"
                  type="text"
                  placeholder="Комментарий к файлу"
                />
              </div>
            </>
          )}
        </div>
      </>
    )}
  </div>
)

}

export default Uploader