import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Edit } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { getProperty } from '../../api/properties'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { Loader } from '../../components/feedback/Loader'
import { formatDateTime } from '../../utils/formatters'

const formatCep = (cep: string) => {
  const numbers = cep.replace(/\D/g, '')
  if (numbers.length === 8) {
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }
  return cep
}

export const PropertyDetailsPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const { data: property, isLoading } = useQuery({
    queryKey: ['properties', id],
    queryFn: () => (id ? getProperty(id) : Promise.reject('ID ausente')),
    enabled: Boolean(id),
  })

  if (isLoading || !property) {
    return <Loader label="Carregando imóvel..." />
  }

  const hasFullAddress =
    property.street && property.number && property.district && property.city && property.state

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <Button variant="secondary" onClick={() => navigate(`/properties/${property.id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>

      <Card title="Detalhes do imóvel" description="Informações completas do cadastro.">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Proprietário
              </p>
              <p className="text-lg font-medium text-slate-900">{property.ownerName}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Tipo de imóvel
              </p>
              <div className="mt-2">
                <StatusBadge status={property.type} />
              </div>
            </div>
          </div>

          {hasFullAddress ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                Endereço completo
              </p>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                <p className="text-base font-medium text-slate-900">
                  {property.street}, Nº {property.number}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{property.district}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {property.city} - {property.state}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  CEP {formatCep(property.cep)}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                Endereço
              </p>
              <p className="text-base text-slate-900">{property.address || 'Não informado'}</p>
            </div>
          )}

          {property.observations && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                Observações
              </p>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <p className="whitespace-pre-wrap">{property.observations}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500">
              Cadastrado em {formatDateTime(property.createdAt)}
            </span>
            {property.updatedAt !== property.createdAt && (
              <span className="text-xs text-slate-500">
                • Atualizado em {formatDateTime(property.updatedAt)}
              </span>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}


