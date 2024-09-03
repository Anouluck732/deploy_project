<template>
  <div class="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-4">Complete Your Order</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            id="name"
            v-model="formData.fullname"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label for="address" class="block text-sm font-medium text-gray-700">Shipping Address</label>
          <input
            type="text"
            id="address"
            v-model="formData.shippingAddress"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div class="bg-gray-100 p-4 rounded-md" v-if="orderDetails.products.length > 0">
          <h3 class="font-semibold mb-2">Order Summary</h3>
          <div v-for="product in orderDetails.products" :key="product.pid" class="flex items-center mb-2">
            <img :src="product.image" alt="Product Image" class="w-16 h-16 object-cover mr-4" />
            <div>
              <p class="text-sm font-medium">{{ product.name }}</p>
              <p class="text-xs text-gray-600">Quantity: {{ product.qty }}</p>
              <p class="text-xs text-gray-600">Price: ${{ product.price }}</p>
            </div>
          </div>
          <p class="mt-4 font-semibold">Total Items: {{ totalItems }}</p>
          <p>Total Amount: ${{ totalAmount.toFixed(2) }}</p>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-red-500 text-white py-3 rounded-md font-semibold disabled:opacity-50"
        >
          {{ isSubmitting ? 'Processing...' : 'Place Order' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCartStore } from '@/stores/cart.store';
import apiOrder from '@/services/order.service';


const cartStore = useCartStore();
const formData = ref({
  fullname: '',
  shippingAddress: ''
});
const isSubmitting = ref(false);
const user = JSON.parse(localStorage.getItem('user'));
const userId = user ? user.id : null;
// Example orderDetails; in a real app, this would come from the cart
const orderDetails = computed(() => ({
  products: cartStore.cartItems || []
}));

const totalItems = computed(() => {
  return orderDetails.value.products.reduce((sum, product) => {
    return sum + (product.quantity || 0);
  }, 0);
});

const totalAmount = computed(() => cartStore.totalAmount);

const handleSubmit = async () => {
  isSubmitting.value = true;

  const orderData = {
    order_date: new Date().toISOString(),
    total_price: totalAmount.value,
    order_status: 'pending',
    shipping_address: formData.value.shippingAddress,
    order_items: orderDetails.value.products.map(p => ({
      pid: p.pid,
      quantity: p.qty, // Use correct property name here
      price: p.price
    })),
    id: userId// Add user ID from Pinia store
  };

  try {
    await apiOrder.createOrder(orderData);
    alert('Order placed successfully!');
  } catch (error) {
    console.error('Error placing order:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

