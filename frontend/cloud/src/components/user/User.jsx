/*
Компонент User представляет собой элемент интерфейса, отображающий информацию о пользователе. Он позволяет администратору просматривать, редактировать и удалять пользователей. В компоненте реализован следующий функционал:
Отображение имени пользователя, его электронной почты, даты регистрации и последнего входа.
Отображение количества файлов пользователя и общего размера файлов.
Возможность переключения прав администратора для каждого пользователя.
Возможность удаления пользователя.
Возможность открытия профиля пользователя для просмотра файлов и другой информации.
Компонент также обеспечивает визуальное отображение состояний загрузки данных, обработки ошибок и успешного выполнения операций.
*/


// Импорт библиотек и пользовательских хуков
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useRequest from '../../hooks/useRequest.jsx' // Подключение пользовательского хука для выполнения HTTP-запросов
import getStorageSize from '../../utils/getStorageSize.js' // Вспомогательная функция для вычисления общего размера файлов
import getConvertedFileSize from '../../utils/getConvertedFileSize.js' // Вспомогательная функция для конвертации размера файла
import getTime from '../../utils/getTime.js' // Вспомогательная функция для форматирования времени

// Импорт компонентов и стилей
import Loader from '../common/Loader/Loader.jsx' // Компонент индикатора загрузки
import SystemMessage from '../common/SystemMessage/SystemMessage.jsx' // Компонент для вывода системных сообщений
import { CloudContext } from '../../contexts/CloudContext.js' // Импорт контекста приложения
import './User.scss' // Стили для компонента
import deleteIcon from '../../images/icons/delete_icon.svg' // Иконка удаления
import openIcon from '../../images/icons/open_icon.svg' // Иконка открытия профиля пользователя


// Объявление компонента User
const User = (props) => {
  const { setUpdateDataFlag, userID } = useContext(CloudContext) // Получение данных пользователя из контекста

  // Использование пользовательских хуков для выполнения HTTP-запросов
  const [dataDelete, loadingDelete, errorDelete, requestDelete] = useRequest('delete')
  const [dataAdminRights, loadingAdminRights, errorAdminRights, requestAdminRights] = useRequest()

  const navigate = useNavigate() // Хук для навигации по приложению


    // Функция для перехода к панели пользователя
    const goToUserDashboard = (e) => {
      // Переход на страницу панели пользователя в зависимости от прав доступа
      userID === +e.currentTarget.dataset.id
        ? navigate(`/dashboard`)
        : navigate(`/dashboard/${e.currentTarget.dataset.id}`)
    }
  
    // Функция для удаления пользователя
    const deleteUser = async (e) => {
      const userId = e.currentTarget.dataset.id // Получение идентификатора пользователя
      const init = {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
      await requestDelete(`/api/users/${userId}/`, init) // Отправка запроса на удаление пользователя
    }
  
    // Функция для переключения прав администратора
    const toggleAdminRights = async (e) => {
      const userId = e.currentTarget.dataset.id // Получение идентификатора пользователя
      const init = {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            is_superuser: e.currentTarget.checked // Установка значения прав администратора
          }
        )
      }
      requestAdminRights(`/api/users/${userId}/`, init) // Отправка запроса на изменение прав администратора
    }
  

  useEffect(() => {
    (dataDelete.status === 204 || dataAdminRights.status === 200) && setUpdateDataFlag(true)
  }, [dataDelete, dataAdminRights])

  return (
    <div className="user-container">
      {loadingDelete || loadingAdminRights
        ? <Loader />
        : errorDelete || errorAdminRights
          ? <SystemMessage type="error" message="Ошибка связи с сервером" />
          :
            <>
              <div className="user-container__top-area">
                <div className="user-container__username user-info">{props.user.username}</div>
                <div className="user-container__is-admin user-info">
                  {userID === props.user.id
                    ? <input data-id={props.user.id} type="checkbox" className="user-container__checkbox"
                             checked={props.user.is_superuser} disabled />
                    : <input data-id={props.user.id} type="checkbox" className="user-container__checkbox"
                             checked={props.user.is_superuser} onChange={toggleAdminRights} />
                  }
                </div>
                <div className="user-container__files user-info">{props.user.files.length}</div>
                <div className="user-container__storage-size user-info">
                  {props.user.files.length > 0 ? getConvertedFileSize(getStorageSize(props.user.files)) : '-'}
                </div>
                {userID === props.user.id
                  ?
                    <>
                      <div data-id={props.user.id} className="user-container__open-storage-button button button_open"
                           onClick={goToUserDashboard}>
                        <img src={openIcon} alt="Иконка входа" className="user-container__icon"/>
                      </div>
                      <div data-id={props.user.id} className="user-container__user-delete-button button button_disabled">
                        <img src={deleteIcon} alt="Иконка удаления" className="file-container__icon"/>
                      </div>
                    </>
                  :
                    <>
                      <div data-id={props.user.id} className="user-container__open-storage-button button button_open"
                           onClick={goToUserDashboard}>
                        <img src={openIcon} alt="Иконка входа" className="user-container__icon"/>
                      </div>
                      <div data-id={props.user.id} className="user-container__user-delete-button button button_delete"
                           onClick={deleteUser}>
                        <img src={deleteIcon} alt="Иконка удаления" className="file-container__icon"/>
                      </div>
                    </>
                }
              </div>
              <div className="user-container__bottom-area">
                <div className="user-container__email user-info">{props.user.email}</div>
                <div className="user-container__date-joined user-info">{getTime(props.user.date_joined)}</div>
                <div className="user-container__last-login user-info">{getTime(props.user.last_login)}</div>
              </div>
            </>
      }
    </div>
  )
}

export default User