import { useNavigate } from 'react-router-dom'
import type { Inspection } from '../../types'
import { StatusBadge } from './StatusBadge'
import { formatDateTime } from '../../utils/formatters'

type InspectionCardProps = {
  inspection: Inspection
  onClick?: () => void
}

export const InspectionCard = ({ inspection, onClick }: InspectionCardProps) => {
  const navigate = useNavigate()

  const title =
    inspection.property?.address ?? 'Imóvel não informado'

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      navigate(`/inspections/${inspection.id}`)
    }
  }

  return (
    <div
      onClick={handleClick}
      className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-100 bg-white/70 px-4 py-3 transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700"
    >
      <div className="flex-1">
        <p className="font-medium text-slate-900 dark:text-white">{title}</p>
        <p className="mt-1 text-sm text-slate-500">
          Responsável: {inspection.inspectorName} •{' '}
          {formatDateTime(inspection.scheduledFor)} •{' '}
          <StatusBadge status={inspection.status} className="ml-1 inline-flex" />
        </p>
      </div>
    </div>
  )
}

