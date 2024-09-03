<template>
    <div class="container mx-auto px-4 pb-20">
      <!-- Hero Section -->
      <section class="py-8">
        <h1 class="text-3xl font-bold mb-4">Welcome to Our Store</h1>
        <p class="text-lg mb-4">Discover amazing products at great prices!</p>
        <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Shop Now
        </button>
      </section>
  
      <!-- Featured Categories -->
      <section class="py-8">
        <h2 class="text-2xl font-semibold mb-4">Featured Categories</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="category in featuredCategories" :key="category.id" class="text-center">
            <div class="bg-gray-200 rounded-full w-24 h-24 mx-auto mb-2 flex items-center justify-center">
              <component :is="category.icon" class="w-12 h-12 text-gray-600" />
            </div>
            <p>{{ category.name }}</p>
          </div>
        </div>
      </section>
  
      <!-- New Arrivals -->
      <section class="py-8">
        <h2 class="text-2xl font-semibold mb-4">New Arrivals</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="product in newArrivals" :key="product.id" class="border rounded-lg p-4">
            <div class="bg-gray-200 h-40 mb-2 rounded flex items-center justify-center">
              <img :src="product.image" :alt="product.name" class="max-h-full max-w-full object-contain" />
            </div>
            <h3 class="font-semibold">{{ product.name }}</h3>
            <p class="text-gray-600">${{ product.price.toFixed(2) }}</p>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { Smartphone, Laptop, Headphones, Camera } from 'lucide-vue-next';
  
  const featuredCategories = ref([
    { id: 1, name: 'Smartphones', icon: Smartphone },
    { id: 2, name: 'Laptops', icon: Laptop },
    { id: 3, name: 'Audio', icon: Headphones },
    { id: 4, name: 'Cameras', icon: Camera },
  ]);
  
  const newArrivals = ref([
    { id: 1, name: 'Smartphone X', price: 699.99, image: '/api/placeholder/200/200' },
    { id: 2, name: 'Laptop Pro', price: 1299.99, image: '/api/placeholder/200/200' },
    { id: 3, name: 'Wireless Earbuds', price: 149.99, image: '/api/placeholder/200/200' },
    { id: 4, name: 'Digital Camera', price: 549.99, image: '/api/placeholder/200/200' },
  ]);
  </script>