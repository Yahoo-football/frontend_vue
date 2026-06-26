<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { addToCart } from '@/services/cart'
import { fetchProduct, type Product } from '@/services/products'
import { useWishlistStore } from '@/stores/wishlist'

const route = useRoute()
const router = useRouter()
const wishlist = useWishlistStore()

const product = ref<Product | null>(null)
const loading = ref(true)
const adding = ref(false)
const quantity = ref(1)
const message = ref('')

const productId = computed(() => String(route.params.id))

const totalPrice = computed(() => {
  if (!product.value) return 0
  return Number(product.value.price) * quantity.value
})

onMounted(async () => {
  try {
    product.value = await fetchProduct(productId.value)
  } finally {
    loading.value = false
  }
})

async function handleAddToCart() {
  if (!product.value) return

  adding.value = true
  message.value = ''

  try {
    await addToCart({
      product_id: product.value.id,
      quantity: quantity.value,
    })

    message.value = 'Added to cart'

    setTimeout(() => {
      router.push({ name: 'cart' })
    }, 600)

  } catch {
    message.value = 'Failed to add to cart'
  } finally {
    adding.value = false
  }
}
</script>

<template>
  <LoadingSpinner v-if="loading" />

  <section v-else-if="product" class="product-page">

    <div class="product-card">

      <!-- IMAGE -->
      <div class="image-box">
        <img
          v-if="product.image_url"
          :src="product.image_url"
          :alt="product.name"
          class="product-image"
        >
      </div>

      <!-- INFO -->
      <div class="info-box">

        <h1 class="title">{{ product.name }}</h1>

        <p class="desc">
          {{ product.description || 'No description available' }}
        </p>

        <p class="price">
          ${{ Number(product.price).toFixed(2) }}
        </p>

        <p class="stock">
          Stock: {{ product.stock }}
        </p>

        <label class="qty">
          Quantity

          <input
            v-model.number="quantity"
            type="number"
            min="1"
            :max="product.stock"
          >
        </label>

        <p class="total">
          Total: ${{ totalPrice.toFixed(2) }}
        </p>

        <div class="actions">
          <button
            class="btn btn-primary"
            :disabled="adding"
            @click="handleAddToCart"
          >
            {{ adding ? 'Adding...' : 'Add to Cart' }}
          </button>

          <!-- WISHLIST HEART BUTTON -->
          <button
            class="btn wishlist-btn"
            :class="{ 'is-active': wishlist.isWishlisted(product.id) }"
            @click="wishlist.toggle(product.id)"
            title="Toggle Watchlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="heart-svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            {{ wishlist.isWishlisted(product.id) ? 'In Watchlist' : 'Add to Watchlist' }}
          </button>

          <RouterLink class="btn secondary" to="/products">
            Back
          </RouterLink>
        </div>

        <p v-if="message" class="msg">
          {{ message }}
        </p>

      </div>

    </div>

  </section>
</template>

<style scoped>
.product-page {
  max-width: 760px;
  margin: auto;
  padding: 12px;
}

.product-card {
  display: grid;
  grid-template-columns: minmax(220px, 280px) 1fr;
  gap: 18px;
  align-items: start;
  background: rgba(255, 255, 255, 0.95);
  padding: 18px;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.08);
}

.image-box {
  overflow: hidden;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(15, 118, 110, 0.08), rgba(249, 115, 22, 0.08));
}

.product-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
}

.title {
  font-size: 1.7rem;
  margin: 0;
}

.desc {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 0.2rem;
}

.price {
  font-size: 20px;
  font-weight: bold;
  color: #2563eb;
}

.stock {
  font-size: 14px;
  color: #444;
}

.qty {
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  font-size: 14px;
}

.qty input {
  padding: 8px;
  margin-top: 5px;
  border-radius: 8px;
  border: 1px solid #ddd;
  width: 120px;
}

.total {
  margin-top: 10px;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 14px;
  border: none;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, #0f766e, #115e59);
}

.btn.secondary {
  background: #eee;
  color: #333;
  text-decoration: none;
}

/* WISHLIST BUTTON */
.wishlist-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
  text-decoration: none;
  transition: all 0.2s ease;
}

.wishlist-btn:hover {
  background: #e2e8f0;
  color: #334155;
  border-color: #94a3b8;
}

.wishlist-btn.is-active {
  background: #fff1f2;
  color: #e11d48;
  border-color: #fca5a5;
}

.heart-svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  transition: all 0.2s ease;
}

.wishlist-btn.is-active .heart-svg {
  fill: #e11d48;
  stroke: #e11d48;
}

.msg {
  margin-top: 10px;
  font-size: 14px;
  color: green;
}

@media (max-width: 700px) {
  .product-card {
    grid-template-columns: 1fr;
  }

  .product-image {
    height: 200px;
  }
}
</style>
