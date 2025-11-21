import { useId, useState } from 'react'
import { toast } from 'sonner'

import { uploadAttachments } from '../../api/inspections'
import type { Attachment } from '../../types'
import { ProgressBar } from '../feedback/ProgressBar'
import { Button } from '../ui/Button'

type AttachmentUploaderProps = {
  inspectionId: string
  onUploaded: (attachments: Attachment[]) => void
}

export const AttachmentUploader = ({
  inspectionId,
  onUploaded,
}: AttachmentUploaderProps) => {
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const inputId = useId()

  const handleChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return

    try {
      setIsUploading(true)
      const uploaded = await uploadAttachments(
        inspectionId,
        files,
        setProgress,
      )
      toast.success('Arquivos enviados com sucesso!')
      onUploaded(uploaded)
    } catch (error) {
      console.error(error)
      toast.error('Não foi possível enviar os arquivos.')
    } finally {
      setIsUploading(false)
      setProgress(0)
      event.target.value = ''
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-dashed border-slate-300 p-4 text-center dark:border-slate-700">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Arraste ou selecione múltiplos arquivos para enviar anexos da vistoria.
      </p>

      <div className="flex items-center justify-center gap-3">
        <input
          id={inputId}
          type="file"
          multiple
          onChange={handleChange}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => document.getElementById(inputId)?.click()}
          isLoading={isUploading}
        >
          Selecionar arquivos
        </Button>
      </div>

      {isUploading && <ProgressBar progress={progress} />}
    </div>
  )
}

