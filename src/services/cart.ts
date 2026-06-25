import api from './api'
import type { Product } from './products'

export interface CartItem {
  id: number
  quantity: number
  product_id: number
  product: Product
}

export async function fetchCart() {
  const { data } = await api.get('/cart')
  return data?.data ?? []
}

export async function addToCart(payload: { product_id: number; quantity: number }) {
  const { data } = await api.post('/cart/add', payload)
  return data
}

export async function updateCartItem(id: number, quantity: number) {
  const { data } = await api.put(`/cart/${id}`, { quantity })
  return data
}

export async function removeCartItem(id: number) {
  const { data } = await api.delete(`/cart/${id}`)
  return data
}

export async function clearCart() {
  const { data } = await api.delete('/cart')
  return data
}
