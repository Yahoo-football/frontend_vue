import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as any[],
  }),

  getters: {
    count: (state) => state.items.length,
  },

  actions: {
    setItems(items: any[]) {
      this.items = items
    },

    clearCart() {
      this.items = []
    },
  },
})