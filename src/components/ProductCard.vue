<script setup lang="ts">
import type { Product } from '@/services/products'
import { useWishlistStore } from '@/stores/wishlist'
import { useRouter } from 'vue-router'

const props = defineProps<{ product: Product }>()

const wishlist = useWishlistStore()
const router = useRouter()

function goToDetail() {
  router.push({ name: 'product-detail', params: { id: props.product.id } })
}
</script>

<template>
  <article class="product-card" @click="goToDetail">

    <!-- IMAGE -->
    <div class="img-wrap">
      <img
        v-if="props.product.image_url"
        :src="props.product.image_url"
        :alt="props.product.name"
        class="card-img"
      />

      <div v-else class="placeholder">
        {{ props.product.name.charAt(0) }}
      </div>

      <!-- WISHLIST BUTTON -->
      <button
        class="wish-btn"
        :class="{ 'is-active': wishlist.isWishlisted(props.product.id) }"
        :aria-label="wishlist.isWishlisted(props.product.id)
          ? 'Remove from wishlist'
          : 'Add to wishlist'"
        @click.stop.prevent="wishlist.toggle(props.product.id)"
      >
        <svg viewBox="0 0 24 24">
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          />
        </svg>
      </button>
    </div>

    <!-- BODY -->
    <div class="body">

      <div class="top-row">
        <span
          class="badge"
          :class="{
            'badge--low': props.product.stock > 0 && props.product.stock <= 20,
            'badge--out': props.product.stock === 0
          }"
        >
          {{ props.product.stock === 0
            ? 'Out of stock'
            : `${props.product.stock} in stock`
          }}
        </span>

        <strong class="price">
          ${{ Number(props.product.price).toFixed(2) }}
        </strong>
      </div>

      <h3 class="name">{{ props.product.name }}</h3>

      <p class="desc">
        {{ props.product.description || 'No description available.' }}
      </p>

      <RouterLink
        class="btn"
        :class="{ 'btn--disabled': props.product.stock === 0 }"
        :to="{ name: 'product-detail', params: { id: props.product.id } }"
        @click.stop
      >
        View detail
      </RouterLink>

    </div>

  </article>
</template>

<style scoped>
.product-card {
  background: #fff;
  border-radius: 14px;
  border: 0.5px solid rgba(15, 23, 42, 0.09);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.18s ease;
}

.product-card:hover {
  transform: translateY(-2px);
}

.product-card:hover .card-img {
  transform: scale(1.04);
}

/* IMAGE */
.img-wrap {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: #f8fafc;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.4rem;
  font-weight: 700;
  color: #0f766e;
  background: #f0fdf9;
  width: 100%;
  height: 100%;
}

/* WISHLIST */
.wish-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: 0.5px solid rgba(15, 23, 42, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.wish-btn svg {
  width: 16px;
  height: 16px;
  fill: transparent;
  stroke: #64748b;
  stroke-width: 2;
}

.wish-btn.is-active svg {
  fill: #ef4444;
  stroke: #ef4444;
}

/* BODY */
.body {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 999px;
  background: #dcfce7;
  color: #166534;
}

.badge--low {
  background: #fef3c7;
  color: #92400e;
}

.badge--out {
  background: #fee2e2;
  color: #991b1b;
}

.price {
  font-weight: 700;
  font-size: 14px;
  color: #0f172a;
}

.name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.desc {
  font-size: 12px;
  color: #64748b;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.btn {
  margin-top: 6px;
  padding: 8px;
  border-radius: 8px;
  text-align: center;
  background: #0f766e;
  color: white;
  font-size: 12px;
  text-decoration: none;
}

.btn--disabled {
  background: #e2e8f0;
  color: #94a3b8;
  pointer-events: none;
}
</style>