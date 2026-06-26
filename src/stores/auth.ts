import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchCurrentUser, login as loginRequest, logout as logoutRequest, register as registerRequest, type AuthUser } from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('sanctum_token') ?? '')
  const user = ref<AuthUser | null>(null)
  const initialized = ref(false)

  const isAuthenticated = computed(() => Boolean(token.value))

  function setSession(nextToken: string, nextUser: AuthUser) {
    token.value = nextToken
    user.value = nextUser
    localStorage.setItem('sanctum_token', nextToken)
  }

  function clearSession() {
    token.value = ''
    user.value = null
    localStorage.removeItem('sanctum_token')
  }

  async function bootstrap() {
    if (!token.value) {
      initialized.value = true
      return
    }

    try {
      user.value = await fetchCurrentUser()
    } catch {
      clearSession()
    } finally {
      initialized.value = true
    }
  }

  async function login(email: string, password: string) {
    const response = await loginRequest({ email, password })
    setSession(response.token, response.user)
    return response
  }

  async function register(payload: { name: string; email: string; password: string; password_confirmation: string }) {
    const response = await registerRequest(payload)
    setSession(response.token, response.user)
    return response
  }

  async function logout() {
    try {
      await logoutRequest()
    } finally {
      clearSession()
    }
  }

  function updateUser(nextUser: AuthUser) {
    user.value = nextUser
  }

  return {
    token,
    user,
    initialized,
    isAuthenticated,
    bootstrap,
    login,
    register,
    logout,
    updateUser,
  }
})
