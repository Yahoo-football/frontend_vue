import api from './api'
import type { Product } from './products'

export interface WishlistItem {
  id: number
  user_id: number
  product_id: number
  product: Product
  created_at?: string
  updated_at?: string
}

export async function fetchWishlist(): Promise<WishlistItem[]> {
  const { data } = await api.get('/wishlist')
  return data?.data ?? []
}

export async function addToWishlist(productId: number): Promise<WishlistItem> {
  const { data } = await api.post('/wishlist/add', { product_id: productId })
  return data?.wishlist
}

export async function removeFromWishlist(wishlistOrProductId: number): Promise<void> {
  await api.delete(`/wishlist/${wishlistOrProductId}`)
}
