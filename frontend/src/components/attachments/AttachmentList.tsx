import { Paperclip, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { deleteAttachment } from '../../api/inspections'
import type { Attachment } from '../../types'
import { Button } from '../ui/Button'

type AttachmentListProps = {
  items: Attachment[]
  baseUrl: string
  onDeleted: (id: string) => void
}

export const AttachmentList = ({
  items,
  baseUrl,
  onDeleted,
}: AttachmentListProps) => {
  const handleDelete = async (id: string) => {
    if (!confirm('Deseja remover este anexo?')) return
    try {
      await deleteAttachment(id)
      toast.success('Anexo removido.')
      onDeleted(id)
    } catch (error) {
      console.error(error)
      toast.error('Erro ao remover anexo.')
    }
  }

  if (!items.length) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Nenhum anexo enviado ainda.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {items.map((attachment) => {
        const url = `${baseUrl}/uploads/inspections/${attachment.inspectionId}/${attachment.fileName}`
        const isImage = attachment.mimeType.startsWith('image/')

        return (
          <li
            key={attachment.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex items-center gap-3">
              {isImage ? (
                <img
                  src={url}
                  alt={attachment.originalName}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <Paperclip className="h-5 w-5" />
                </div>
              )}
              <div>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-brand-600 hover:underline"
                >
                  {attachment.originalName}
                </a>
                <p className="text-xs text-slate-500">
                  {(attachment.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(attachment.id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
              Remover
            </Button>
          </li>
        )
      })}
    </ul>
  )
}

