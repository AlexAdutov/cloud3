import errorIcon from '../../../images/icons/error_icon.svg'
import successIcon from '../../../images/icons/success_icon.svg'

import './SystemMessage.scss'

const SystemMessage = (props) => {

  return (
    <div className={`system-message ${props.type}`}>
      {props.type === 'success'
        ? <img src={successIcon} alt="Иконка Успех" className="system-message__icon"/>
        : <img src={errorIcon} alt="Иконка Ошибка" className="system-message__icon"/>
      }
      {props.message}
    </div>
  )
}

export default SystemMessage