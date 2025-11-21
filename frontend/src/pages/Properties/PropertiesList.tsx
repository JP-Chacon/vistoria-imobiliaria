import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { deleteProperty, getProperties } from '../../api/properties'
import { PAGE_SIZE_OPTIONS } from '../../utils/constants'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { EmptyState } from '../../components/ui/EmptyState'
import { Loader } from '../../components/feedback/Loader'

export const PropertiesListPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])

  const { data, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
  })

  const filtered = useMemo(() => {
    if (!data) return []
    return data.filter(
      (property) =>
        property.address.toLowerCase().includes(search.toLowerCase()) ||
        property.ownerName.toLowerCase().includes(search.toLowerCase()),
    )
  }, [data, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este imóvel?')) return

    try {
      await deleteProperty(id)
      toast.success('Imóvel removido com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    } catch (error) {
      console.error(error)
      toast.error('Não foi possível remover o imóvel.')
    }
  }

  if (isLoading) {
    return <Loader label="Carregando imóveis..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Imóveis cadastrados
          </h2>
          <p className="text-sm text-slate-500">
            Gerencie o portfólio de unidades e acione novas vistorias.
          </p>
        </div>
        <Button onClick={() => navigate('/properties/new')}>
          Novo imóvel
        </Button>
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por endereço ou proprietário"
              className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
            />
          </div>

          <Select
            value={pageSize.toString()}
            onChange={(event) => {
              setPageSize(Number(event.target.value))
              setPage(1)
            }}
            className="w-32"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size} por página
              </option>
            ))}
          </Select>
        </div>

        {paginated.length === 0 ? (
          <EmptyState
            title="Nenhum imóvel encontrado"
            subtitle="Cadastre um novo imóvel ou ajuste a busca."
            action={
              <Button type="button" onClick={() => navigate('/properties/new')}>
                Cadastrar
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-3">Endereço</th>
                  <th>Proprietário</th>
                  <th>Cidade</th>
                  <th>Tipo</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((property) => (
                  <tr
                    key={property.id}
                    className="border-t border-slate-100 text-slate-700 dark:border-slate-800"
                  >
                    <td className="py-4">
                      <p className="font-medium text-slate-900">
                        {property.street && property.number
                          ? `${property.street}, Nº ${property.number}`
                          : property.address}
                      </p>
                      <p className="text-xs text-slate-500">
                        {property.district && `${property.district} • `}
                        ID: {property.id.slice(0, 8)}
                      </p>
                    </td>
                    <td>{property.ownerName}</td>
                    <td>{property.city || '-'}</td>
                    <td>
                      <StatusBadge status={property.type} />
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/properties/${property.id}`)}
                        >
                          Ver detalhes
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/properties/${property.id}/edit`)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigate(`/inspections/new?propertyId=${property.id}`)
                          }
                        >
                          Nova vistoria
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(property.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <p>
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Anterior
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Próxima
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

