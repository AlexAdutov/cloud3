/*
Этот код представляет основной компонент приложения App, написанный с использованием React. 
Импорт зависимостей: Импортируются необходимые зависимости, такие как хуки useEffect и useState из библиотеки React, а также компоненты маршрутизации Routes, Route, Navigate из react-router-dom, пользовательский хук useRequest, компоненты приложения (Header, Main, Login, Registration, AdminPanel, Dashboard, ExternalFileDownload, Loader, SystemMessage) и контекст CloudContext.
Определение состояний: Создаются состояния, которые будут хранить информацию об аутентификации пользователя, его административных правах, имени пользователя, его идентификаторе, а также флаг обновления данных.
Хук запроса данных сессии: Применяется хук useRequest для выполнения запроса на сервер с целью получения данных сессии.
Эффекты: Используются два эффекта useEffect. Первый отправляет запрос на сервер для получения данных сессии при монтировании компонента. Второй обновляет состояния при получении данных сессии или при возникновении ошибки.
Отображение контента: Компонент App возвращает разметку, отображающую загрузчик (Loader), если данные сессии все еще загружаются, либо сообщение об ошибке (SystemMessage), если произошла ошибка. В противном случае отображается основной контент приложения, включая шапку (Header) и маршруты (Routes), внутри которых определены публичные и приватные маршруты для различных страниц (главная страница, страница входа, регистрации, панели администратора, панели инструментов и т. д.).
Таким образом, этот компонент управляет отображением основного интерфейса приложения, включая маршрутизацию и загрузку данных сессии.
*/

import { useEffect, useState } from 'react' // Импорт хуков useEffect, useState
import { Routes, Route, Navigate } from 'react-router-dom' // Импорт компонентов маршрутизации
import useRequest from './hooks/useRequest.jsx' // Импорт пользовательского хука для запросов
import PrivateRoutes from './utils/PrivateRoutes.jsx' // Импорт компонента для приватных маршрутов

import Header from './components/header/Header.jsx' // Импорт компонента шапки
import Main from './components/main/Main.jsx' // Импорт основного компонента
import Login from './components/login/Login.jsx' // Импорт компонента входа
import Registration from './components/registration/Registration.jsx' // Импорт компонента регистрации
import AdminPanel from './components/adminpanel/AdminPanel.jsx' // Импорт компонента панели администратора
import Dashboard from './components/dashboard/Dashboard.jsx' // Импорт компонента панели инструментов
import ExternalFileDownload from './components/externalfiledownload/ExternalFileDownload.jsx' // Импорт компонента загрузки внешнего файла
import Loader from './components/common/Loader/Loader.jsx' // Импорт компонента загрузчика
import SystemMessage from './components/common/SystemMessage/SystemMessage.jsx' // Импорт компонента системного сообщения

import { CloudContext } from './contexts/CloudContext.js' // Импорт контекста приложения

import './App.scss' // Импорт файла стилей для приложения

function App() {
    // Состояния для аутентификации и данных пользователя
  const [isAuthenticated, setIsAuthenticated] = useState(undefined)
  const [isAdmin, setIsAdmin] = useState(undefined)
  const [username, setUsername] = useState(undefined)
  const [userID, setUserID] = useState(undefined)
  const [updateDataFlag, setUpdateDataFlag] = useState(false)

    // Хук запроса для получения данных сессии
  const [dataSession, loadingSession, errorSession, requestSession] = useRequest()

  // Запрос данных сессии при монтировании компонента
  useEffect(() => {
    requestSession('/api/session/', {credentials: 'include'})
  }, [])

  // Обновление состояний при получении данных сессии
  useEffect(() => {
    if (dataSession.status === 200) {
      setIsAuthenticated(true)
      setUserID(dataSession.result.userID)
      setUsername(dataSession.result.username)
      setIsAdmin(dataSession.result.isAdmin)
    } else if (dataSession.status === 403 || errorSession) {
      setIsAuthenticated(false)
      setIsAdmin(false)
    }
  }, [dataSession, errorSession])

  return (
    loadingSession || isAuthenticated === null || isAdmin === null // Отображение загрузчика при загрузке данных или неопределенном статусе аутентификации и администратора
      ? <Loader />
        : errorSession // Отображение сообщения об ошибке при ошибке запроса
        ? <SystemMessage type="error" message="Ошибка связи c сервером"/>
          : isAuthenticated !== undefined // Отображение контента приложения, если статус аутентификации определен
            ?
              (
                <CloudContext.Provider value={{
                    isAuthenticated, setIsAuthenticated,
                    username, setUsername,
                    userID, setUserID,
                    updateDataFlag, setUpdateDataFlag,
                    isAdmin, setIsAdmin
                  }}>
                {/* Шапка приложения */}
       
                <Header />
                  {/* Маршруты приложения */}
       
                  <Routes>
                  {/* Публичные маршруты */}
                  <Route path="/" element={<Main/>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/registration" element={<Registration />} />
                  {/* Приватные маршруты для администратора */}
                  <Route element={<PrivateRoutes isAllowed={isAuthenticated && isAdmin} redirectPath = '/' />}>
                    <Route path="/admin-panel" element={<AdminPanel />} exact />
                    <Route path="/dashboard/:selectedUserId" element={<Dashboard />} />
                  </Route>
                  {/* Приватные маршруты для авторизованных пользователей */}
                  <Route element={<PrivateRoutes isAllowed={isAuthenticated} redirectPath = '/login' />}>
                    <Route path="/dashboard" element={<Dashboard />} exact />
                  </Route>
                  {/* Маршрут для загрузки внешнего файла */}
                  <Route path="/download" element={<ExternalFileDownload />} />
                  <Route path="*" element={<Navigate to='/' replace />} />
                </Routes>
                </CloudContext.Provider>
              )
            : null // Возврат null в случае неопределенного статуса аутентификации
  )
}

export default App
