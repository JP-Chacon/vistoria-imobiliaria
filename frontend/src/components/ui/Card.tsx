import type { ReactNode } from 'react'

type CardProps = {
  title?: string
  description?: string
  children: ReactNode
  className?: string
  headerRight?: ReactNode
}

export const Card = ({
  title,
  description,
  children,
  className = '',
  headerRight,
}: CardProps) => (
  <div
    className={`rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-card dark:border-slate-800 dark:bg-slate-900 ${className}`}
  >
    {(title || description || headerRight) && (
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
        {headerRight}
      </div>
    )}
    {children}
  </div>
)

