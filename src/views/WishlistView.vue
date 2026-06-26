<script setup lang="ts">
import { onMounted } from 'vue'
import { useWishlistStore } from '@/stores/wishlist'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ProductCard from '@/components/ProductCard.vue'

const wishlistStore = useWishlistStore()

onMounted(async () => {
  await wishlistStore.refresh()
})
</script>

<template>
  <section class="wishlist-page">
    <div class="header">
      <h1 class="page-title">My Watchlist</h1>
      <p class="muted">Your saved products and items you love.</p>
    </div>

    <LoadingSpinner v-if="wishlistStore.loading" />

    <div v-else-if="wishlistStore.items.length === 0" class="empty-state panel">
      <div class="heart-icon">❤️</div>
      <h2>Your watchlist is empty</h2>
      <p class="muted">Explore products and click the heart icon to save them here.</p>
      <RouterLink to="/products" class="btn btn-primary" style="margin-top: 1rem">
        Browse Products
      </RouterLink>
    </div>

    <div v-else class="grid">
      <ProductCard
        v-for="item in wishlistStore.items"
        :key="item.id"
        :product="item.product"
        class="product-item"
      />
    </div>
  </section>
</template>

<style scoped>
.wishlist-page {
  padding: 24px;
  background: #f6f7fb;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 18px;
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

.empty-state {
  text-align: center;
  padding: 3rem;
  max-width: 500px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.heart-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  animation: pulse 1.5s infinite alternate;
}

@keyframes pulse {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 10px;
}

.product-item {
  transition: transform 0.2s ease;
}

.product-item:hover {
  transform: translateY(-5px);
}
</style>
