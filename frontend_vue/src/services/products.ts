import api from './api'

export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
  image: string | null
  image_url?: string | null
  category_id?: number | null
  is_active?: boolean
}

export async function fetchProducts(params?: { search?: string }) {
  const { data } = await api.get('/products', { params })
  return Array.isArray(data?.data) ? data.data : data
}

export async function fetchProduct(id: string | number) {
  const { data } = await api.get(`/products/${id}`)
  return data?.data ?? data
}
