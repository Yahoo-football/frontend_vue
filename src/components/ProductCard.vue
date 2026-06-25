<script setup lang="ts">
import type { Product } from '@/services/products'

defineProps<{
  product: Product
}>()
</script>

<template>
  <article class="product-card panel">
    <div class="product-image-wrap">
      <img
        v-if="product.image_url"
        :src="product.image_url"
        :alt="product.name"
        class="product-image"
      >
    </div>
    <div class="product-body">
      <div class="product-topline">
        <span class="product-badge">In stock: {{ product.stock }}</span>
        <strong class="product-price">${{ Number(product.price).toFixed(2) }}</strong>
      </div>
      <h3 class="product-title">{{ product.name }}</h3>
      <p class="muted product-description">{{ product.description || 'No description available.' }}</p>
      <div class="product-actions">
        <RouterLink class="btn btn-primary" :to="{ name: 'product-detail', params: { id: product.id } }">
          View Detail
        </RouterLink>
      </div>
    </div>
  </article>
</template>
