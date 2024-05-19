import { useNavigate } from 'react-router-dom'

import './ExternalFileDownload.scss'

const ExternalFileDownload = () => {
  const navigate = useNavigate()

  return (
    <div className="external-download-container">
      <div className="external-download-container__file">
          <div className="external-download-container__download-error">Данный файл не найден в системе.</div>
          <div className="button" onClick={() => navigate('/')}>На главную</div>
      </div>
    </div>
  )
}

export default ExternalFileDownload