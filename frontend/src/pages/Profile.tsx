import { Mail, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { formatDateTime } from '../utils/formatters'

export const ProfilePage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) {
    return null
  }

  return (
    <Card
      title="Perfil do usuário"
      description="Gerencie sua sessão e visualize seus dados."
      className="max-w-2xl"
    >
      <div className="flex items-center gap-4">
        <Avatar name={user.name} className="h-16 w-16 text-lg" />
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            {user.name}
          </h3>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
        <p className="flex items-center gap-2">
          <Mail className="h-4 w-4" /> {user.email}
        </p>
        <p className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" /> Conta criada em{' '}
          {formatDateTime(user.createdAt)}
        </p>
      </div>

      <Button variant="danger" className="mt-6 w-full" onClick={handleLogout}>
        Sair da conta
      </Button>
    </Card>
  )
}

