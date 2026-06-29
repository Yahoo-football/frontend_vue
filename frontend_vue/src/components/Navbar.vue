<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'

const auth = useAuthStore()
const cart = useCartStore()
const wishlist = useWishlistStore()
const router = useRouter()

const cartCount = computed(() => cart.totalQuantity)
const wishlistCount = computed(() => wishlist.items.length)

async function handleLogout() {
  await auth.logout()
  cart.clearCart()
  wishlist.clearWishlist()
  await router.push({ name: 'login' })
}

onMounted(async () => {
  if (auth.isAuthenticated) {

    // ✅ FIX: use real function instead of refresh()
    if (!cart.hydrated) {
      await cart.loadCart?.()   // or cart.fetchCart()
    }

    await wishlist.loadWishlist?.() // or wishlist.fetchWishlist()
  }
})
</script>
<template>
  <header class="navbar">
    <div class="container">

      <!-- LEFT SIDE -->
      <div class="left">

        <RouterLink to="/" class="logo">
          <div class="logo-icon">NM</div>
          <div class="logo-text">
            <h2>Nova Market</h2>
            <small>Shop Smart</small>
          </div>
        </RouterLink>

        <template v-if="auth.isAuthenticated">

          <RouterLink to="/products" class="link" active-class="active">
            Products
          </RouterLink>

          <RouterLink to="/orders" class="link" active-class="active">
            Orders
          </RouterLink>

        </template>

      </div>

      <!-- RIGHT SIDE -->
      <div class="right">

        <template v-if="auth.isAuthenticated">

          <RouterLink to="/wishlist" class="link icon" active-class="active">
            ❤️
            <span v-if="wishlistCount" class="badge">
              {{ wishlistCount }}
            </span>
          </RouterLink>

          <RouterLink to="/cart" class="link icon" active-class="active">
            🛒
            <span v-if="cartCount" class="badge">
              {{ cartCount }}
            </span>
          </RouterLink>

          <RouterLink to="/profile" class="user-link">
            👤 {{ auth.user?.name }}
          </RouterLink>

          <button class="logout" @click="handleLogout">
            Logout
          </button>

        </template>

        <template v-else>

          <RouterLink to="/login" class="login">
            Login
          </RouterLink>

          <RouterLink to="/register" class="register">
            Register
          </RouterLink>

          <a href="http://localhost:8000/login" class="admin">
            Admin Panel
          </a>

        </template>

      </div>

    </div>
  </header>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
}

.container {
  max-width: 1250px;
  margin: auto;
  padding: 0 25px;
  height: 75px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* LEFT SIDE */
.left {
  display: flex;
  align-items: center;
  gap: 18px;
}

/* RIGHT SIDE */
.right {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* LOGO */
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.logo-icon {
  width: 50px;
  height: 50px;
  border-radius: 14px;

  display: flex;
  justify-content: center;
  align-items: center;

  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  font-weight: bold;
  font-size: 18px;
}

.logo-text h2 {
  font-size: 20px;
  color: #111827;
}

.logo-text small {
  font-size: 12px;
  color: #6b7280;
}

/* LINKS */
.link {
  text-decoration: none;
  color: #374151;
  font-weight: 600;
  padding: 9px 14px;
  border-radius: 8px;
  transition: 0.25s;
}

.link:hover {
  background: #eff6ff;
  color: #2563eb;
}

/* ACTIVE LINK */
.active {
  background: #2563eb !important;
  color: white !important;
}

/* ICON LINKS */
.icon {
  position: relative;
  font-size: 20px;
}

/* BADGE */
.badge {
  position: absolute;
  top: -6px;
  right: -6px;

  min-width: 18px;
  height: 18px;

  background: #ef4444;
  color: white;

  border-radius: 50%;

  font-size: 11px;
  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 2px solid white;
}

/* USER LINK */
.user-link {
  background: #f3f4f6;
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 600;
  color: #111827;
  text-decoration: none;
  transition: 0.25s;
}

.user-link:hover {
  background: #e5e7eb;
  color: #2563eb;
}

/* BUTTONS */
.login,
.register,
.admin,
.logout {
  padding: 9px 16px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: 0.25s;
}

/* LOGIN */
.login {
  color: #2563eb;
}

.login:hover {
  background: #eff6ff;
}

/* REGISTER */
.register {
  background: #2563eb;
  color: white;
}

.register:hover {
  background: #1d4ed8;
}

/* ADMIN */
.admin {
  background: #111827;
  color: white;
}

.admin:hover {
  background: #000;
}

/* LOGOUT */
.logout {
  background: #ef4444;
  color: white;
}

.logout:hover {
  background: #dc2626;
}

/* ACTIVE ANIMATION */
.link:hover,
.login:hover,
.register:hover,
.admin:hover,
.logout:hover,
.user-link:hover {
  transform: translateY(-2px);
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .container {
    flex-direction: column;
    height: auto;
    padding: 15px;
    gap: 15px;
  }

  .left,
  .right {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>