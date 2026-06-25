<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ProductCard from '@/components/ProductCard.vue'
import { fetchProducts, type Product } from '@/services/products'

const products = ref<Product[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    products.value = await fetchProducts()
  } catch {
    error.value = 'Failed to load products.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="products-page">

    <!-- HEADER -->
    <div class="header">
      <h1 class="page-title">Products</h1>
      <p class="muted">Browse the catalog and jump into any detail page.</p>
    </div>

    <!-- LOADING -->
    <LoadingSpinner v-if="loading" />

    <!-- ERROR -->
    <p v-else-if="error" class="error">
      {{ error }}
    </p>

    <!-- GRID -->
    <div v-else class="grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        class="product-item"
      />
    </div>

  </section>
</template>

<style scoped>
.products-page {
  padding: 24px;
  background: #f6f7fb;
  min-height: 100vh;
}

/* HEADER */
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

/* GRID (SMALL E-COMMERCE STYLE) */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 10px;
}

/* CARD HOVER */
.product-item {
  transition: transform 0.2s ease;
}

.product-item:hover {
  transform: translateY(-5px);
}

/* ERROR */
.error {
  color: #b91c1c;
  text-align: center;
  margin-top: 20px;
  font-weight: 500;
  background: #fee2e2;
  padding: 10px;
  border-radius: 8px;
}
</style>