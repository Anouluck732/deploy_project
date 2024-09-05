// stores/cart.store.js
import { defineStore } from 'pinia';
export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [],
    totalAmount: 0,
  }),
  actions: {
    clearCart() {
      this.cartItems = [];
      this.totalAmount = 0;
    },
  },
});
