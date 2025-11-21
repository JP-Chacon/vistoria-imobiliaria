import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import {
  createProperty,
  getProperty,
  updateProperty,
} from '../../api/properties'
import { Card } from '../../components/ui/Card'
import { PropertyForm, type PropertyFormValues } from '../../components/forms/PropertyForm'
import { Loader } from '../../components/feedback/Loader'

export const PropertyFormPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const isEditing = Boolean(id)

  const { data, isLoading } = useQuery({
    queryKey: ['properties', id],
    queryFn: () => (id ? getProperty(id) : Promise.resolve(null)),
    enabled: isEditing,
  })

  const mutation = useMutation({
    mutationFn: (values: PropertyFormValues) => {
      // Gerar campo address automaticamente a partir dos outros campos
      const address = `${values.street}, Nº ${values.number} - ${values.district}, ${values.city} - ${values.state}`
      const payload = {
        ...values,
        address,
      }
      return isEditing && id ? updateProperty(id, payload) : createProperty(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      toast.success(`Imóvel ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`)
      navigate('/properties')
    },
    onError: () => {
      toast.error('Não foi possível salvar o imóvel.')
    },
  })

  const defaultValues = useMemo(
    () =>
      data
        ? {
            ...data,
          }
        : undefined,
    [data],
  )

  if (isEditing && isLoading) {
    return <Loader label="Carregando imóvel..." />
  }

  return (
    <Card
      title={isEditing ? 'Editar imóvel' : 'Cadastrar imóvel'}
      description="Preencha as informações para manter o cadastro atualizado."
      className="max-w-2xl"
    >
      <PropertyForm
        defaultValues={defaultValues}
        onSubmit={mutation.mutateAsync}
        isSubmitting={mutation.isPending}
      />
    </Card>
  )
}

