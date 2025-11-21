import { http } from './http'
import type { User } from '../types'

type LoginResponse = {
  data: {
    accessToken: string
    user: User
  }
}

export type LoginPayload = {
  email: string
  password: string
}

export const login = async (payload: LoginPayload) => {
  const response = await http.post<LoginResponse>('/api/auth/login', payload)
  // O backend retorna { data: { accessToken, user } }
  return response.data.data
}

export const getCurrentUser = async () => {
  const response = await http.get<{ data: User }>('/api/users/me')
  // O backend retorna { data: { ... } }
  return response.data.data
}

