<template>
  <div class="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
    <div class="p-4">
      <h2 class="text-2xl font-bold font-noto-sans-lao mb-4">ລາຍລະອຽດການສັ່ງຊື້</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="address" class="block text-sm font-medium font-noto-sans-lao text-gray-700">ສະຖານທີ່ຈັດສົ່ງ</label>
          <input
            type="text"
            id="address"
            v-model="formData.shippingAddress"
            class="mt-1 block w-full rounded-md border-gray-800 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div class="bg-gray-100 p-4 rounded-md" v-if="orderDetails.products.length > 0">
          <h3 class="font-semibold font-noto-sans-lao mb-2">ສະຫຼຸບການສັ່ງຊື້</h3>
          <div v-for="product in orderDetails.products" :key="product.pid" class="flex items-center mb-2">
            <img :src="product.image" alt="Product Image" class="w-16 h-16 object-cover mr-4" />
            <div>
              <p class="text-sm font-noto-sans-lao font-medium">{{ product.name }}</p>
              <p class="text-xs font-noto-sans-lao text-gray-600">ຈຳນວນ: {{ product.qty }}</p>
              <p class="text-xs font-noto-sans-lao text-gray-600">ລາຄາ: ${{ product.price }}</p>
            </div>
          </div>
          <p class="mt-4 font-noto-sans-lao font-semibold">ຈຳນວນທັງໝົດ: {{ totalItems }}</p>
          <p class="font-noto-sans-lao">ລາຄາລວມທັງໝົດ: ${{ totalAmount.toFixed(2) }}</p>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-red-500 font-noto-sans-lao text-white py-3 rounded-md font-semibold disabled:opacity-50"
        >
          {{ isSubmitting ? 'Processing...' : 'ຢືນຍັນການສັ່ງຊື້' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCartStore } from '@/stores/cart.store';
import apiOrder from '@/services/order.service';
import { useRouter } from 'vue-router';

const router = useRouter();
const cartStore = useCartStore();

const formData = ref({
  shippingAddress: ''
});
const isSubmitting = ref(false);

const user = JSON.parse(localStorage.getItem('user'));
const userId = user ? user.id : null;

const orderDetails = computed(() => ({
  products: cartStore.cartItems || []
}));

const totalItems = computed(() => {
  return orderDetails.value.products.reduce((sum, product) => sum + (product.qty || 0), 0);
});

const totalAmount = computed(() => {
  return orderDetails.value.products.reduce((sum, product) => sum + (product.qty * product.price), 0);
});

const handleSubmit = async () => {
  if (!userId) {
    alert('User is not authenticated. Please log in.');
    return;
  }

  isSubmitting.value = true;

  const orderData = {
    userId: userId,
    order_date: new Date().toISOString(),
    total_price: totalAmount.value,
    order_status: 'pending',
    shipping_address: formData.value.shippingAddress,
    order_items: orderDetails.value.products.map(p => ({
      pid: p.pid,
      quantity: p.qty,
      price: p.price
    }))
  };

  try {
    await apiOrder.createOrder(orderData);
    alert('Order placed successfully!');
    cartStore.clearCart();
    router.push('/product');
  } catch (error) {
    console.error('Error placing order:', error);
    alert('Error placing order. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>