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

    updateItemQuantity(itemId: number, quantity: number) {
      const item = this.items.find(i => i.id === itemId)
      if (item) {
        item.quantity = quantity
      }
    },

    removeItem(itemId: number) {
      this.items = this.items.filter(i => i.id !== itemId)
    },

    addItem(item: any) {
      this.items.push(item)
    },
  },
})