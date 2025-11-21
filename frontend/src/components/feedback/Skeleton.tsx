import clsx from 'clsx'

export const Skeleton = ({
  className = '',
}: {
  className?: string
}) => <div className={clsx('animate-pulse rounded-md bg-slate-200', className)} />

