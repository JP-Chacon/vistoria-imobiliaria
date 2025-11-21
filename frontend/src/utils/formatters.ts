import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const formatDateTime = (value: string | Date) =>
  format(new Date(value), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })

export const formatRelativeTime = (value: string | Date) =>
  formatDistanceToNow(new Date(value), { addSuffix: true, locale: ptBR })

