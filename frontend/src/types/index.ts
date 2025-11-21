export type Property = {
  id: string
  ownerName: string
  address: string
  type: 'house' | 'apartment' | 'commercial'
  cep: string
  street: string
  number: string
  district: string
  city: string
  state: string
  observations?: string | null
  createdAt: string
  updatedAt: string
}

export type Inspection = {
  id: string
  propertyId: string
  inspectorName: string
  scheduledFor: string
  status: 'pending' | 'scheduled' | 'completed'
  notes?: string | null
  completedAt?: string | null
  createdAt: string
  updatedAt: string
  property?: Property
}

export type Attachment = {
  id: string
  inspectionId: string
  originalName: string
  fileName: string
  mimeType: string
  size: number
  path: string
  createdAt: string
}

export type User = {
  id: string
  name: string
  email: string
  createdAt: string
}

