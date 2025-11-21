import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'
import { toast } from 'sonner'

import type { Property } from '../../types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'

const schema = z.object({
  ownerName: z.string().min(3, 'Informe o nome do proprietário'),
  type: z.enum(['house', 'apartment', 'commercial']),
  cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  street: z.string().min(3, 'Informe o logradouro'),
  number: z.string().min(1, 'Informe o número'),
  district: z.string().min(2, 'Informe o bairro'),
  city: z.string().min(2, 'Informe a cidade'),
  state: z.string().length(2, 'Informe o estado (UF)'),
  observations: z.string().optional(),
})

export type PropertyFormValues = z.infer<typeof schema>

type PropertyFormProps = {
  defaultValues?: Property
  onSubmit: (values: PropertyFormValues) => Promise<unknown> | void
  isSubmitting?: boolean
}

type ViaCepResponse = {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

export const PropertyForm = ({
  defaultValues,
  onSubmit,
  isSubmitting,
}: PropertyFormProps) => {
  const [isLoadingCep, setIsLoadingCep] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues
      ? {
          ownerName: defaultValues.ownerName,
          type: defaultValues.type,
          cep: defaultValues.cep,
          street: defaultValues.street,
          number: defaultValues.number,
          district: defaultValues.district,
          city: defaultValues.city,
          state: defaultValues.state,
          observations: defaultValues.observations ?? undefined,
        }
      : {
          ownerName: '',
          type: 'house',
          cep: '',
          street: '',
          number: '',
          district: '',
          city: '',
          state: '',
          observations: '',
        },
  })

  const cepValue = watch('cep')

  // Função para formatar CEP (99999-999)
  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 5) {
      return numbers
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }

  // Função para buscar CEP no ViaCEP
  const handleCepBlur = async () => {
    const cep = cepValue?.replace(/\D/g, '')
    
    if (!cep || cep.length !== 8) {
      return
    }

    setIsLoadingCep(true)
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data: ViaCepResponse = await response.json()

      if (data.erro) {
        toast.error('CEP não encontrado')
        return
      }

      // Preencher campos automaticamente
      setValue('street', data.logradouro || '')
      setValue('district', data.bairro || '')
      setValue('city', data.localidade || '')
      setValue('state', data.uf || '')
      
      toast.success('Endereço preenchido automaticamente')
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
      toast.error('Erro ao buscar CEP. Tente novamente.')
    } finally {
      setIsLoadingCep(false)
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit as (values: PropertyFormValues) => void | Promise<void>)}>
      <div>
        <Label htmlFor="ownerName">Proprietário</Label>
        <Input id="ownerName" placeholder="Nome completo" {...register('ownerName')} />
        {errors.ownerName && (
          <p className="mt-1 text-sm text-red-500">{errors.ownerName.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="type">Tipo de imóvel</Label>
        <Select id="type" {...register('type')}>
          <option value="house">Casa</option>
          <option value="apartment">Apartamento</option>
          <option value="commercial">Comercial</option>
        </Select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      <div className="space-y-4 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Endereço
        </h3>

        <div>
          <Label htmlFor="cep">CEP</Label>
          <Input
            id="cep"
            placeholder="00000-000"
            maxLength={9}
            disabled={isLoadingCep}
            {...register('cep', {
              onChange: (e) => {
                const formatted = formatCep(e.target.value)
                setValue('cep', formatted)
              },
            })}
            onBlur={handleCepBlur}
          />
          {errors.cep && (
            <p className="mt-1 text-sm text-red-500">{errors.cep.message}</p>
          )}
          {isLoadingCep && (
            <p className="mt-1 text-xs text-slate-500">Buscando endereço...</p>
          )}
        </div>

        <div>
          <Label htmlFor="street">Logradouro</Label>
          <Input id="street" placeholder="Rua, Avenida, etc." {...register('street')} />
          {errors.street && (
            <p className="mt-1 text-sm text-red-500">{errors.street.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="number">Número</Label>
            <Input id="number" placeholder="123" {...register('number')} />
            {errors.number && (
              <p className="mt-1 text-sm text-red-500">{errors.number.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="district">Bairro</Label>
            <Input id="district" placeholder="Bairro" {...register('district')} />
            {errors.district && (
              <p className="mt-1 text-sm text-red-500">{errors.district.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">Cidade</Label>
            <Input id="city" placeholder="Cidade" {...register('city')} />
            {errors.city && (
              <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="state">Estado (UF)</Label>
            <Input
              id="state"
              placeholder="SP"
              maxLength={2}
              className="uppercase"
              {...register('state', {
                onChange: (e) => {
                  setValue('state', e.target.value.toUpperCase())
                },
              })}
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="observations">Observações</Label>
        <Textarea
          id="observations"
          rows={4}
          placeholder="Informações adicionais sobre o imóvel (opcional)"
          {...register('observations')}
        />
      </div>

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Salvar
      </Button>
    </form>
  )
}
