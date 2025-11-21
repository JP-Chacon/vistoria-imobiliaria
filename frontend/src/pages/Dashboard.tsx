import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ClipboardList, FilePlus2, HousePlus, MapPinned } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { getInspections } from '../api/inspections'
import { getProperties } from '../api/properties'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { InspectionCard } from '../components/ui/InspectionCard'

const shortcuts = [
  { to: '/properties/new', label: 'Cadastrar Imóvel', icon: HousePlus },
  { to: '/inspections/new', label: 'Nova Vistoria', icon: FilePlus2 },
  { to: '/properties', label: 'Listar Imóveis', icon: MapPinned },
  { to: '/inspections', label: 'Listar Vistorias', icon: ClipboardList },
]

export const DashboardPage = () => {
  const { data: properties, isLoading: loadingProperties } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
  })

  const { data: inspections, isLoading: loadingInspections } = useQuery({
    queryKey: ['inspections'],
    queryFn: getInspections,
  })

  const lastInspections = useMemo(
    () => inspections?.slice(0, 5) ?? [],
    [inspections],
  )

  const isLoading = loadingInspections || loadingProperties
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Imóveis" description="Total cadastrados">
          <p className="text-4xl font-semibold text-slate-900 dark:text-slate-100">
            {properties?.length ?? 0}
          </p>
        </Card>
        <Card title="Vistorias" description="Total registradas">
          <p className="text-4xl font-semibold text-slate-900 dark:text-slate-100">
            {inspections?.length ?? 0}
          </p>
        </Card>
        <Card title="Pendentes" description="Próximas ações">
          <p className="text-4xl font-semibold text-amber-500">
            {inspections?.filter((i) => i.status !== 'completed').length ?? 0}
          </p>
        </Card>
        <Card title="Concluídas" description="Últimos 30 dias">
          <p className="text-4xl font-semibold text-emerald-500">
            {inspections?.filter((i) => i.status === 'completed').length ?? 0}
          </p>
        </Card>
      </div>

      <Card
        title="Últimas vistorias"
        description="Acompanhe os últimos registros realizados pela equipe."
        className="w-full"
        headerRight={
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={() => navigate('/inspections')}
          >
            Ver todas
          </Button>
        }
      >
        {isLoading ? (
          <p className="text-sm text-slate-500">Carregando...</p>
        ) : lastInspections.length === 0 ? (
          <EmptyState
            title="Nenhuma vistoria ainda"
            subtitle="Cadastre a primeira vistoria para acompanhar seu status aqui."
            action={
              <Button type="button" onClick={() => navigate('/inspections/new')}>
                Nova vistoria
              </Button>
            }
          />
        ) : (
          <ul className="space-y-4">
            {lastInspections.map((inspection) => (
              <li key={inspection.id}>
                <InspectionCard inspection={inspection} />
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Ações rápidas" description="Acesse fluxos frequentes com 1 clique.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {shortcuts.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3 transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-white dark:border-slate-800 dark:bg-slate-900/50"
            >
              <div className="rounded-full bg-brand-50 p-2 text-brand-600 group-hover:bg-brand-100">
                <action.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {action.label}
                </p>
                <p className="text-xs text-slate-500">Ir para {action.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}

