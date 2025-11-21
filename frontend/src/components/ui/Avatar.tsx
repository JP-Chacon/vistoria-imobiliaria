type AvatarProps = {
  name: string
  className?: string
}

export const Avatar = ({ name, className = '' }: AvatarProps) => {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700 ${className}`}
    >
      {initials}
    </div>
  )
}

