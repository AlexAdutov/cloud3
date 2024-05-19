import { useContext, useEffect, useState } from 'react'
import useRequest from '../../hooks/useRequest.jsx'
import getShortFilename from '../../utils/getFilename.js'
import getConvertedFileSize from '../../utils/getConvertedFileSize.js'

import Loader from '../common/Loader/Loader.jsx'
import SystemMessage from '../common/SystemMessage/SystemMessage.jsx'

import { CloudContext } from '../../contexts/CloudContext.js'

import './Uploader.scss'
import addIcon from '../../images/icons/add_icon.svg'
import cancelIcon from '../../images/icons/cancel_icon.svg'
import uploadIcon from '../../images/icons/upload_icon.svg'

const Uploader = () => {

  const {userID, setUpdateDataFlag} = useContext(CloudContext)

  const [file, setFile] = useState(null)
  const [comment, setComment] = useState('')
  const [dataUpload, loadingUpload, errorUpload, requestUpload] = useRequest('uploader')

  const fileHandler = (e) => {
    setFile(e.target.files[0])
  }

  const cancelFile = () => {
    setFile(null)
  }

  const uploadFile = async () => {

    let formData = new FormData()
    formData.append('content', file)
    formData.append('cloud_user', userID)
    formData.append('comment', comment)

    const init = {
      method: 'POST',
      credentials: 'include',
      headers: {},
      body: formData
    }
    await requestUpload('/api/files/upload/', init)
  }

  useEffect(() => {
    setTimeout(() => {
      dataUpload.status === 201 && setUpdateDataFlag(true)
      setFile(null)
      setComment('')
    }, 2000)
  }, [dataUpload])

  return (
    <div className="upload-container">
      {!file
        ?
          <>
            <label htmlFor="upload-container__file-input">
              <div className="upload-container__add-file-area">
                <input type="file" id="upload-container__file-input" onChange={fileHandler}/>
                <img src={addIcon} alt="Иконка добавления файла" className="upload-container__add-file-icon"/>
              </div>
            </label>
          </>
        :
          <>
            <div className="upload-container__file-info-area">
              {loadingUpload
                ? <Loader />
                : errorUpload
                  ? <SystemMessage type="error" message="Ошибка связи с сервером" />
                  : dataUpload.status && dataUpload.status === 201
                    ? <SystemMessage type="success" message="Файл загружен на сервер" />
                    : dataUpload.status && dataUpload.status === 400
                      ? <SystemMessage type="error" message={dataUpload.result.content[0]} />
                      :
                        <>
                          <div className="upload-container__file">
                            <div className="upload-container__file-info-area_top">
                                <div
                                  className="upload-container__filename file-info">{getShortFilename(file.name, 50)}</div>
                                <div
                                  className="upload-container__filesize file-info">{getConvertedFileSize(file.size)}</div>

                                <div className="upload-container__button button button_ok" onClick={uploadFile}>
                                  <img src={uploadIcon} alt="Иконка отправки файла" className="upload-container__icon"/>
                                </div>
                                <div className="upload-container__button button button_cancel" onClick={cancelFile}>
                                  <img src={cancelIcon} alt="Иконка отмены" className="upload-container__icon"/>
                                </div>
                            </div>
                            <input onChange={(e) => setComment(e.target.value)} value={comment} className="upload-container__comment-input input" type="text"
                                   placeholder="Комментарий к файлу"/>
                          </div>
                        </>
              }
            </div>
          </>
      }
    </div>
  )
}

export default Uploader