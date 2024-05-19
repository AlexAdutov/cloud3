import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useRequest from '../../hooks/useRequest.jsx'

import Uploader from '../uploader/Uploader.jsx'
import File from '../file/File.jsx'
import Loader from '../common/Loader/Loader.jsx'
import SystemMessage from '../common/SystemMessage/SystemMessage.jsx'

import { CloudContext } from '../../contexts/CloudContext.js'

import './Dashboard.scss'

const Dashboard = () => {
  const { selectedUserId } = useParams()
  const {updateDataFlag, setUpdateDataFlag, isAuthenticated, userID} = useContext(CloudContext)
  const [dataFiles, loadingFiles, errorFiles, requestFiles] = useRequest()

  useEffect(() => {
    isAuthenticated && requestFiles(`/api/userfiles/${selectedUserId ? selectedUserId : userID}/`, {credentials: 'include'})
  }, [selectedUserId])

  useEffect(() => {
    if (updateDataFlag) {
      requestFiles(`/api/userfiles/${selectedUserId ? selectedUserId : userID}/`, {credentials: 'include'})
      setUpdateDataFlag(false)
    }
  }, [updateDataFlag])

  return (
    <section className="dashboard-container">
      {dataFiles.status && dataFiles.status === 200 && selectedUserId && <div className="dashboard-container__title">Файлы пользователя {dataFiles.result.username}</div>}
      {dataFiles.status && dataFiles.status === 200 && !selectedUserId && <div className="dashboard-container__title">Мои файлы</div>}
      {!selectedUserId && <Uploader/>}
      <div className="dashboard-container__files">
        {loadingFiles
          ? <Loader/>
          : errorFiles
            ? <SystemMessage type="error" message="Ошибка связи с сервером"/>
            : selectedUserId && dataFiles.result && dataFiles.result.files.length === 0
              ? <div className="text">У пользователя нет файлов</div>
              : !selectedUserId && dataFiles.result && dataFiles.result.files.length === 0
                ? <div className="text">У вас еще нет файлов</div>
                : dataFiles.result && dataFiles.result.files.map((file) => (<File key={file.id} file={file}/>))
        }
      </div>
    </section>
  )
}

export default Dashboard