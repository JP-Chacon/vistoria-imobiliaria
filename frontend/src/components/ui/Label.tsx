import type { ComponentPropsWithoutRef } from 'react'

type LabelProps = ComponentPropsWithoutRef<'label'>

export const Label = ({ className = '', children, ...props }: LabelProps) => (
  <label
    className={`text-sm font-medium text-slate-700 dark:text-slate-200 ${className}`}
    {...props}
  >
    {children}
  </label>
)

