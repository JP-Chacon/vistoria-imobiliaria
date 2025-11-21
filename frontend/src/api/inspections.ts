import { http } from './http'
import type { Attachment, Inspection } from '../types'

export type InspectionPayload = {
  propertyId?: string
  inspectorName?: string
  scheduledFor?: string
  status?: Inspection['status']
  notes?: string | null
}

export const getInspections = async () => {
  const { data } = await http.get<{ data: Inspection[] }>('/api/inspections')
  return data.data
}

export const getInspection = async (id: string) => {
  const { data } = await http.get<{ data: Inspection }>(
    `/api/inspections/${id}`,
  )
  return data.data
}

export const createInspection = async (payload: InspectionPayload) => {
  const { data } = await http.post<{ data: Inspection }>(
    '/api/inspections',
    payload,
  )
  return data.data
}

export const updateInspection = async (id: string, payload: InspectionPayload) => {
  const { data } = await http.put<{ data: Inspection }>(
    `/api/inspections/${id}`,
    payload,
  )
  return data.data
}

export const deleteInspection = async (id: string) => {
  await http.delete(`/api/inspections/${id}`)
}

export const getAttachments = async (inspectionId: string) => {
  const { data } = await http.get<{ data: Attachment[] }>(
    `/api/inspections/${inspectionId}/attachments`,
  )
  return data.data
}

export const uploadAttachments = async (
  inspectionId: string,
  files: File[],
  onUploadProgress?: (progress: number) => void,
) => {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))

  const { data } = await http.post<{ data: Attachment[] }>(
    `/api/inspections/${inspectionId}/attachments`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (event) => {
        if (event.total) {
          const progress = Math.round((event.loaded / event.total) * 100)
          onUploadProgress?.(progress)
        }
      },
    },
  )

  return data.data
}

export const deleteAttachment = async (attachmentId: string) => {
  await http.delete(`/api/attachments/${attachmentId}`)
}

