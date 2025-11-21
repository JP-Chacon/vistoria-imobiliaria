import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Search } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { getInspections, updateInspection } from '../../api/inspections'
import { getProperties } from '../../api/properties'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { EmptyState } from '../../components/ui/EmptyState'
import { Loader } from '../../components/feedback/Loader'
import { formatDateTime } from '../../utils/formatters'

export const InspectionsListPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedProperty = searchParams.get('propertyId') ?? ''
  const queryClient = useQueryClient()

  const [search, setSearch] = useState('')
  const [propertyFilter, setPropertyFilter] = useState(preselectedProperty)

  const { data: inspections, isLoading } = useQuery({
    queryKey: ['inspections'],
    queryFn: getInspections,
  })

  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
  })

  const markAsCompletedMutation = useMutation({
    mutationFn: async (inspectionId: string) => {
      return updateInspection(inspectionId, { status: 'completed' })
    },
    onSuccess: () => {
      toast.success('Vistoria marcada como concluída!')
      queryClient.invalidateQueries({ queryKey: ['inspections'] })
    },
    onError: () => {
      toast.error('Não foi possível marcar a vistoria como concluída.')
    },
  })

  const handleMarkAsCompleted = (inspectionId: string, currentStatus: string) => {
    if (currentStatus === 'completed') {
      toast.info('Esta vistoria já está concluída.')
      return
    }
    markAsCompletedMutation.mutate(inspectionId)
  }

  const filtered = useMemo(() => {
    if (!inspections) return []

    return inspections.filter((inspection) => {
      const matchesSearch =
        inspection.inspectorName.toLowerCase().includes(search.toLowerCase()) ||
        inspection.property?.address
          ?.toLowerCase()
          .includes(search.toLowerCase())

      const matchesProperty = propertyFilter
        ? inspection.propertyId === propertyFilter
        : true

      return matchesSearch && matchesProperty
    })
  }, [inspections, propertyFilter, search])

  if (isLoading) {
    return <Loader label="Carregando vistorias..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Vistorias
          </h2>
          <p className="text-sm text-slate-500">
            Acompanhe o status de todas as vistorias realizadas.
          </p>
        </div>
        <Button onClick={() => navigate('/inspections/new')}>
          Nova vistoria
        </Button>
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por responsável ou endereço"
              className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <Select
            value={propertyFilter}
            onChange={(event) => setPropertyFilter(event.target.value)}
            className="w-60"
          >
            <option value="">Todos os imóveis</option>
            {properties?.map((property) => (
              <option key={property.id} value={property.id}>
                {property.address}
              </option>
            ))}
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="Nenhuma vistoria"
            subtitle="Cadastre uma nova vistoria para começar a controlar o fluxo."
            action={
              <Button type="button" onClick={() => navigate('/inspections/new')}>
                Registrar vistoria
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-3">Imóvel</th>
                  <th>Responsável</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inspection) => (
                  <tr
                    key={inspection.id}
                    className="border-t border-slate-100 text-slate-700 dark:border-slate-800"
                  >
                    <td className="py-4">
                      <p className="font-medium text-slate-900">
                        {inspection.property?.address ?? 'Imóvel não informado'}
                      </p>
                      {inspection.property?.ownerName && (
                        <p className="text-xs text-slate-500">
                          {inspection.property.ownerName}
                        </p>
                      )}
                    </td>
                    <td>{inspection.inspectorName}</td>
                    <td>
                      <div>
                        <p>{formatDateTime(inspection.scheduledFor)}</p>
                        {inspection.status === 'completed' && inspection.completedAt && (
                          <p className="text-xs text-emerald-600">
                            Concluída: {formatDateTime(inspection.completedAt)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={inspection.status} />
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {inspection.status !== 'completed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleMarkAsCompleted(inspection.id, inspection.status)
                            }
                            disabled={markAsCompletedMutation.isPending}
                            title="Marcar como concluída"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            navigate(`/inspections/${inspection.id}`)
                          }
                        >
                          Detalhes
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

