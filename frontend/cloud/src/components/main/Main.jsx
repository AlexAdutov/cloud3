import { useNavigate } from 'react-router-dom'

import './Main.scss'

const Main = () => {
  const navigate = useNavigate()

  return (
    <section className="main-container">
      <div className="main-container__content">
        <div className="main-container__title">
          Облачное хранилище
        </div>
        <div className="main-container__text">
          Функционал:
          <ul>
            <li>Загрузка файлов на сервер / скачивание</li>
            <li>Изменение данных файлов на сервере</li>
            <li>Генерация короткой ссылки на файл для внешнего доступа</li>
            <li>Панель администратора для управления всеми хранилищами и пользователями</li>
          </ul>
        </div>
        <div className="main-container__buttons">
          <div className="main-container__registration-button button" onClick={() => (navigate('/registration'))}>Зарегистрироваться</div>
          <div className="main-container__login-button button" onClick={() => (navigate('/login'))}>Войти</div>
        </div>
      </div>
    </section>
  )
}

export default Main