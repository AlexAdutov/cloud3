/*
Этот компонент Main представляет главную страницу приложения. Далее приведены подробные комментарии к его структуре:
Импорт необходимых библиотек и стилей.
Использование хука useNavigate для получения функции навигации.
Создание разметки страницы с заголовком, описанием функционала и кнопками перехода.
Кнопки реализованы как обычные блоки с текстом и обработчиками событий для перехода на соответствующие страницы при нажатии.
Внутри кнопок использованы функции навигации из хука useNavigate, чтобы осуществить переход на нужные маршруты.
*/

import { useNavigate } from 'react-router-dom' // Импорт хука навигации из библиотеки react-router-dom

import './Main.scss' // Импорт стилей компонента Main

const Main = () => { // Объявление функционального компонента Main
  const navigate = useNavigate() // Получение функции навигации из хука useNavigate

  return ( // Возврат JSX разметки компонента
    <section className="main-container"> {/* Создание секции для контента */}
      <div className="main-container__content"> {/* Создание контейнера для содержимого */}
        <div className="main-container__title"> {/* Создание заголовка */}
          Облачное хранилище {/* Текст заголовка */}
        </div>
        <div className="main-container__text"> {/* Создание контейнера для текстового описания */}
          Функционал: {/* Заголовок списка функционала */}
          <ul> {/* Создание маркированного списка */}
            <li>Загрузка файлов на сервер / скачивание</li> {/* Пункт списка */}
            <li>Изменение данных файлов на сервере</li> {/* Пункт списка */}
            <li>Генерация короткой ссылки на файл для внешнего доступа</li> {/* Пункт списка */}
            <li>Панель администратора для управления всеми хранилищами и пользователями</li> {/* Пункт списка */}
          </ul>
        </div>
        <div className="main-container__buttons"> {/* Создание контейнера для кнопок */}
          <div className="main-container__registration-button button" onClick={() => (navigate('/registration'))}> {/* Кнопка для перехода на страницу регистрации */}
            Зарегистрироваться {/* Текст на кнопке */}
          </div>
          <div className="main-container__login-button button" onClick={() => (navigate('/login'))}> {/* Кнопка для перехода на страницу входа */}
            Войти {/* Текст на кнопке */}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Main // Экспорт компонента Main для его дальнейшего использования