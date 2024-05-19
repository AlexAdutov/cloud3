/*
Этот код представляет компонент ExternalFileDownload, который отображает сообщение об ошибке при попытке загрузки файла, который не найден в системе, а также кнопку для перехода на главную страницу приложения.
Комментарии в коде поясняют, что делает каждая часть компонента:
import { useNavigate } from 'react-router-dom';: Импорт хука useNavigate из библиотеки react-router-dom, который используется для навигации между маршрутами.
const navigate = useNavigate();: Использование хука useNavigate для получения функции navigate, которая будет использоваться для перехода на другие маршруты.
<div className="external-download-container">...</div>: Разметка компонента ExternalFileDownload, который содержит контейнер для отображения сообщения об ошибке и кнопки для перехода на главную страницу.
<div className="external-download-container__download-error">Данный файл не найден в системе.</div>: Отображение сообщения об ошибке о том, что файл не найден.
<div className="button" onClick={() => navigate('/')}>На главную</div>: Кнопка "На главную", при клике на которую происходит вызов функции navigate('/'), что приводит к переходу на главную страницу приложения.
export default ExternalFileDownload;: Экспорт компонента ExternalFileDownload для использования в других частях приложения.
*/

import { useNavigate } from 'react-router-dom'; // Импорт хука для перехода между маршрутами

import './ExternalFileDownload.scss'; // Импорт файла стилей для компонента ExternalFileDownload

// Определение компонента ExternalFileDownload
const ExternalFileDownload = () => {
  const navigate = useNavigate(); // Получение функции для навигации

  return (
    // Разметка компонента ExternalFileDownload
    <div className="external-download-container">
      <div className="external-download-container__file">
          <div className="external-download-container__download-error">Данный файл не найден в системе.</div>
          <div className="button" onClick={() => navigate('/')}>На главную</div>
      </div>
    </div>
  )
}

export default ExternalFileDownload // Экспорт компонента ExternalFileDownload