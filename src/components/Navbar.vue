<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()

const cartCount = computed(() => cart.totalQuantity)

async function handleLogout() {
  await auth.logout()
  cart.clearCart()
  await router.push({ name: 'login' })
}

onMounted(async () => {
  if (auth.isAuthenticated && !cart.hydrated) {
    await cart.refresh()
  }
})
</script>

<template>
  <header class="navbar-wrapper">
    <nav class="navbar">
      <RouterLink to="/" class="logo">
        <div class="logo-mark">NM</div>
        <div>
          <h2>Nova Market</h2>
          <small>Shop Smart</small>
        </div>
      </RouterLink>

      <div class="nav-links">
        <template v-if="auth.isAuthenticated">
          <RouterLink class="nav-btn" active-class="active-link" to="/products">Products</RouterLink>
          <RouterLink class="nav-btn cart-btn" active-class="active-link" to="/cart">
            Cart
            <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </RouterLink>
          <RouterLink class="nav-btn" active-class="active-link" to="/orders">Orders</RouterLink>
          <span class="user-info">{{ auth.user?.name }}</span>
          <button class="logout-btn" @click="handleLogout">Logout</button>
        </template>

        <template v-else>
          <RouterLink class="nav-btn" to="/login">Login</RouterLink>
          <RouterLink class="register-btn" to="/register">Register</RouterLink>
          <a class="admin-btn" href="http://localhost:8000/login">Admin Panel</a>
        </template>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.navbar-wrapper {
  padding: 20px;
}

.navbar {
  max-width: 1200px;
  margin: auto;
  padding: 14px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 25px rgba(0,0,0,.08);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
}

.logo-mark {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: white;
  background: #2563eb;
}

.logo h2 {
  margin: 0;
}

.logo small {
  color: #777;
}

.nav-links {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.nav-btn,
.register-btn,
.admin-btn,
.logout-btn {
  padding: 10px 16px;
  border-radius: 10px;
  text-decoration: none;
  border: none;
  cursor: pointer;
}

.nav-btn {
  background: #f3f4f6;
}

.active-link {
  background: #2563eb;
  color: white;
}

.register-btn {
  background: #2563eb;
  color: white;
}

.admin-btn {
  background: #111827;
  color: white;
}

.logout-btn {
  background: #dc2626;
  color: white;
}

.user-info {
  font-weight: 600;
}

.cart-btn {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: red;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}
</style>
