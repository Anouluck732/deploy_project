<template>
    <div class="container mx-auto p-4 pt-16 bg-white">


        <!-- Product Images -->
        <div class="mb-6">
            <img :src="product.image" alt="Product Image" class="w-full h-[40vh] object-cover mb-2">
        </div>

        <!-- Product Info -->
        <div class="mb-6">
            <h2 class="text-xl font-semibold mb-2 text-gray-800">{{ product.name }}</h2>
            <div class="flex items-center mb-2">
                <span class="text-yellow-400 mr-1">★</span>
                <span class="text-sm text-gray-600">{{ product.rating }} Ratings</span>
                <span class="mx-2 text-gray-300">|</span>
                <span class="text-sm text-gray-600">{{ product.review }} Reviews</span>
                <span class="mx-2 text-gray-300">|</span>
                <span class="text-sm text-gray-600">{{ product.sold }} Sold</span>
            </div>
            <p class="text-2xl font-bold text-red-600">${{ formattedPrice }}</p>
            <button @click="toggleFavorite" class="text-red-600 mt-4 hover:text-red-700">
                <Heart :class="{ 'fill-current': isFavorite }" />
            </button>
        </div>

        <!-- About Item and Reviews tabs -->
        <div class="mb-6">
            <div class="flex border-b">
                <button class="py-2 px-4 font-semibold text-red-600 border-b-2 border-red-600">About Item</button>
                <button class="py-2 px-4 font-semibold text-gray-500">Reviews</button>
            </div>
            <div class="py-4">
                <p class="text-gray-700">{{ product.description }}</p>
            </div>
        </div>

        <!-- Add to Cart Button -->
        <div class="fixed bottom-0 left-0 w-full bg-white p-4 shadow-md">
            <button class="w-full bg-red-600 text-white py-3 rounded-lg font-semibold">
                Buy Now
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {  Heart } from 'lucide-vue-next';
import {  useRoute } from 'vue-router';
import productService from '@/services/product.service';


const route = useRoute();
const pid = route.params.pid;
const product = ref({});
const isFavorite = ref(false);

// Function to fetch product data
const fetchProduct = async (pid) => {
    try {
        const response = await productService.getProductid(pid);
        product.value = response.data;
        console.log('Product data:', product.value);
        console.log('Product image URL:', product.value.image);
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
};

fetchProduct(pid);


const toggleFavorite = () => {
    isFavorite.value = !isFavorite.value;
    // Here you would typically also send a request to your backend to update the favorite status
    console.log(`Product ${isFavorite.value ? 'added to' : 'removed from'} favorites`);
};

// Compute formatted price
const formattedPrice = computed(() => {
    const price = parseFloat(product.value.price);
    return isNaN(price) ? '0.00' : price.toFixed(2);
});
</script>