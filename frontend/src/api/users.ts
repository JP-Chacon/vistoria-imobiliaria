import { http } from './http'
import type { User } from '../types'

export const fetchProfile = async () => {
  const { data } = await http.get<User>('/api/users/me')
  return data
}

