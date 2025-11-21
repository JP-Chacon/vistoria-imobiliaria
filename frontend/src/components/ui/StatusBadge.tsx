import clsx from 'clsx'

type Status =
  | 'pending'
  | 'scheduled'
  | 'completed'
  | 'house'
  | 'apartment'
  | 'commercial'

const statusStyles: Record<Status, string> = {
  pending: 'bg-amber-100 text-amber-800',
  scheduled: 'bg-sky-100 text-sky-800',
  completed: 'bg-emerald-100 text-emerald-800',
  house: 'bg-indigo-100 text-indigo-800',
  apartment: 'bg-purple-100 text-purple-800',
  commercial: 'bg-pink-100 text-pink-800',
}

const labels: Partial<Record<Status, string>> = {
  pending: 'Pendente',
  scheduled: 'Agendada',
  completed: 'Concluída',
  house: 'Casa',
  apartment: 'Apartamento',
  commercial: 'Comercial',
}

export const StatusBadge = ({
  status,
  className = '',
}: {
  status: Status
  className?: string
}) => (
  <span
    className={clsx(
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
      statusStyles[status],
      className,
    )}
  >
    {labels[status] ?? status}
  </span>
)

