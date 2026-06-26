<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ProductCard from '@/components/ProductCard.vue'
import { fetchProducts, type Product } from '@/services/products'

const products = ref<Product[]>([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
let debounceTimeout: number | undefined

async function loadProducts() {
  loading.value = true
  error.value = ''
  try {
    products.value = await fetchProducts({ search: searchQuery.value })
  } catch {
    error.value = 'Failed to load products.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadProducts()
})

watch(searchQuery, () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    loadProducts()
  }, 400)
})
</script>

<template>
  <section class="products-page">

    <!-- HEADER -->
    <div class="header">
      <h1 class="page-title">Products</h1>
      <p class="muted">Browse the catalog and jump into any detail page.</p>

      <!-- SEARCH BAR -->
      <div class="search-container">
        <div class="search-wrapper">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search products" 
            class="search-input"
          >
          <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''" title="Clear search">
            &times;
          </button>
        </div>
      </div>
    </div>

    <!-- LOADING -->
    <LoadingSpinner v-if="loading" />

    <!-- ERROR -->
    <p v-else-if="error" class="error">
      {{ error }}
    </p>

    <!-- EMPTY STATE -->
    <div v-else-if="products.length === 0" class="empty-state panel">
      <div class="search-empty-icon">🔍</div>
      <h2>No products found</h2>
      <p class="muted">We couldn't find any products matching "{{ searchQuery }}".</p>
      <button class="btn btn-primary" style="margin-top: 1rem" @click="searchQuery = ''">
        Clear Search
      </button>
    </div>

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
  margin-bottom: 24px;
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

/* SEARCH BAR */
.search-container {
  max-width: 480px;
  margin: 1.5rem auto 0;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 999px;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.04);
  padding: 0 16px;
  transition: all 0.25s ease;
}

.search-wrapper:focus-within {
  border-color: #0f766e;
  box-shadow: 0 4px 20px rgba(15, 118, 110, 0.12);
}

.search-icon {
  width: 20px;
  height: 20px;
  color: #94a3b8;
  margin-right: 10px;
  flex-shrink: 0;
}

.search-input {
  width: 100%;
  border: none;
  background: transparent;
  padding: 12px 0;
  outline: none;
  font-size: 0.95rem;
  color: #1e293b;
}

.search-input::placeholder {
  color: #94a3b8;
}

.clear-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.4rem;
  cursor: pointer;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease;
}

.clear-btn:hover {
  color: #ef4444;
}

/* EMPTY STATE */
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

.search-empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
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
  border: 1px solid #fca5a5;
}
</style>