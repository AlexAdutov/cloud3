import { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useRequest from '../../hooks/useRequest.jsx'

import { CloudContext } from '../../contexts/CloudContext.js'

import './Header.scss'

const Header = () => {

  const {isAuthenticated, setIsAuthenticated, username, setUsername, setUserID, isAdmin, setIsAdmin} = useContext(CloudContext)
  const [dataLogout, loadingLogout, errorLogout, requestLogout] = useRequest()

  const logout = async () => {
    await requestLogout('/api/logout/', {credentials: 'include'})
  }

  useEffect(() => {
    if (dataLogout.status === 200) {
      setIsAuthenticated(false)
      setUsername(false)
      setUserID(false)
      setIsAdmin(false)
    }
  }, [dataLogout])

  return (
    <header className="header">
      <Link to="/"><div className="header__logo">CLOUD</div></Link>
      <nav className="header__nav">
        <ul className="header__nav-items">
          {isAdmin && <li className="header__nav-item"><Link to="/admin-panel">Панель управления</Link></li>}
          {!isAuthenticated
            ? <li className="header__nav-item"><Link to="/login">Войти</Link></li>
            :
              <>
                <li className="header__nav-item header__nav-item_username"><Link to="/dashboard">{username}</Link></li>
                <li className="header__nav-item" onClick={logout}>Выйти</li>
              </>
          }
        </ul>
      </nav>
    </header>
  )
}

export default Header