import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchWishlist, addToWishlist, removeFromWishlist, type WishlistItem } from '@/services/wishlist'
import { useAuthStore } from './auth'

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<WishlistItem[]>([])
  const loading = ref(false)
  const auth = useAuthStore()

  const wishlistProductIds = computed(() => {
    return new Set(items.value.map(item => item.product_id))
  })

  function isWishlisted(productId: number): boolean {
    return wishlistProductIds.value.has(productId)
  }

  async function refresh() {
    if (!auth.isAuthenticated) return
    loading.value = true
    try {
      items.value = await fetchWishlist()
    } catch (err) {
      console.error('Failed to fetch wishlist:', err)
    } finally {
      loading.value = false
    }
  }

  async function toggle(productId: number) {
    if (!auth.isAuthenticated) return
    
    const existingItem = items.value.find(item => item.product_id === productId)
    if (existingItem) {
      // Remove from wishlist
      try {
        await removeFromWishlist(existingItem.id)
        items.value = items.value.filter(item => item.product_id !== productId)
      } catch (err) {
        console.error('Failed to remove from wishlist:', err)
      }
    } else {
      // Add to wishlist
      try {
        const newItem = await addToWishlist(productId)
        if (newItem) {
          items.value.push(newItem)
        } else {
          await refresh()
        }
      } catch (err) {
        console.error('Failed to add to wishlist:', err)
      }
    }
  }

  function clearWishlist() {
    items.value = []
  }

  return {
    items,
    loading,
    isWishlisted,
    refresh,
    toggle,
    clearWishlist
  }
})
