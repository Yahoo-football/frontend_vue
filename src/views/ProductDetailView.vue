<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { addToCart } from '@/services/cart'
import { fetchProduct, type Product } from '@/services/products'

const route = useRoute()
const router = useRouter()

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
