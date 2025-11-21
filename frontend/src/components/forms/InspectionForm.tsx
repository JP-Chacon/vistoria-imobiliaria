import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import type { Inspection, Property } from '../../types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'

const schema = z.object({
  propertyId: z.string().uuid('Selecione um imóvel válido'),
  inspectorName: z.string().min(3, 'Informe o responsável'),
  scheduledFor: z.string().min(1, 'Informe a data e horário'),
  status: z.enum(['pending', 'scheduled', 'completed']),
  notes: z.string().optional(),
})

export type InspectionFormValues = z.infer<typeof schema>

type InspectionFormProps = {
  properties: Property[]
  defaultValues?: Partial<Inspection>
  onSubmit: (values: InspectionFormValues) => Promise<unknown> | void
  isSubmitting?: boolean
}

export const InspectionForm = ({
  properties,
  defaultValues,
  onSubmit,
  isSubmitting,
}: InspectionFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InspectionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      propertyId: defaultValues?.propertyId ?? properties[0]?.id ?? '',
      inspectorName: defaultValues?.inspectorName ?? '',
      scheduledFor: defaultValues?.scheduledFor
        ? defaultValues.scheduledFor.slice(0, 16)
        : '',
      status: defaultValues?.status ?? 'pending',
      notes: defaultValues?.notes ?? '',
    },
  })

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label htmlFor="propertyId">Imóvel</Label>
        <Select id="propertyId" {...register('propertyId')}>
          <option value="">Selecione</option>
          {properties.map((property) => {
            const displayAddress =
              property.street && property.number
                ? `${property.street}, Nº ${property.number}${property.city ? ` - ${property.city}` : ''}`
                : property.address
            return (
              <option key={property.id} value={property.id}>
                {displayAddress} - {property.ownerName}
              </option>
            )
          })}
        </Select>
        {errors.propertyId && (
          <p className="mt-1 text-sm text-red-500">{errors.propertyId.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="inspectorName">Responsável</Label>
        <Input
          id="inspectorName"
          placeholder="Nome do vistoriador"
          {...register('inspectorName')}
        />
        {errors.inspectorName && (
          <p className="mt-1 text-sm text-red-500">
            {errors.inspectorName.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="scheduledFor">Data e horário</Label>
        <Input id="scheduledFor" type="datetime-local" {...register('scheduledFor')} />
        {errors.scheduledFor && (
          <p className="mt-1 text-sm text-red-500">
            {errors.scheduledFor.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select id="status" {...register('status')}>
          <option value="pending">Pendente</option>
          <option value="scheduled">Agendada</option>
          <option value="completed">Concluída</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes">Observações</Label>
        <Textarea id="notes" rows={4} placeholder="Detalhes relevantes" {...register('notes')} />
      </div>

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Salvar vistoria
      </Button>
    </form>
  )
}

