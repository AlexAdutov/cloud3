/*Этот код представляет компонент AdminPanel, который отображает список пользователей системы в интерфейсе администратора. Вот его функциональность:
Импортируются необходимые зависимости, такие как хуки useContext, useEffect, и useRequest, компоненты User, Loader, и SystemMessage, а также контекст CloudContext и файл стилей для панели администратора.
В компоненте AdminPanel используется хук useContext для получения состояний из контекста приложения, таких как флаги аутентификации и администратора.
Затем используется хук useRequest для выполнения запроса на сервер и получения списка пользователей системы.
При монтировании компонента или при изменении флага обновления данных (updateDataFlag), отправляется запрос на сервер для получения списка пользователей.
В зависимости от состояния загрузки данных (loadingUsers), отображается либо компонент Loader для отображения процесса загрузки, либо сообщение об ошибке (SystemMessage), если запрос завершился с ошибкой.
Если запрос успешно выполнен и получены данные (статус ответа 200), отображается список пользователей (User), каждый из которых передается в компонент User в качестве пропса.
Таким образом, компонент AdminPanel предоставляет интерфейс администратора для просмотра списка пользователей системы и обрабатывает состояния загрузки данных и ошибок запроса.*/

import { useContext, useEffect } from 'react'
import useRequest from '../../hooks/useRequest.jsx'

import User from '../user/User.jsx'
import Loader from '../common/Loader/Loader.jsx'
import SystemMessage from '../common/SystemMessage/SystemMessage.jsx'

import { CloudContext } from '../../contexts/CloudContext.js'

import './AdminPanel.scss'

const AdminPanel = () => {

  const {updateDataFlag, setUpdateDataFlag, isAuthenticated, isAdmin} = useContext(CloudContext)
  const [dataUsers, loadingUsers, errorUsers, requestUsers] = useRequest()

  useEffect(() => {
    isAuthenticated && isAdmin && requestUsers(`/api/users/`, {credentials: 'include'})
  }, [])

  useEffect(() => {
    if (updateDataFlag) {
      requestUsers(`/api/users/`, {credentials: 'include'})
      setUpdateDataFlag(false)
    }
  }, [updateDataFlag])

  return (
    <section className="admin-panel-container">
      <div className="admin-panel-container__title">Пользователи системы</div>
      <div className="admin-panel-container__users">
        {loadingUsers
          ? <Loader/>
          : errorUsers
            ? <SystemMessage type="error" message="Ошибка связи с сервером"/>
            : dataUsers.status && dataUsers.status === 200
              ? dataUsers.result.map((user) => (<User key={user.id} user={user}/>))
              : null
        }
      </div>
    </section>
  )
}

export default AdminPanel