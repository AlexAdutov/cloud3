import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoutes = ({isAllowed, redirectPath = '/'}) => {
  return isAllowed ? <Outlet /> : <Navigate to={redirectPath} replace />
}

export default PrivateRoutes