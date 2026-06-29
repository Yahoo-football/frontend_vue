<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { fetchCart, removeCartItem, updateCartItem, type CartItem } from '@/services/cart'
import { createOrder } from '@/services/orders'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cartStore = useCartStore()
const loading = ref(true)
const busy = ref(false)
const message = ref('')

const items = computed(() => cartStore.items)

const total = computed(() => items.value.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0))

async function loadCart() {
  loading.value = true
  try {
    const cartItems = await fetchCart()
    cartStore.setItems(cartItems)
  } catch (e) {
    console.error('Failed to load cart:', e)
  } finally {
    loading.value = false
  }
}

onMounted(loadCart)

async function changeQuantity(item: CartItem, quantity: number) {
  // Don't allow quantity less than 1
  if (quantity < 1) return
  
  // Don't allow quantity more than stock
  if (quantity > item.product.stock) {
    alert(`Only ${item.product.stock} items available in stock`)
    await loadCart() // Reload to restore correct state
    return
  }
  
  // Optimistic update - immediately update UI
  cartStore.updateItemQuantity(item.id, quantity)
  
  try {
    // Send update to server in background
    await updateCartItem(item.id, quantity)
  } catch (e) {
    // If failed, reload cart to restore correct state
    console.error('Failed to update quantity:', e)
    await loadCart()
  }
}

async function removeItem(id: number) {
  // Optimistic update - immediately update UI
  cartStore.removeItem(id)
  
  try {
    // Send delete to server in background
    await removeCartItem(id)
  } catch (e) {
    // If failed, reload cart to restore correct state
    console.error('Failed to remove item:', e)
    await loadCart()
  }
}

async function checkout() {
  busy.value = true
  message.value = ''
  try {
    await createOrder()
    message.value = 'Order placed successfully.'
    cartStore.clearCart()
    await router.push({ name: 'orders' })
  } catch (e: any) {
    message.value = e?.response?.data?.message || 'Checkout failed.'
    await loadCart()
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <section>
    <h1 class="page-title">Cart</h1>
    <LoadingSpinner v-if="loading" />
    <div v-else class="grid" style="margin-top: 1rem">
      <article v-for="item in items" :key="item.id" class="panel cart-item">
        <div class="cart-meta">
          <strong>{{ item.product.name }}</strong>
          <p class="muted" style="margin:.25rem 0 0">Unit price: ${{ Number(item.product.price).toFixed(2) }}</p>
          <p class="muted" style="margin:.25rem 0 0">Subtotal: ${{ (Number(item.product.price) * item.quantity).toFixed(2) }}</p>
        </div>
        <div class="cart-controls">
          <button class="qty-btn" @click="changeQuantity(item, Math.max(1, item.quantity - 1))">-</button>
          <span class="qty-display">{{ item.quantity }}</span>
          <button class="qty-btn" @click="changeQuantity(item, item.quantity + 1)">+</button>
          <button class="btn btn-secondary" @click="removeItem(item.id)">Remove</button>
        </div>
      </article>

      <div class="panel" style="padding: 1rem; display:grid; gap:.75rem">
        <strong>Total: ${{ total.toFixed(2) }}</strong>
        <button class="btn btn-primary" :disabled="busy || items.length === 0" @click="checkout">
          {{ busy ? 'Processing...' : 'Checkout' }}
        </button>
        <p v-if="message" style="margin:0">{{ message }}</p>
      </div>
    </div>
  </section>
</template>
