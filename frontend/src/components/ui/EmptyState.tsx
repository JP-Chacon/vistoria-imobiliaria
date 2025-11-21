import { FileQuestion } from 'lucide-react'

type EmptyStateProps = {
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

export const EmptyState = ({
  title = 'Nada encontrado',
  subtitle = 'Ainda não há registros para exibir.',
  action,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-900">
    <FileQuestion className="h-10 w-10 text-slate-400" />
    <div>
      <p className="text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
    {action}
  </div>
)

