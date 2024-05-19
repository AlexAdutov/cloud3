/*
Этот код определяет компонент SystemMessage, который отображает сообщение в интерфейсе, сопровождаемое иконкой для сообщений об успехе или ошибке.
Комментарии в коде поясняют, что делает каждая часть компонента:
import errorIcon from '../../../images/icons/error_icon.svg';: Импорт иконки для сообщений об ошибке.
import successIcon from '../../../images/icons/success_icon.svg';: Импорт иконки для сообщений об успехе.
import './SystemMessage.scss';: Импорт файла стилей для компонента SystemMessage.
const SystemMessage = (props) => { ... }: Определение компонента SystemMessage в виде функционального компонента.
return ( ... ): Возвращает разметку компонента SystemMessage, которая включает в себя иконку и текст сообщения.
{props.type === 'success' ? ... : ... }: Условный рендеринг иконки в зависимости от типа сообщения.
{props.message}: Отображение текста сообщения.
export default SystemMessage;: Экспорт компонента SystemMessage для дальнейшего использования в других частях приложения.*/

import errorIcon from '../../../images/icons/error_icon.svg' // Импорт иконки ошибки
import successIcon from '../../../images/icons/success_icon.svg' // Импорт иконки успеха


import './SystemMessage.scss' // Импорт файла стилей для компонента SystemMessage

const SystemMessage = (props) => {

  return (
    // Разметка компонента SystemMessage
    <div className={`system-message ${props.type}`}>
      {/* Условный рендеринг иконки в зависимости от типа сообщения */}
      {props.type === 'success'
        ? <img src={successIcon} alt="Иконка Успех" className="system-message__icon"/>
        : <img src={errorIcon} alt="Иконка Ошибка" className="system-message__icon"/>
      }
      {props.message} {/* Отображение текста сообщения */}
    </div>
  )
}

export default SystemMessage // Экспорт компонента SystemMessage