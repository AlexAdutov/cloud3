/*
Этот код представляет компонент File, который отображает информацию о файле и позволяет пользователю взаимодействовать с ним. 
Импорт зависимостей: Импортируются необходимые зависимости, такие как хуки useContext, useEffect, useState, useRef из React, пользовательские хуки useRequest и useDownloadFile, и несколько вспомогательных функций.
Определение компонента и состояний: Создается компонент File, который получает доступ к контексту приложения и данным о файле, а также определяет несколько состояний, таких как флаги редактирования имени и комментария файла, значения имени и комментария, и состояния запросов на обновление, удаление и загрузку файла.
Эффекты и обработчики событий: Используются эффекты useEffect, чтобы управлять состояниями компонента в зависимости от изменений. Также определены обработчики событий для редактирования имени и комментария файла, копирования внешней ссылки, генерации внешней ссылки, обновления информации о файле, скачивания и удаления файла.
Отображение контента: Компонент File отображает информацию о файле, включая его имя, комментарий, размер, дату загрузки и дату последней загрузки. Также предоставляются кнопки для редактирования имени и комментария файла, скачивания, удаления, а также генерации и копирования внешней ссылки на файл.
Обработка состояний загрузки и ошибок: В зависимости от состояний запросов на обновление, удаление и загрузку файла, компонент отображает загрузчик или сообщение об ошибке.
Этот компонент предоставляет пользователю интерфейс для управления файлами, включая их редактирование, загрузку, скачивание и удаление.
*/
import { useContext, useEffect, useRef, useState } from 'react' // Импорт необходимых хуков и состояний из React
import useRequest from '../../hooks/useRequest.jsx' // Импорт пользовательского хука для запросов
import useDownloadFile from '../../hooks/useDownloadFile.jsx' // Импорт пользовательского хука для загрузки файлов
import getConvertedFileSize from '../../utils/getConvertedFileSize.js' // Импорт функции для конвертации размера файла
import getTime from '../../utils/getTime.js' // Импорт функции для форматирования времени
import Loader from '../common/Loader/Loader.jsx' // Импорт компонента загрузчика
import SystemMessage from '../common/SystemMessage/SystemMessage.jsx' // Импорт компонента системного сообщения

import { CloudContext } from '../../contexts/CloudContext.js' // Импорт контекста приложения


import './File.scss' // Импорт стилей компонента File
import cancelIcon from '../../images/icons/cancel_icon.svg' // Импорт иконки отмены
import copyIcon from '../../images/icons/copy_icon.svg' // Импорт иконки копирования
import deleteIcon from '../../images/icons/delete_icon.svg' // Импорт иконки удаления
import downloadIcon from '../../images/icons/download_icon.svg' // Импорт иконки скачивания
import editIcon from '../../images/icons/edit_icon.svg' // Импорт иконки редактирования
import generateLinkIcon from '../../images/icons/generate_link_icon.svg' // Импорт иконки генерации ссылки
import okIcon from '../../images/icons/ok_icon.svg' // Импорт иконки подтверждения
import shareIcon from '../../images/icons/share_icon.svg' // Импорт иконки общего доступа

// Определение компонента File

const File = (props) => {

  const {setUpdateDataFlag} = useContext(CloudContext) // Получение функции для обновления данных из контекста приложения

  const [editFilenameFlag, setEditFilenameFlag] = useState(false) // Состояние для флага редактирования имени файла
  const [editCommentFlag, setEditCommentFlag] = useState(false) // Состояние для флага редактирования комментария файла
  const [filename, setFilename] = useState('') // Состояние для имени файла
  const [comment, setComment] = useState('') // Состояние для комментария файла

    // Хуки запросов для обновления, удаления и загрузки файла
  const [dataUpdate, loadingUpdate, errorUpdate, requestUpdate] = useRequest()
  const [dataDelete, loadingDelete, errorDelete, requestDelete] = useRequest('delete')
  const [dataDownloadFile, loadingDownloadFile, errorDownloadFile, requestDownloadFile] = useDownloadFile()

    // Ссылки на элементы ввода

  const filenameInput = useRef(null)
  const commentInput = useRef(null)
  const externalLinkDiv = useRef(null)
  const copyImg = useRef(null)
  const shareImg = useRef(null)

    // Функции для переключения режимов редактирования имени и комментария файла

    const editFilenameToggle = () => {
    setEditFilenameFlag(!editFilenameFlag)
  }

  const editCommentToggle = () => {
    setEditCommentFlag(!editCommentFlag)
  }

    // Функция для копирования внешней ссылки на файл

  const copyLink = async () => {
    await navigator.clipboard.writeText(externalLinkDiv.current.innerText)
    shareImg.current.classList.toggle('hidden')
    copyImg.current.classList.toggle('hidden')
    setTimeout(() => {
      copyImg.current.classList.toggle('hidden')
      shareImg.current.classList.toggle('hidden')
    },1000)
  }

    // Функция для генерации внешней ссылки на файл

  const generateExternalLink = async (e) => {
    const fileId = e.currentTarget.dataset.id
    await requestUpdate(`/api/files/${fileId}/generatelink/`, {credentials: 'include'})
  }

    // Функция для обновления информации о файле

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

    // Функция для скачивания файла

  const downloadFile = async (e) => {
    const fileId = e.currentTarget.dataset.id
    await requestDownloadFile(`/api/files/${fileId}/download/`, {credentials: 'include'})
  }

    // Функция для удаления файла

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

   // Эффекты для управления состояниями компонента

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

    // Возврат JSX компонента

  return (
    <div className="file-container__file">
      {/* Обработка состояний загрузки и ошибок */}
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
                    {/* Верхняя область файла */}
                    <div className="file-container__top-area">
                      {/* Редактирование имени файла */}
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
                      {/* Редактирование комментария файла */}
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
                      {/* Внешняя ссылка на файл */}
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
                    {/* Нижняя область файла */}
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

export default File  // Экспорт компонента File