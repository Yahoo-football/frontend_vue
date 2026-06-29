import api from './api'
import type { Product } from './products'

export interface OrderItem {
  id: number
  quantity: number
  price: number
  product: Product
}

export interface Order {
  id: number
  total_price: number
  status: string
  created_at?: string
  items?: OrderItem[]
}

export async function fetchOrders() {
  const { data } = await api.get('/orders')
  return Array.isArray(data) ? data : data?.data ?? []
}

export async function createOrder() {
  const { data } = await api.post('/orders')
  return data
}
