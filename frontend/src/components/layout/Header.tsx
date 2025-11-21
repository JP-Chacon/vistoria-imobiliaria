import { Plus, SunMoon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../contexts/ThemeContext'
import { Button } from '../ui/Button'
import { Avatar } from '../ui/Avatar'

export const Header = () => {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-white/80 px-8 py-4 dark:border-slate-800 dark:bg-slate-900/70">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400">
          Painel geral
        </p>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Olá, {user?.name?.split(' ')[0] ?? 'corretor(a)'}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          className="px-3"
          onClick={toggleTheme}
        >
          <SunMoon className="h-4 w-4" />
          {theme === 'light' ? 'Modo escuro' : 'Modo claro'}
        </Button>
        <Button onClick={() => navigate('/properties/new')}>
          <Plus className="h-4 w-4" />
          Cadastrar Imóvel
        </Button>
        <div className="flex items-center gap-3 rounded-full border border-slate-100 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
          {user && <Avatar name={user.name} />}
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {user?.name}
            </p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

