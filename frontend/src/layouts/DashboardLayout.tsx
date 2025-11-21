import { Outlet } from 'react-router-dom'

import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'

export const DashboardLayout = () => (
  <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
    <Sidebar />

    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1 overflow-y-auto px-8 py-6">
        <Outlet />
      </main>
    </div>
  </div>
)

