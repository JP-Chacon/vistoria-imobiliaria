import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
import { Loader } from '../components/feedback/Loader'

type PrivateRouteProps = {
  children: React.ReactNode
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { token, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loader />
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}

