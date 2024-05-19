import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useRequest from '../../hooks/useRequest.jsx'

import Loader from '../common/Loader/Loader.jsx'
import SystemMessage from '../common/SystemMessage/SystemMessage.jsx'

import { CloudContext } from '../../contexts/CloudContext'

import './Login.scss'

const Login = () => {

  const {isAuthenticated, setIsAuthenticated, setUsername, setUserID, setIsAdmin} = useContext(CloudContext)

  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [dataLogin, loadingLogin, errorLogin, requestLogin] = useRequest()
  const [dataLogout, loadingLogout, errorLogout, requestLogout] = useRequest()

  const loginInvalidDiv = useRef(null)
  const navigate = useNavigate()

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

  const logout = async () => {
    await requestLogout('/api/logout/', {credentials: 'include'})
  }

  useEffect(() => {
    if (dataLogin.status === 400) {
      dataLogin.result.detail && loginInvalidDiv.current.classList.remove('hidden')
    } else if (dataLogin.status === 200) {
      setTimeout(() => {
        setIsAuthenticated(true)
        setUsername(dataLogin.result.username)
        setUserID(dataLogin.result.userID)
        setIsAdmin(dataLogin.result.isAdmin)
        dataLogin.result.isAdmin ? navigate('/admin-panel') : navigate('/dashboard')
      }, 2000)
    }
  }, [dataLogin])

  useEffect(() => {
    if (dataLogout.status === 200) {
      setIsAuthenticated(false)
      setUsername(null)
      setUserID(null)
      setIsAdmin(false)
    }
  }, [dataLogout])


  return (
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