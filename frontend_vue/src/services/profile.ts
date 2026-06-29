import api from './api'

export interface UpdateProfilePayload {
  name: string
  email: string
}

export interface UpdatePasswordPayload {
  current_password: string
  password: string
  password_confirmation: string
}

export async function updateProfile(payload: UpdateProfilePayload) {
  const { data } = await api.put('/profile', payload)
  return data
}

export async function updatePassword(payload: UpdatePasswordPayload) {
  const { data } = await api.put('/profile/password', payload)
  return data
}
