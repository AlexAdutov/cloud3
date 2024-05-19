import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useRequest from '../../hooks/useRequest.jsx'
import getStorageSize from '../../utils/getStorageSize.js'
import getConvertedFileSize from '../../utils/getConvertedFileSize.js'
import getTime from '../../utils/getTime.js'

import Loader from '../common/Loader/Loader.jsx'
import SystemMessage from '../common/SystemMessage/SystemMessage.jsx'

import { CloudContext } from '../../contexts/CloudContext.js'

import './User.scss'
import deleteIcon from '../../images/icons/delete_icon.svg'
import openIcon from '../../images/icons/open_icon.svg'

const User = (props) => {

  const {setUpdateDataFlag, userID} = useContext(CloudContext)

  const [dataDelete, loadingDelete, errorDelete, requestDelete] = useRequest('delete')
  const [dataAdminRights, loadingAdminRights, errorAdminRights, requestAdminRights] = useRequest()

  const navigate = useNavigate()

  const goToUserDashboard = (e) => {
    userID === +e.currentTarget.dataset.id
      ? navigate(`/dashboard`)
      : navigate(`/dashboard/${e.currentTarget.dataset.id}`)
  }

  const deleteUser = async (e) => {
    const userId = e.currentTarget.dataset.id
    const init = {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    await requestDelete(`/api/users/${userId}/`, init)
  }

  const toggleAdminRights = async (e) => {
    const userId = e.currentTarget.dataset.id
    const init = {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          is_superuser: e.currentTarget.checked
        }
      )
    }
    requestAdminRights(`/api/users/${userId}/`, init)
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