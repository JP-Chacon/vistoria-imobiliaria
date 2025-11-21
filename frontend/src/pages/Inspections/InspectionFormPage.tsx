import { useMemo } from 'react'
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import {
  createInspection,
  getInspection,
  updateInspection,
} from '../../api/inspections'
import { getProperties } from '../../api/properties'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import {
  InspectionForm,
  type InspectionFormValues,
} from '../../components/forms/InspectionForm'
import { Loader } from '../../components/feedback/Loader'
import { EmptyState } from '../../components/ui/EmptyState'
import type { Inspection } from '../../types'

export const InspectionFormPage = () => {
  const { id } = useParams<{ id: string }>()
  const [params] = useSearchParams()
  const preselectedProperty = params.get('propertyId') ?? undefined

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = Boolean(id)

  const { data: inspection, isLoading: loadingInspection } = useQuery({
    queryKey: ['inspection', id],
    queryFn: () => (id ? getInspection(id) : Promise.resolve(null)),
    enabled: isEditing,
  })

  const { data: properties = [], isLoading: loadingProperties } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
  })

  const mutation = useMutation({
    mutationFn: (values: InspectionFormValues) =>
      isEditing && id ? updateInspection(id, values) : createInspection(values),
    onSuccess: (saved) => {
      toast.success(`Vistoria ${isEditing ? 'atualizada' : 'criada'} com sucesso!`)
      queryClient.invalidateQueries({ queryKey: ['inspections'] })
      navigate(`/inspections/${saved.id}`)
    },
    onError: () => {
      toast.error('Não foi possível salvar a vistoria.')
    },
  })

  const defaultValues = useMemo(() => {
    if (inspection) return inspection

    if (preselectedProperty) {
      return {
        propertyId: preselectedProperty,
        status: 'pending' as Inspection['status'],
        inspectorName: '',
        scheduledFor: new Date().toISOString(),
      } satisfies Partial<Inspection>
    }

    return undefined
  }, [inspection, preselectedProperty])

  if (isEditing && loadingInspection) {
    return <Loader label="Carregando vistoria..." />
  }

  if (loadingProperties) {
    return <Loader label="Carregando imóveis..." />
  }

  if (!properties.length) {
    return (
      <EmptyState
        title="Cadastre um imóvel antes"
        subtitle="É necessário ter ao menos um imóvel cadastrado para registrar vistorias."
        action={
          <Button type="button" onClick={() => navigate('/properties/new')}>
            Cadastrar imóvel
          </Button>
        }
      />
    )
  }

  return (
    <Card
      title={isEditing ? 'Editar vistoria' : 'Nova vistoria'}
      description="Preencha os dados principais e anexe documentos após salvar."
      className="max-w-3xl"
    >
      <InspectionForm
        properties={properties}
        defaultValues={defaultValues ?? undefined}
        onSubmit={mutation.mutateAsync}
        isSubmitting={mutation.isPending}
      />
    </Card>
  )
}

