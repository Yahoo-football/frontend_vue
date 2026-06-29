<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { fetchOrders, type Order } from '@/services/orders'

const orders = ref<Order[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    orders.value = await fetchOrders()
  } catch {
    error.value = 'Failed to load orders.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section>
    <h1 class="page-title">Orders</h1>
    <LoadingSpinner v-if="loading" />
    <p v-else-if="error" style="color:#b91c1c">{{ error }}</p>
    <div v-else class="grid" style="margin-top: 1rem">
      <article v-for="order in orders" :key="order.id" class="panel" style="padding: 1rem">
        <div style="display:flex; justify-content:space-between; gap:1rem; flex-wrap:wrap">
          <div>
            <strong>Order #{{ order.id }}</strong>
            <p class="muted" style="margin:.25rem 0 0">Status: {{ order.status }}</p>
          </div>
          <strong>${{ Number(order.total_price).toFixed(2) }}</strong>
        </div>
      </article>
      <p v-if="orders.length === 0" class="muted">No orders yet.</p>
    </div>
  </section>
</template>
