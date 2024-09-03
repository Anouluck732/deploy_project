// stores/cart.store.js
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref([]);

  const totalAmount = computed(() => {
    return cartItems.value.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.qty, 10) || 0;
      return sum + (price * quantity);
    }, 0);
  });

  return {
    cartItems,
    totalAmount,
  };
});
