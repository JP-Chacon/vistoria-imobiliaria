import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { getAttachments, getInspection, updateInspection } from '../../api/inspections'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { Loader } from '../../components/feedback/Loader'
import { formatDateTime } from '../../utils/formatters'
import { AttachmentUploader } from '../../components/attachments/AttachmentUploader'
import { AttachmentList } from '../../components/attachments/AttachmentList'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

export const InspectionDetailsPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const { data: inspection, isLoading } = useQuery({
    queryKey: ['inspection', id],
    queryFn: () => (id ? getInspection(id) : Promise.reject('ID ausente')),
    enabled: Boolean(id),
  })

  const {
    data: attachments = [],
    refetch: refetchAttachments,
  } = useQuery({
    queryKey: ['inspection', id, 'attachments'],
    queryFn: () => (id ? getAttachments(id) : Promise.reject('ID ausente')),
    enabled: Boolean(id),
  })

  const [attachmentList, setAttachmentList] = useState(attachments)

  useEffect(() => {
    setAttachmentList(attachments)
  }, [attachments])

  const markAsCompletedMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('ID ausente')
      return updateInspection(id, { status: 'completed' })
    },
    onSuccess: () => {
      toast.success('Vistoria marcada como concluída!')
      queryClient.invalidateQueries({ queryKey: ['inspection', id] })
      queryClient.invalidateQueries({ queryKey: ['inspections'] })
    },
    onError: () => {
      toast.error('Não foi possível marcar a vistoria como concluída.')
    },
  })

  const handleMarkAsCompleted = () => {
    if (inspection?.status === 'completed') {
      toast.info('Esta vistoria já está concluída.')
      return
    }
    markAsCompletedMutation.mutate()
  }

  // Property já vem do backend junto com a inspection
  const property = inspection?.property

  if (isLoading || !inspection) {
    return <Loader label="Carregando vistoria..." />
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>

      <Card
        title="Detalhes da vistoria"
        description="Visualize informações e anexos."
        className="space-y-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Imóvel
            </p>
            <p className="text-lg font-medium text-slate-900">
              {property?.street && property?.number
                ? `${property.street}, Nº ${property.number}`
                : property?.address ?? 'Imóvel não informado'}
            </p>
            {property?.district && (
              <p className="text-sm text-slate-500">{property.district}</p>
            )}
            {property?.city && property?.state && (
              <p className="text-sm text-slate-500">
                {property.city} - {property.state}
              </p>
            )}
            {property?.ownerName && (
              <p className="text-sm text-slate-500">
                Proprietário: {property.ownerName}
              </p>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Responsável
            </p>
            <p className="text-lg font-medium text-slate-900">
              {inspection.inspectorName}
            </p>
            <p className="text-sm text-slate-500">
              {formatDateTime(inspection.scheduledFor)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <StatusBadge status={inspection.status} />
            <span className="text-sm text-slate-500">
              Criado em {formatDateTime(inspection.createdAt)}
            </span>
            {inspection.status === 'completed' && inspection.completedAt && (
              <span className="text-sm font-medium text-emerald-600">
                Concluída em {formatDateTime(inspection.completedAt)}
              </span>
            )}
          </div>
          {inspection.status !== 'completed' && (
            <Button
              variant="secondary"
              onClick={handleMarkAsCompleted}
              disabled={markAsCompletedMutation.isPending}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {markAsCompletedMutation.isPending ? 'Salvando...' : 'Marcar como concluída'}
            </Button>
          )}
        </div>

        {inspection.notes && (
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <p className="font-semibold text-slate-900">Observações:</p>
            <p>{inspection.notes}</p>
          </div>
        )}
      </Card>

      <Card title="Anexos" description="Envie fotos, relatórios e documentos.">
        <AttachmentUploader
          inspectionId={inspection.id}
          onUploaded={(uploaded) => {
            setAttachmentList((prev) => [...uploaded, ...prev])
            refetchAttachments()
          }}
        />

        <div className="mt-6">
          <AttachmentList
            items={attachmentList}
            baseUrl={API_BASE_URL}
            onDeleted={async (attachmentId) => {
              setAttachmentList((prev) =>
                prev.filter((item) => item.id !== attachmentId),
              )
              await refetchAttachments()
            }}
          />
        </div>
      </Card>
    </div>
  )
}

