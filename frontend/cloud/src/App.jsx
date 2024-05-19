import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import useRequest from './hooks/useRequest.jsx'
import PrivateRoutes from './utils/PrivateRoutes.jsx'

import Header from './components/header/Header.jsx'
import Main from './components/main/Main.jsx'
import Login from './components/login/Login.jsx'
import Registration from './components/registration/Registration.jsx'
import AdminPanel from './components/adminpanel/AdminPanel.jsx'
import Dashboard from './components/dashboard/Dashboard.jsx'
import ExternalFileDownload from './components/externalfiledownload/ExternalFileDownload.jsx'
import Loader from './components/common/Loader/Loader.jsx'
import SystemMessage from './components/common/SystemMessage/SystemMessage.jsx'

import { CloudContext } from './contexts/CloudContext.js'

import './App.scss'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined)
  const [isAdmin, setIsAdmin] = useState(undefined)
  const [username, setUsername] = useState(undefined)
  const [userID, setUserID] = useState(undefined)
  const [updateDataFlag, setUpdateDataFlag] = useState(false)
  const [dataSession, loadingSession, errorSession, requestSession] = useRequest()

  useEffect(() => {
    requestSession('/api/session/', {credentials: 'include'})
  }, [])

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
    loadingSession || isAuthenticated === null || isAdmin === null
      ? <Loader />
        : errorSession
        ? <SystemMessage type="error" message="Ошибка связи с сервером"/>
          : isAuthenticated !== undefined
            ?
              (
                <CloudContext.Provider value={{
                    isAuthenticated, setIsAuthenticated,
                    username, setUsername,
                    userID, setUserID,
                    updateDataFlag, setUpdateDataFlag,
                    isAdmin, setIsAdmin
                  }}>
                <Header />
                  <Routes>
                  <Route path="/" element={<Main/>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/registration" element={<Registration />} />
                  <Route element={<PrivateRoutes isAllowed={isAuthenticated && isAdmin} redirectPath = '/' />}>
                    <Route path="/admin-panel" element={<AdminPanel />} exact />
                    <Route path="/dashboard/:selectedUserId" element={<Dashboard />} />
                  </Route>
                  <Route element={<PrivateRoutes isAllowed={isAuthenticated} redirectPath = '/login' />}>
                    <Route path="/dashboard" element={<Dashboard />} exact />
                  </Route>
                  <Route path="/download" element={<ExternalFileDownload />} />
                  <Route path="*" element={<Navigate to='/' replace />} />
                </Routes>
                </CloudContext.Provider>
              )
            : null
  )
}

export default App
