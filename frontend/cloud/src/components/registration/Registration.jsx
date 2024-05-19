/*
Этот компонент представляет собой страницу регистрации нового пользователя в облачном хранилище. 
Импорт библиотек и пользовательских хуков:
Импортируются необходимые функции и хуки из библиотеки React и ее расширений, таких как useState, useEffect, useRef, а также Link и useNavigate из react-router-dom.
Импортируется пользовательский хук useRequest, который предназначен для выполнения HTTP-запросов.
Импорт компонентов и стилей:
Импортируются компоненты Loader и SystemMessage для отображения индикатора загрузки и системных сообщений соответственно.
Импортируются стили из файла Registration.scss.
Объявление компонента Registration:
Создается функциональный компонент Registration.
Внутри компонента определяются состояния для имени пользователя (username), пароля (password), и email (email).
Используется пользовательский хук useRequest для отправки запросов на сервер.
Обработка событий и отправка запроса на регистрацию:
Определяется функция registerUser, которая отправляет POST-запрос на сервер с данными пользователя (имя, пароль, email), когда форма отправляется.
Эффект useEffect следит за изменениями в dataRegistration и обрабатывает результат запроса: в случае ошибки отображает сообщения об ошибках, а в случае успешной регистрации перенаправляет пользователя на страницу входа.
Рендеринг формы регистрации:
Компонент отображает различные элементы формы, такие как поля ввода для имени пользователя, пароля и email, кнопку "Создать" для отправки формы.
Если данные загружаются, отображается компонент Loader.
При возникновении ошибок или успешной регистрации отображается соответствующее сообщение.
Использование рефов для управления видимостью сообщений об ошибках:
Используются рефы (useRef) для доступа к DOM-элементам и управления их видимостью при возникновении ошибок при регистрации.
Навигация:
Используется хук useNavigate для программной навигации пользователя при успешной регистрации или при необходимости перехода на другую страницу.
Экспорт компонента:
Компонент Registration экспортируется для дальнейшего использования в других частях приложения.
Этот компонент предоставляет форму регистрации для пользователей, которые хотят получить доступ к облачному хранилищу.
*/

import { useEffect, useRef, useState } from 'react' // Импорт необходимых хуков и функций из библиотеки react
import { Link, useNavigate } from 'react-router-dom' // Импорт хука навигации и компонента Link из библиотеки react-router-dom
import useRequest from '../../hooks/useRequest.jsx' // Импорт пользовательского хука useRequest

import Loader from '../common/Loader/Loader.jsx' // Импорт компонента Loader
import SystemMessage from '../common/SystemMessage/SystemMessage.jsx' // Импорт компонента SystemMessage

import './Registration.scss' // Импорт стилей компонента Registration

const Registration = () => { // Объявление функционального компонента Registration
  const [username, setUsername] = useState('') // Состояние для имени пользователя
  const [password, setPassword] = useState('') // Состояние для пароля
  const [email, setEmail] = useState('') // Состояние для email

  const [dataRegistration, loadingRegistration, errorRegistration, requestRegistration] = useRequest() // Использование пользовательского хука для обработки запроса регистрации

  const usernameInvalidDiv = useRef(null) // Ссылка на невалидный блок имени пользователя
  const passwordInvalidDiv = useRef(null) // Ссылка на невалидный блок пароля
  const usernameNoteDiv = useRef(null) // Ссылка на блок с замечаниями для имени пользователя
  const passwordNoteDiv = useRef(null) // Ссылка на блок с замечаниями для пароля
  const emailInvalidDiv = useRef(null) // Ссылка на невалидный блок email

  const navigate = useNavigate() // Получение функции навигации из хука useNavigate

  const registerUser = async (e) => { // Функция для отправки запроса на регистрацию
    e.preventDefault() // Предотвращение действия по умолчанию при отправке формы
    const init = { // Настройки для запроса
            method: 'POST', // Метод POST
            headers: { // Заголовки запроса
              'Content-Type': 'application/json' // Тип содержимого - JSON
            },
            body: JSON.stringify( // Преобразование данных в формат JSON и отправка
              {
                username: username, // Имя пользователя
                password: password, // Пароль
                email: email // Email
              }
            )
          }
    await requestRegistration('/api/users/registration/', init) // Отправка запроса на регистрацию
  }

  useEffect(() => { // Эффект для обработки результата запроса регистрации
    if (dataRegistration.status === 400) { // Если получен статус 400 (ошибка запроса)
      dataRegistration.result.username && usernameInvalidDiv.current.classList.remove('hidden') // Показать блок с ошибкой имени пользователя, если есть
      dataRegistration.result.password && passwordInvalidDiv.current.classList.remove('hidden') // Показать блок с ошибкой пароля, если есть
      dataRegistration.result.email && emailInvalidDiv.current.classList.remove('hidden') // Показать блок с ошибкой email, если есть
    } else if (dataRegistration.status === 201) { // Если получен статус 201 (успешное создание)
      setTimeout(() => { // Задержка для перенаправления после успешной регистрации
        navigate('/login') // Перенаправление на страницу входа
      }, 2000) // Задержка в 2 секунды
    }
  }, [dataRegistration]) // Зависимость для повторного запуска эффекта при изменении статуса регистрации

  return ( // Возврат JSX разметки компонента
    <section className="registration-container"> {/* Создание секции для контента */}
      <div className="registration-container__form"> {/* Создание контейнера для формы */}
        <form className="registration-container__register-form" onSubmit={registerUser}> {/* Создание формы для регистрации */}
          {loadingRegistration // Проверка загрузки данных
            ? <Loader /> // Отображение компонента загрузки, если данные загружаются
            : errorRegistration // Проверка наличия ошибки
              ? <SystemMessage type="error" message="Ошибка связи с сервером" /> // Отображение сообщения об ошибке
              : dataRegistration.status && dataRegistration.status === 201 // Проверка успешного статуса регистрации
                ? <SystemMessage type="success" message="Успешная регистрация" /> // Отображение сообщения об успешной регистрации
                :
                  <> {/* Рендеринг разметки для регистрации */}
                    <input onFocus={() => usernameNoteDiv.current.style.opacity = '1'} onBlur={() => usernameNoteDiv.current.style.opacity = '0'} onChange={(e) => setUsername(e.target.value)} value={username} className="registration-container__username-input input" type="text"
                          placeholder="Имя пользователя" autoComplete="username" required /> {/* Поле ввода для имени пользователя */}
                    <div ref={usernameNoteDiv} className="registration-container__username-note">Латинские буквы и цифры, первый символ — буква, длина от 4 до 20 символов</div> {/* Замечание к полю имени пользователя */}
                    <div ref={usernameInvalidDiv} className="registration-container__username-invalid hidden"> {/* Блок с ошибкой имени пользователя */}
                      {dataRegistration.status === 400 && dataRegistration.result.username && dataRegistration.result.username[0]} {/* Отображение сообщения об ошибке имени пользователя */}
                    </div>

                    <input onFocus={() => passwordNoteDiv.current.style.opacity = '1'} onBlur={() => passwordNoteDiv.current.style.opacity = '0'} onChange={(e) => setPassword(e.target.value)} value={password} className="registration-container__password-input input" type="password"
                          placeholder="Пароль" autoComplete="new-password" required /> {/* Поле ввода для пароля */}
                    <div ref={passwordNoteDiv} className="registration-container__password-note">Не менее 6 символов: минимум одна заглавная буква, одна цифра и один специальный символ</div> {/* Замечание к полю пароля */}
                    <div ref={passwordInvalidDiv} className="registration-container__password-invalid hidden"> {/* Блок с ошибкой пароля */}
                      {dataRegistration.status === 400 && dataRegistration.result.password && dataRegistration.result.password[0]} {/* Отображение сообщения об ошибке пароля */}
                    </div>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} className="registration-container__email input" type="text"
                           placeholder="E-mail" required /> {/* Поле ввода для email */}
                    <div ref={emailInvalidDiv} className="registration-container__email-invalid hidden"> {/* Блок с ошибкой email */}
                      {dataRegistration.status === 400 && dataRegistration.result.email && dataRegistration.result.email[0]} {/* Отображение сообщения об ошибке email */}
                    </div>
                    <button className="registration-container__button button" type="submit">Создать</button> {/* Кнопка для отправки формы */}
                    <p className="registration-container__description">Уже зарегистрированы? <Link // Ссылка на страницу входа
                      to="/login">Войти</Link></p> {/* Текст ссылки */}
                  </>
          }
        </form>
      </div>
    </section>
  )
}

export default Registration // Экспорт компонента Registration для его дальнейшего использования