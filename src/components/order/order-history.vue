<template>
  <div class="bg-gray-100 min-h-screen p-6">
      <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Order Details -->
          <div v-if="loading" class="p-6 text-center">
              <svg class="animate-spin h-8 w-8 text-blue-500 mx-auto" viewBox="0 0 24 24">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
              <p class="text-gray-600 mt-4">Loading...</p>
          </div>
          <div v-else-if="!orders.length" class="p-6 text-center">
              <p class="font-noto-sans-lao text-gray-600">ບໍມີປະຫວັດການສັ່ງຊຶ້</p>
          </div>
          <div v-else>
              <div v-for="order in orders" :key="order.order_id" class="mb-8 bg-white shadow-md rounded-lg overflow-hidden">
                  <div class="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                      <p class="text-xl font-semibold font-noto-sans-lao text-gray-800">ໝາຍເລກບິນ: {{ order.order_id }}</p>
                      <span :class="statusBadgeClass(order.order_status)" class="px-4 font-noto-sans-lao py-2 rounded-full text-sm font-medium">
                          {{ statusText(order.order_status) }}
                      </span>
                  </div>
                  <div class="p-6">
                      <p class="text-sm font-noto-sans-lao text-gray-600 mb-2">ວັນທີ່ສັ່ງຊຶ້: {{ new Date(order.order_date).toLocaleDateString() }}</p>
                      <p class="text-sm font-noto-sans-lao text-gray-600 mb-4">ສະຖານທີ່ຈັດສົ່ງ: {{ order.shipping_address }}</p>
                      <div v-for="item in order.order_items" :key="item.pid" class="flex items-center p-4 border-b border-gray-200">
                          <div class="flex-grow">
                              <h2 class="font-semibold text-lg font-noto-sans-lao text-gray-800">{{ item.name }}</h2>
                              <p class="text-sm font-noto-sans-lao text-gray-600">ຈຳນວນ: {{ item.quantity }}</p>
                              <p class="font-bold mt-1 text-gray-800">${{ item.price }}</p>
                          </div>
                      </div>
                      <!-- Total Price -->
                      <div class="p-6 bg-gray-50">
                          <div class="flex justify-between items-center">
                              <span class="text-lg font-semibold font-noto-sans-lao text-gray-800">ລວມ</span>
                              <span class="font-bold text-xl text-gray-900">${{ order.total_price.toFixed(2) }}</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import orderService from '@/services/order.service';

const loading = ref(true);
const orders = ref([]);

const FetchOrderData = async (user_id) => {
  try {
      const response = await orderService.orderHistory(user_id); // Fetch order data
      orders.value = response.data; // Assuming response.data contains the array of orders
  } catch (error) {
      console.error('Failed to fetch order data:', error);
  } finally {
      loading.value = false;
  }
};

// Call FetchOrderData on component mount
onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve and parse the user object from localStorage
  if (user && user.id) {
      FetchOrderData(user.id); // Use the `id` field as `user_id`
  } else {
      console.error('User ID not found in localStorage');
  }
});

// Function to determine badge class based on order status
const statusBadgeClass = (status) => {
  const statusClasses = {
    pending: 'status-pending',
    complete: 'status-completed',
    canceled: 'status-canceled',
  };
  return statusClasses[status] || 'bg-gray-300 text-gray-800'; // Default badge
};


// Function to get display text for order status
const statusText = (status) => {
  const statusTexts = {
      pending: 'ກຳລັງດຳເນີນການ', // Pending
      complete: 'ສຳເລັດ', // Completed
      canceled: 'ຍົກເລີກ', // Canceled
  };
  return statusTexts[status] || 'ບໍ່ລະບຸ'; // Default text
};
</script>


<style scoped>
.custom-status-badge {
  padding: 0.5rem 1rem;
  border-radius: 9999px; /* Fully rounded badge */
  font-size: 0.875rem; /* Small text */
  font-weight: 500; /* Medium font weight */
}

/* Custom styles for different statuses */
.status-pending {
  background-color: #fff236; /* Light yellow */

}

.status-completed {
  background-color: #25c206; /* Dark green */
  color: #fcfffd; /* Light green text */
}

.status-canceled {
  background-color: #fee2e2; /* Light red */
  color: #b91c1c; /* Dark red text */
}
</style>


