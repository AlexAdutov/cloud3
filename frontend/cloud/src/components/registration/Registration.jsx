import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useRequest from '../../hooks/useRequest.jsx'

import Loader from '../common/Loader/Loader.jsx'
import SystemMessage from '../common/SystemMessage/SystemMessage.jsx'

import './Registration.scss'

const Registration = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [dataRegistration, loadingRegistration, errorRegistration, requestRegistration] = useRequest()

  const usernameInvalidDiv = useRef(null)
  const passwordInvalidDiv = useRef(null)
  const usernameNoteDiv = useRef(null)
  const passwordNoteDiv = useRef(null)
  const emailInvalidDiv = useRef(null)

  const navigate = useNavigate()

  const registerUser = async (e) => {
    e.preventDefault()
    const init = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(
              {
                username: username,
                password: password,
                email: email
              }
            )
          }
    await requestRegistration('/api/users/registration/', init)
  }

  useEffect(() => {
    if (dataRegistration.status === 400) {
      dataRegistration.result.username && usernameInvalidDiv.current.classList.remove('hidden')
      dataRegistration.result.password && passwordInvalidDiv.current.classList.remove('hidden')
      dataRegistration.result.email && emailInvalidDiv.current.classList.remove('hidden')
    } else if (dataRegistration.status === 201) {
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    }
  }, [dataRegistration])

  return (
    <section className="registration-container">
      <div className="registration-container__form">
        <form className="registration-container__register-form" onSubmit={registerUser}>
          {loadingRegistration
            ? <Loader />
            : errorRegistration
              ? <SystemMessage type="error" message="Ошибка связи с сервером" />
              : dataRegistration.status && dataRegistration.status === 201
                ? <SystemMessage type="success" message="Успешная регистрация" />
                :
                  <>
                    <input onFocus={() => usernameNoteDiv.current.style.opacity = '1'} onBlur={() => usernameNoteDiv.current.style.opacity = '0'} onChange={(e) => setUsername(e.target.value)} value={username} className="registration-container__username-input input" type="text"
                          placeholder="Имя пользователя" autoComplete="username" required />
                    <div ref={usernameNoteDiv} className="registration-container__username-note">Латинские буквы и цифры, первый символ — буква, длина от 4 до 20 символов</div>
                    <div ref={usernameInvalidDiv} className="registration-container__username-invalid hidden">
                      {dataRegistration.status === 400 && dataRegistration.result.username && dataRegistration.result.username[0]}
                    </div>

                    <input onFocus={() => passwordNoteDiv.current.style.opacity = '1'} onBlur={() => passwordNoteDiv.current.style.opacity = '0'} onChange={(e) => setPassword(e.target.value)} value={password} className="registration-container__password-input input" type="password"
                          placeholder="Пароль" autoComplete="new-password" required />
                    <div ref={passwordNoteDiv} className="registration-container__password-note">Не менее 6 символов: минимум одна заглавная буква, одна цифра и один специальный символ</div>
                    <div ref={passwordInvalidDiv} className="registration-container__password-invalid hidden">
                      {dataRegistration.status === 400 && dataRegistration.result.password && dataRegistration.result.password[0]}
                    </div>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} className="registration-container__email input" type="text"
                           placeholder="E-mail" required />
                    <div ref={emailInvalidDiv} className="registration-container__email-invalid hidden">
                      {dataRegistration.status === 400 && dataRegistration.result.email && dataRegistration.result.email[0]}
                    </div>
                    <button className="registration-container__button button" type="submit">Создать</button>
                    <p className="registration-container__description">Уже зарегистрированы? <Link
                      to="/login">Войти</Link></p>
                  </>
          }
        </form>
      </div>
    </section>
  )
}

export default Registration