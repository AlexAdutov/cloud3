/*Этот код описывает компонент Header, который представляет собой шапку веб-приложения. В шапке содержатся элементы навигации, такие как логотип, ссылки на разделы приложения и возможность выхода из системы.
Основные элементы и их функциональность:
Логотип: Отображается текст "CLOUD", который является ссылкой на главную страницу приложения.
Навигационное меню: Содержит список пунктов меню, которые могут варьироваться в зависимости от статуса аутентификации пользователя и его роли (администратор или обычный пользователь).
Пункты меню:
Если пользователь не аутентифицирован, отображается ссылка на страницу входа.
Если пользователь аутентифицирован:
Отображается ссылка на страницу с панелью инструментов пользователя (Dashboard) с указанием имени пользователя.
Предоставляется возможность выхода из системы.
Выход из системы: При нажатии на пункт "Выйти" происходит отправка запроса на сервер для завершения сеанса пользователя. После успешного выхода из системы происходит обновление состояний в контексте CloudContext, и пользователь перенаправляется на страницу входа.
Для выполнения запросов используется пользовательский хук useRequest, который предоставляет функциональность отправки запросов на сервер. Используется контекст CloudContext, который предоставляет доступ к основным состояниям приложения, таким как статус аутентификации пользователя, его имя и роль.
*/

import { useContext, useEffect } from 'react'; // Импорт хуков useContext и useEffect из React
import { Link } from 'react-router-dom'; // Импорт компонента Link из react-router-dom для создания ссылок
import useRequest from '../../hooks/useRequest.jsx'; // Импорт пользовательского хука useRequest для выполнения запросов

import { CloudContext } from '../../contexts/CloudContext.js'; // Импорт контекста CloudContext

import './Header.scss'; // Импорт файла стилей для компонента Header

// Компонент Header
const Header = () => {
  // Получение состояний из контекста CloudContext
  const { isAuthenticated, setIsAuthenticated, username, setUsername, setUserID, isAdmin, setIsAdmin } = useContext(CloudContext);
  // Использование пользовательского хука useRequest для выполнения запросов
  const [dataLogout, loadingLogout, errorLogout, requestLogout] = useRequest();

  // Функция для выхода из системы
  const logout = async () => {
    await requestLogout('/api/logout/', { credentials: 'include' });
  };

  // Эффект для обработки данных после выхода из системы
  useEffect(() => {
    // Если статус выхода из системы успешный
    if (dataLogout.status === 200) {
      // Сброс состояний пользователя
      setIsAuthenticated(false);
      setUsername(false);
      setUserID(false);
      setIsAdmin(false);
    }
  }, [dataLogout]);

    // Возврат JSX компонента Headeк

  return (
    <header className="header">
      <Link to="/"><div className="header__logo">CLOUD</div></Link>
      <nav className="header__nav">
        <ul className="header__nav-items">
          {isAdmin && <li className="header__nav-item"><Link to="/admin-panel">Панель управления</Link></li>}
          {!isAuthenticated
            ? <li className="header__nav-item"><Link to="/login">Войти</Link></li>
            :
              <>
                <li className="header__nav-item header__nav-item_username"><Link to="/dashboard">{username}</Link></li>
                <li className="header__nav-item" onClick={logout}>Выйти</li>
              </>
          }
        </ul>
      </nav>
    </header>
  )
}

export default Header