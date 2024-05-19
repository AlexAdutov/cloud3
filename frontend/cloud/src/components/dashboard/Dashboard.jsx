/*
Этот код представляет компонент Dashboard, который отображает список файлов пользователя в интерфейсе. 
Импорт зависимостей: Импортируются необходимые зависимости, такие как хуки useContext, useEffect из React, а также useParams из react-router-dom для получения параметров маршрута, и пользовательский хук useRequest для выполнения запросов.
Определение компонента и состояний: Создается компонент Dashboard, который получает доступ к параметрам маршрута, контексту приложения и данным о файлах. Используются состояния для отслеживания состояний загрузки файлов и ошибок.
Эффекты: Используются два эффекта useEffect. Первый отправляет запрос на сервер для получения списка файлов пользователя при монтировании компонента или при изменении выбранного пользователя. Второй обновляет данные при изменении флага обновления.
Отображение контента: Компонент Dashboard отображает заголовок, отображающий имя пользователя или информацию о файлах, загрузчик файлов (если пользователь не выбран), а также список файлов пользователя. В зависимости от состояний загрузки файлов и ошибок, отображается либо загрузчик, либо сообщение об ошибке, либо список файлов.
Таким образом, компонент Dashboard предоставляет пользователю интерфейс для просмотра и управления своими файлами в приложении.
*/


import { useContext, useEffect } from 'react' // Импорт хуков useContext, useEffect
import { useParams } from 'react-router-dom' // Импорт хука useParams для доступа к параметрам маршрута
import useRequest from '../../hooks/useRequest.jsx' // Импорт пользовательского хука для запросов

import Uploader from '../uploader/Uploader.jsx' // Импорт компонента загрузчика файлов
import File from '../file/File.jsx' // Импорт компонента файла
import Loader from '../common/Loader/Loader.jsx' // Импорт компонента загрузчика
import SystemMessage from '../common/SystemMessage/SystemMessage.jsx' // Импорт компонента системного сообщения

import { CloudContext } from '../../contexts/CloudContext.js' // Импорт контекста приложения

import './Dashboard.scss' // Импорт файла стилей для компонента Dashboard

// Определение компонента Dashboard
const Dashboard = () => {
  const { selectedUserId } = useParams() // Получение параметров маршрута
  const {updateDataFlag, setUpdateDataFlag, isAuthenticated, userID} = useContext(CloudContext) // Получение данных из контекста приложения
  const [dataFiles, loadingFiles, errorFiles, requestFiles] = useRequest() // Хук запроса для получения данных о файлах

  // Запрос списка файлов при монтировании компонента или изменении выбранного пользователя
  useEffect(() => {
    isAuthenticated && requestFiles(`/api/userfiles/${selectedUserId ? selectedUserId : userID}/`, {credentials: 'include'})
  }, [selectedUserId])

  // Обновление данных при изменении флага обновления
  useEffect(() => {
    if (updateDataFlag) {
      requestFiles(`/api/userfiles/${selectedUserId ? selectedUserId : userID}/`, {credentials: 'include'})
      setUpdateDataFlag(false)
    }
  }, [updateDataFlag])

  return (
    // Разметка компонента Dashboard
    <section className="dashboard-container">
      {/* Заголовок доски, отображающий имя пользователя или информацию о файлах */}
      {dataFiles.status && dataFiles.status === 200 && selectedUserId && <div className="dashboard-container__title">Файлы пользователя {dataFiles.result.username}</div>}
      {dataFiles.status && dataFiles.status === 200 && !selectedUserId && <div className="dashboard-container__title">Мои файлы</div>}
      {/* Отображение загрузчика файлов только если пользователь не выбран */}
      {!selectedUserId && <Uploader/>}
      {/* Список файлов пользователя */}
      <div className="dashboard-container__files">
        {loadingFiles
          ? <Loader/>
          : errorFiles
            ? <SystemMessage type="error" message="Ошибка связи с сервером"/>
            : selectedUserId && dataFiles.result && dataFiles.result.files.length === 0
              ? <div className="text">У пользователя нет файлов</div>
              : !selectedUserId && dataFiles.result && dataFiles.result.files.length === 0
                ? <div className="text">У вас еще нет файлов</div>
                : dataFiles.result && dataFiles.result.files.map((file) => (<File key={file.id} file={file}/>))
        }
      </div>
    </section>
  )
}

export default Dashboard // Экспорт компонента Dashboard