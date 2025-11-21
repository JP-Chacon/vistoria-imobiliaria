import { http } from './http'
import type { Property } from '../types'

export type PropertyPayload = Pick<
  Property,
  | 'ownerName'
  | 'address'
  | 'type'
  | 'cep'
  | 'street'
  | 'number'
  | 'district'
  | 'city'
  | 'state'
  | 'observations'
>

export const getProperties = async () => {
  const { data } = await http.get<{ data: Property[] }>('/api/properties')
  return data.data
}

export const getProperty = async (id: string) => {
  const { data } = await http.get<{ data: Property }>(`/api/properties/${id}`)
  return data.data
}

export const createProperty = async (payload: PropertyPayload) => {
  const { data } = await http.post<{ data: Property }>('/api/properties', payload)
  return data.data
}

export const updateProperty = async (id: string, payload: PropertyPayload) => {
  const { data } = await http.put<{ data: Property }>(`/api/properties/${id}`, payload)
  return data.data
}

export const deleteProperty = async (id: string) => {
  await http.delete(`/api/properties/${id}`)
}

