import {
  Building2,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  UserCircle,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/properties', label: 'Imóveis', icon: Building2 },
  { to: '/inspections', label: 'Vistorias', icon: ClipboardList },
  { to: '/profile', label: 'Perfil', icon: UserCircle },
]

export const Sidebar = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="flex h-full w-72 flex-col border-r border-slate-100 bg-white/80 px-6 py-8 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
          Vistoria
        </p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Imobiliária
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-slate-100 dark:hover:bg-slate-800 ${
                isActive
                  ? 'bg-slate-100 text-brand-600 dark:bg-slate-800'
                  : 'text-slate-500'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Button variant="ghost" className="justify-start" onClick={handleLogout}>
        <LogOut className="h-4 w-4 text-red-500" />
        Sair
      </Button>
    </aside>
  )
}

