import api from './api'

export interface AuthUser {
  id: number
  name: string
  email: string
}

export interface AuthResponse {
  status: boolean
  message: string
  user: AuthUser
  token: string
}

export async function login(payload: { email: string; password: string }) {
  const { data } = await api.post<AuthResponse>('/login', payload)
  return data
}

export async function register(payload: { name: string; email: string; password: string; password_confirmation: string }) {
  const { data } = await api.post<AuthResponse>('/register', payload)
  return data
}

export async function fetchCurrentUser() {
  const { data } = await api.get<AuthUser>('/user')
  return data
}

export async function logout() {
  const { data } = await api.post('/logout')
  return data
}
