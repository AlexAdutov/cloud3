import { useContext, useEffect, useRef, useState } from 'react'
import useRequest from '../../hooks/useRequest.jsx'
import useDownloadFile from '../../hooks/useDownloadFile.jsx'
import getConvertedFileSize from '../../utils/getConvertedFileSize.js'
import getTime from '../../utils/getTime.js'
import Loader from '../common/Loader/Loader.jsx'
import SystemMessage from '../common/SystemMessage/SystemMessage.jsx'

import { CloudContext } from '../../contexts/CloudContext.js'

import './File.scss'
import cancelIcon from '../../images/icons/cancel_icon.svg'
import copyIcon from '../../images/icons/copy_icon.svg'
import deleteIcon from '../../images/icons/delete_icon.svg'
import downloadIcon from '../../images/icons/download_icon.svg'
import editIcon from '../../images/icons/edit_icon.svg'
import generateLinkIcon from '../../images/icons/generate_link_icon.svg'
import okIcon from '../../images/icons/ok_icon.svg'
import shareIcon from '../../images/icons/share_icon.svg'

const File = (props) => {

  const {setUpdateDataFlag} = useContext(CloudContext)

  const [editFilenameFlag, setEditFilenameFlag] = useState(false)
  const [editCommentFlag, setEditCommentFlag] = useState(false)
  const [filename, setFilename] = useState('')
  const [comment, setComment] = useState('')

  const [dataUpdate, loadingUpdate, errorUpdate, requestUpdate] = useRequest()
  const [dataDelete, loadingDelete, errorDelete, requestDelete] = useRequest('delete')
  const [dataDownloadFile, loadingDownloadFile, errorDownloadFile, requestDownloadFile] = useDownloadFile()

  const filenameInput = useRef(null)
  const commentInput = useRef(null)
  const externalLinkDiv = useRef(null)
  const copyImg = useRef(null)
  const shareImg = useRef(null)

  const editFilenameToggle = () => {
    setEditFilenameFlag(!editFilenameFlag)
  }

  const editCommentToggle = () => {
    setEditCommentFlag(!editCommentFlag)
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(externalLinkDiv.current.innerText)
    shareImg.current.classList.toggle('hidden')
    copyImg.current.classList.toggle('hidden')
    setTimeout(() => {
      copyImg.current.classList.toggle('hidden')
      shareImg.current.classList.toggle('hidden')
    },1000)
  }

  const generateExternalLink = async (e) => {
    const fileId = e.currentTarget.dataset.id
    await requestUpdate(`/api/files/${fileId}/generatelink/`, {credentials: 'include'})
  }

  const updateFileInfo = async (e) => {
    const fileId = e.currentTarget.dataset.id
    let body = {}
    if (editFilenameFlag) {
      body.filename = filename
    } else if (editCommentFlag) {
      body.comment = comment
    } else {
      body.external_link_key = ''
    }
    const init = {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    }
    await requestUpdate(`/api/files/${fileId}/`, init)
  }

  const downloadFile = async (e) => {
    const fileId = e.currentTarget.dataset.id
    await requestDownloadFile(`/api/files/${fileId}/download/`, {credentials: 'include'})
  }

  const deleteFile = async (e) => {
    const fileId = e.currentTarget.dataset.id
    const init = {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    await requestDelete(`/api/files/${fileId}/`, init)
  }

  useEffect(() => {
    if (editFilenameFlag) {
      setFilename(props.file.filename)
      filenameInput.current.focus()
    }
    if (editCommentFlag) {
      setComment(props.file.comment)
      commentInput.current.focus()
    }
  }, [editFilenameFlag, editCommentFlag])

  useEffect(() => {
    if (dataUpdate.status === 200 || dataDownloadFile.status === 200 || dataDelete.status === 204) {
      setUpdateDataFlag(true)
    }
  }, [dataUpdate, dataDownloadFile, dataDelete])

  return (
    <div className="file-container__file">
      {loadingUpdate || loadingDelete || loadingDownloadFile
        ? <Loader />
        : errorUpdate || errorDelete || errorDownloadFile
          ? <SystemMessage type="error" message="Ошибка связи с сервером" />
          : dataUpdate.status && dataUpdate.status !== 200
            ? <SystemMessage type="error" message={dataUpdate.result.content[0]} />
            : dataDownloadFile.status && dataDownloadFile.status !== 200
              ? <SystemMessage type="error" message={dataDownloadFile.result.detail} />
              : dataDelete.status && dataDelete.status !== 204
                ? <SystemMessage type="error" message={dataDelete.result.detail} />
                : (
                  <>
                    <div className="file-container__top-area">
                      <div className="file-container__file-name-area">
                        <div className="filename-input-wrapper">
                          {editFilenameFlag
                            ? <input ref={filenameInput} type="text" value={filename} onChange={(e) => setFilename(e.target.value)}
                                     className="file-container__file-name input"/>
                            : <div className="file-container__file-name file-info">{props.file.filename}</div>
                          }
                        </div>
                        {!editFilenameFlag
                          ? <div className="file-container__filename-edit-button button" onClick={editFilenameToggle}>
                              <img src={editIcon} alt="Иконка редактирования" className="file-container__icon"/>
                            </div>
                          :
                          <>
                            <div data-id={props.file.id} className="file-container__filename-edit-button button button_ok"
                                    onClick={updateFileInfo}>
                              <img src={okIcon} alt="Иконка подтверждения" className="file-container__icon"/>
                            </div>
                            <div className="file-container__filename-edit-button button button_cancel"
                                    onClick={editFilenameToggle}>
                              <img src={cancelIcon} alt="Иконка отмены" className="file-container__icon"/>
                            </div>
                          </>
                        }
                      </div>
                      <div className="file-container__file-comment-area">
                        <div className="comment-input-wrapper">
                          {editCommentFlag
                            ? <input ref={commentInput} type="text" value={comment} onChange={(e) => setComment(e.target.value)}
                                     className="file-container__file-comment input"/>
                            : <div className="file-container__file-comment file-info">{props.file.comment}</div>
                          }
                        </div>
                        {!editCommentFlag
                          ? <div className="file-container__comment-edit-button button" onClick={editCommentToggle}>
                              <img src={editIcon} alt="Иконка редактирования" className="file-container__icon"/>
                            </div>
                          :
                          <>
                            <div data-id={props.file.id} className="file-container__comment-edit-button button button_ok"
                                    onClick={updateFileInfo}>
                              <img src={okIcon} alt="Иконка подтверждения" className="file-container__icon"/>
                            </div>
                            <div className="file-container__comment-edit-button button button_cancel"
                                    onClick={editCommentToggle}>
                              <img src={cancelIcon} alt="Иконка отмены" className="file-container__icon"/>
                            </div>
                          </>
                        }
                      </div>
                      <div className="file-container__file-external-link-area">
                        <div ref={externalLinkDiv} className="file-container__file-external-link file-info">{props.file.external_link_key && window.location.origin + '/f/' + props.file.external_link_key}</div>
                        {props.file.external_link_key
                          ?
                          <>
                            <div data-id={props.file.id} className="file-container__file-external-link-button button button_ok"
                                 onClick={copyLink}>
                              <img ref={shareImg} src={shareIcon} alt="Иконка генерации" className="file-container__icon"/>
                              <img ref={copyImg} src={copyIcon} alt="Иконка генерации" className="file-container__icon hidden"/>

                            </div>
                            <div data-id={props.file.id} className="file-container__file-external-link-button button button_cancel"
                                    onClick={updateFileInfo}>
                              <img src={cancelIcon} alt="Иконка отмены" className="file-container__icon"/>
                            </div>
                          </>
                          :
                          <>
                            <div data-id={props.file.id} className="file-container__file-external-link-button button button_generate"
                                    onClick={generateExternalLink}>
                              <img src={generateLinkIcon} alt="Иконка ссылки" className="file-container__icon"/>
                            </div>
                          </>
                        }
                      </div>
                    </div>
                    <div className="file-container__bottom-area">
                      <div className="file-container__file-size file-info">{getConvertedFileSize(props.file.size)}</div>
                      <div className="file-container__file-upload-date file-info">{getTime(props.file.date_uploaded)}</div>
                      <div className="file-container__file-download-date file-info">{getTime(props.file.last_download)}</div>
                      <div data-id={props.file.id} className="file-container__file-download-button button button_download"
                           onClick={downloadFile}>
                        <img src={downloadIcon} alt="Иконка скачивания" className="file-container__icon"/>
                      </div>
                      <div data-id={props.file.id} className="file-container__file-delete-button button button_delete"
                           onClick={deleteFile}>
                        <img src={deleteIcon} alt="Иконка удаления" className="file-container__icon"/>
                      </div>
                    </div>
                  </>
                )
      }
    </div>
  )
}

export default File