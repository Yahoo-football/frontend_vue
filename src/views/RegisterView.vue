<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const loading = ref(false)
const error = ref('')
const form = reactive({ name: '', email: '', password: '', password_confirmation: '' })

async function submit() {
  loading.value = true
  error.value = ''
  try {
    await auth.register(form)
    await router.push({ name: 'products' })
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Unable to register.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="panel" style="max-width: 520px; margin: 2rem auto; padding: 1.5rem">
    <h1 style="margin-top:0">Register</h1>
    <form class="grid" @submit.prevent="submit">
      <label class="field">
        <span>Name</span>
        <input v-model="form.name" class="input" type="text" required>
      </label>
      <label class="field">
        <span>Email</span>
        <input v-model="form.email" class="input" type="email" required>
      </label>
      <label class="field">
        <span>Password</span>
        <input v-model="form.password" class="input" type="password" minlength="6" required>
      </label>
      <label class="field">
        <span>Confirm Password</span>
        <input v-model="form.password_confirmation" class="input" type="password" minlength="6" required>
      </label>
      <p v-if="error" style="color:#b91c1c; margin:0">{{ error }}</p>
      <button class="btn btn-primary" :disabled="loading" type="submit">
        {{ loading ? 'Creating account...' : 'Register' }}
      </button>
    </form>
  </section>
</template>
