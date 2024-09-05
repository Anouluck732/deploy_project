<template>
  <div class="container mx-auto my-6 mb-12 font-noto-sans-lao">
    <div
      v-for="product in products"
      :key="product.pid"
      class="max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden mb-6"
    >
      <img :src="product.image" alt="Product Image" class="w-full h-48 object-cover">
      <div class="p-4">
        <h2 class="text-xl font-semibold text-gray-800">{{ product.name }}</h2>
        <p class="text-gray-600 mt-1">${{ product.price }}</p>
        <div class="flex items-center mt-2">
          <span class="bg-yellow-400 text-white text-xs px-2 py-1 rounded-full">{{ product.rating }}</span>
          <span class="text-gray-600 ml-2">({{ product.review }} ລີວິວ)</span>
        </div>
        <p class="text-gray-700 mt-2">{{ product.description }}</p>
        <div class="flex justify-between mt-4">
          <span class="text-gray-600">ຍອດຂາຍ: {{ product.sold }}</span>
          <span class="text-gray-600">ສິນຄ້າຍັງເຫຼືອ: {{ product.qty_product }}</span>
        </div>
        <div class="mt-4 flex justify-end">
          <button  class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">ເພີ່ມເຂົ້າກະຕ່າ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import productService from '@/services/product.service';

const products = ref([]);

const fetchData = async () => {
  try {
    const response = await productService.getPopularProduct();
    products.value = response.data;
  } catch (error) {
    console.error('Failed to fetch product data:', error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.font-noto-sans-lao {
  font-family: 'Noto Sans Lao', sans-serif;
}
</style>
