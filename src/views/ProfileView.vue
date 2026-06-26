<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { updateProfile, updatePassword } from '@/services/profile'

const auth = useAuthStore()

const profileForm = reactive({
  name: '',
  email: '',
})

const passwordForm = reactive({
  current_password: '',
  password: '',
  password_confirmation: '',
})

const profileLoading = ref(false)
const profileMessage = ref('')
const profileError = ref('')

const passwordLoading = ref(false)
const passwordMessage = ref('')
const passwordError = ref('')

onMounted(() => {
  if (auth.user) {
    profileForm.name = auth.user.name
    profileForm.email = auth.user.email
  }
})

async function handleUpdateProfile() {
  profileLoading.value = true
  profileMessage.value = ''
  profileError.value = ''
  try {
    const res = await updateProfile(profileForm)
    if (res.success) {
      auth.updateUser(res.user)
      profileMessage.value = 'Profile updated successfully.'
    }
  } catch (err: any) {
    profileError.value = err.response?.data?.message || 'Failed to update profile.'
  } finally {
    profileLoading.value = false
  }
}

async function handleUpdatePassword() {
  passwordLoading.value = true
  passwordMessage.value = ''
  passwordError.value = ''
  try {
    const res = await updatePassword(passwordForm)
    if (res.success) {
      passwordMessage.value = 'Password updated successfully.'
      passwordForm.current_password = ''
      passwordForm.password = ''
      passwordForm.password_confirmation = ''
    }
  } catch (err: any) {
    passwordError.value = err.response?.data?.message || 'Failed to update password.'
  } finally {
    passwordLoading.value = false
  }
}
</script>

<template>
  <section class="profile-page">
    <div class="header">
      <h1 class="page-title">My Profile</h1>
      <p class="muted">Manage your personal details and account password.</p>
    </div>

    <div class="profile-grid">
      <!-- UPDATE PROFILE CARD -->
      <article class="panel form-panel">
        <h2 class="section-title">Personal Details</h2>
        <form @submit.prevent="handleUpdateProfile" class="grid">
          <label class="field">
            <span>Name</span>
            <input v-model="profileForm.name" class="input" type="text" required placeholder="Your full name">
          </label>

          <label class="field">
            <span>Email Address</span>
            <input v-model="profileForm.email" class="input" type="email" required placeholder="Your email address">
          </label>

          <p v-if="profileMessage" class="alert success">{{ profileMessage }}</p>
          <p v-if="profileError" class="alert error">{{ profileError }}</p>

          <button class="btn btn-primary" :disabled="profileLoading" type="submit">
            {{ profileLoading ? 'Saving...' : 'Save Profile' }}
          </button>
        </form>
      </article>

      <!-- UPDATE PASSWORD CARD -->
      <article class="panel form-panel">
        <h2 class="section-title">Security & Password</h2>
        <form @submit.prevent="handleUpdatePassword" class="grid">
          <label class="field">
            <span>Current Password</span>
            <input v-model="passwordForm.current_password" class="input" type="password" required placeholder="Enter current password">
          </label>

          <label class="field">
            <span>New Password</span>
            <input v-model="passwordForm.password" class="input" type="password" required placeholder="Enter new password">
          </label>

          <label class="field">
            <span>Confirm New Password</span>
            <input v-model="passwordForm.password_confirmation" class="input" type="password" required placeholder="Confirm new password">
          </label>

          <p v-if="passwordMessage" class="alert success">{{ passwordMessage }}</p>
          <p v-if="passwordError" class="alert error">{{ passwordError }}</p>

          <button class="btn btn-primary" :disabled="passwordLoading" type="submit">
            {{ passwordLoading ? 'Updating...' : 'Update Password' }}
          </button>
        </form>
      </article>
    </div>
  </section>
</template>

<style scoped>
.profile-page {
  max-width: 1000px;
  margin: auto;
  padding: 24px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 30px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 4px;
}

.muted {
  color: #6b7280;
  font-size: 14px;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
}

.form-panel {
  padding: 24px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.25rem;
  padding-bottom: 10px;
  border-bottom: 1px solid #f3f4f6;
}

.grid {
  display: grid;
  gap: 1.25rem;
}

.field {
  display: grid;
  gap: 0.5rem;
}

.field span {
  font-size: 0.85rem;
  font-weight: 600;
  color: #4b5563;
}

.input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #f9fafb;
  padding: 10px 14px;
  outline: none;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.input:focus {
  border-color: #2563eb;
  background: white;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

.alert {
  padding: 12px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
}

.alert.success {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.alert.error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.btn-primary {
  background: #2563eb;
  color: white;
  font-weight: 600;
  border-radius: 10px;
  padding: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
}

.btn-primary:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}
</style>
