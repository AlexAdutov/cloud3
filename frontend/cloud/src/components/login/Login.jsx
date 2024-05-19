/*
Этот код описывает компонент Login, который представляет собой страницу входа в систему. В данном компоненте пользователь может ввести свои учетные данные (имя пользователя и пароль) для входа в систему.
Основные элементы и их функциональность:
Форма входа:
Содержит поля для ввода имени пользователя и пароля.
При отправке формы происходит попытка аутентификации пользователя с использованием введенных данных.
Обработка входа и выхода из системы:
При успешной аутентификации пользователя его состояние аутентификации обновляется в контексте CloudContext. Пользователь перенаправляется на соответствующую ему страницу (панель инструментов или административная панель).
В случае ошибки аутентификации отображается сообщение об ошибке.
Если пользователь уже аутентифицирован, отображается сообщение о том, что он уже авторизован, и предлагается возможность выйти из системы.
Обработка ошибок и загрузки:
При загрузке данных или выполнении запроса отображается индикатор загрузки.
В случае ошибки связи с сервером отображается сообщение об ошибке.
Регистрация нового пользователя:
Предоставляется ссылка для перехода на страницу регистрации нового пользователя.
Выход из системы:
При нажатии на кнопку "Выйти" происходит отправка запроса на сервер для завершения сеанса пользователя.
Обработка неверных учетных данных:
При получении ошибки 400 от сервера отображается сообщение о неверных учетных данных.
Этот компонент обеспечивает взаимодействие пользователя с системой для процесса аутентификации и управления сеансом.
*/

import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useRequest from '../../hooks/useRequest.jsx'

import Loader from '../common/Loader/Loader.jsx'
import SystemMessage from '../common/SystemMessage/SystemMessage.jsx'

import { CloudContext } from '../../contexts/CloudContext'

import './Login.scss'

const Login = () => {

    // Импорт необходимых хуков и компонентов

  const {isAuthenticated, setIsAuthenticated, setUsername, setUserID, setIsAdmin} = useContext(CloudContext)

    // Состояния для вводимых данных и результатов запросов

  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [dataLogin, loadingLogin, errorLogin, requestLogin] = useRequest()
  const [dataLogout, loadingLogout, errorLogout, requestLogout] = useRequest()

  // Ссылка на элемент для отображения сообщения об ошибке аутентификации

  const loginInvalidDiv = useRef(null)

  // Ссылка для перехода на другие страницы

  const navigate = useNavigate()

    // Функция аутентификации пользователя

  const login = async (e) => {
    e.preventDefault()
    const init = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          username: loginUsername,
          password: loginPassword,
        }
      )
    }
    await requestLogin('/api/login/', init)
  }

    // Функция выхода из системы

  const logout = async () => {
    await requestLogout('/api/logout/', {credentials: 'include'})
  }

    // Обработка успешной аутентификации

  useEffect(() => {
    if (dataLogin.status === 400) {
      // Показать сообщение об ошибке при неверных учетных данных
      dataLogin.result.detail && loginInvalidDiv.current.classList.remove('hidden')
    } else if (dataLogin.status === 200) {
      // Успешный вход в систему
      setTimeout(() => {
        setIsAuthenticated(true)
        setUsername(dataLogin.result.username)
        setUserID(dataLogin.result.userID)
        setIsAdmin(dataLogin.result.isAdmin)
        // Перенаправление пользователя на соответствующую страницу
        dataLogin.result.isAdmin ? navigate('/admin-panel') : navigate('/dashboard')
      }, 2000)
    }
  }, [dataLogin])

    // Обработка успешного выхода из системы
  
  useEffect(() => {
    if (dataLogout.status === 200) {
      setIsAuthenticated(false)
      setUsername(null)
      setUserID(null)
      setIsAdmin(false)
    }
  }, [dataLogout])


  return (
        // Внешний контейнер формы входа
    <section className="login-container">
      <div className="login-container__form">
        <form className="login-container__login-form" onSubmit={login}>
          {loadingLogin || loadingLogout
            ? <Loader />
            : errorLogin || errorLogout
              ? <SystemMessage type="error" message="Ошибка связи с сервером" />
              : dataLogin.status && dataLogin.status === 200
                ? <SystemMessage type="success" message='Успешный вход в систему' />
                : !isAuthenticated
                  ?
                    (
                      <>
                        <input onChange={(e) => setLoginUsername(e.target.value)} value={loginUsername} className="login-container__username-input input" type="text"
                               placeholder="Имя пользователя" autoComplete="username" required/>
                        <input onChange={(e) => setLoginPassword(e.target.value)} value={loginPassword} className="login-container__password-input input" type="password" placeholder="Пароль"
                               autoComplete="current-password" required/>
                        <div ref={loginInvalidDiv} className="login-container__login-invalid hidden">
                          {dataLogin.status === 400 && dataLogin.result.detail}
                        </div>
                        <button className="login-container__button button" type="submit">Войти</button>
                        <p className="login-container__description">Не зарегистрированы? <Link
                          to="/registration">Зарегистрироваться</Link></p>
                      </>
                    )
                  :
                  <>
                    <div className="login-container__text">Вы уже авторизованы</div>
                    <div className="login-container__button button logout-button" onClick={logout}>Выйти</div>
                  </>
          }
        </form>
      </div>
    </section>
  )
}

export default Login