<template>
    <div class="container mx-auto p-4">
      <!-- Product Grid -->
      <div class="grid grid-cols-2 gap-4 mt-4 md:grid-cols-3 lg:grid-cols-4">
        <div v-for="product in filteredProducts" :key="product.pid"
          class="bg-white rounded-lg overflow-hidden shadow-md relative transition-all duration-300 hover:shadow-xl">
          <img :src="product.image || '/api/placeholder/300/200'" :alt="product.name" class="w-full h-48 object-cover" @click="navigateToProductDetail(product.pid)">
          <button @click.stop="toggleFavorite(product)" 
                  class="absolute top-2 right-2 transition-colors duration-200"
                  :class="product.isFavorite ? 'text-red-500' : 'text-gray-400'"
                  aria-label="Toggle favorite">
            <Heart class="h-6 w-6" :class="{'fill-current': product.isFavorite, 'stroke-current': !product.isFavorite}" />
          </button>
  
          <div class="p-4" @click="navigateToProductDetail(product.pid)">
            <div class="flex items-center mb-2">
              <div class="flex text-yellow-400">
                <Star v-for="i in 5" :key="i" class="h-4 w-4"
                  :class="i <= Math.floor(parseFloat(product.rating)) ? 'fill-current' : 'stroke-current'" />
              </div>
              <span class="ml-1 text-sm text-gray-600">{{ product.rating }}</span>
            </div>
            <p class="text-gray-600 text-sm mb-1 line-clamp-2">{{ product.description }}</p>
            <h3 class="font-semibold text-lg mb-2">{{ product.name }}</h3>
            <div class="flex justify-between items-baseline">
              <span class="text-lg font-bold">${{ product.price }}</span>
            </div>
            <button @click.stop="addToCart(product)" 
                    class="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg mt-2 w-full"
                    :disabled="product.inCart"
                    :class="{ 'opacity-50 cursor-not-allowed': product.inCart }">
              {{ product.inCart ? 'In Cart' : 'Add to Cart' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { Star, Heart } from 'lucide-vue-next';

  import favouriteService from '@/services/favourite.service';
  import card from '@/services/card.service';
  import { useRouter } from 'vue-router';
  const router = useRouter();
  

  const navigateToProductDetail = (pid) => {
    if (pid) {
      console.log('Navigating to product detail:', pid);
      router.push(`/product/${pid}`);
    } else {
      console.error('Product ID is undefined or null');
    }
  };
  
  // Add product to cart
  const addToCart = async (product) => {
    if (product.inCart) {
      console.log('Product is already in cart');
      return;
    }
  
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        console.error('User is not logged in');
        // Redirect to login page or show a message
        return;
      }
  
      const body = {
        user_id: user.id,
        pid: product.pid,
        quantity: 1
      };
  
      const response = await card.createCart(body);
      console.log('Product added to cart:', response.data);
      product.inCart = true; // Update the local state
      // Optionally show a success message
    } catch (error) {
      console.error('Error adding product to cart:', error);
      // Optionally show an error message
    }
  };
  
  // Toggle favorite status
  const toggleFavorite = async (product) => {
    try {
      const user_id = JSON.parse(localStorage.getItem('user')).id;
      const newFavoriteStatus = !product.isFavorite;
  
      if (newFavoriteStatus) {
        const body = {
          f_pid: product.pid,
          user_id
        };
        const response = await favouriteService.createFavourite(body);
        product.fid = response.data.fid;
      } else {
        if (product.fid) {
          await favouriteService.deleteFavourite(product.fid);
          product.fid = null;
        } else {
          console.error('Cannot delete favorite: fid is missing');
          return;
        }
      }
  
      product.isFavorite = newFavoriteStatus;
      console.log(`Product ${product.pid} favorite status updated to: ${product.isFavorite}`);
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };
  
  // Reactive state
  const products = ref([]);
  
  // Filtered products based on the current state (e.g., category, search term)
  const filteredProducts = computed(() => products.value);
  
  onMounted(async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const user_id = user ? user.id : null;

    if (!user_id) {
      console.error('User ID is not available in local storage');
      return;
    }

    // Fetch both products and favorites from favouriteService
    const [productsResponse, favoritesResponse, cartResponse] = await Promise.all([
      favouriteService.getFavourite({ type: 'products' }, user_id), // Adjust the params if necessary
      favouriteService.getFavourite({ type: 'favorites' }, user_id),
      card.getCart(user_id) // Keeping the cart fetch from card service
    ]);

    const favorites = new Map(favoritesResponse.data.map(fav => [fav.pid, fav.fid]));
    const cartItems = new Set(cartResponse.data.map(item => item.pid));

    // Assuming productsResponse.data contains the product list
    products.value = productsResponse.data.map(product => ({
      ...product,
      isFavorite: favorites.has(product.pid),
      fid: favorites.get(product.pid) || null,
      inCart: cartItems.has(product.pid)
    }));

    console.log('Products fetched:', products.value);
  } catch (error) {
    console.error('Error fetching products, favorites, and cart items:', error);
  }
});

  </script>
  
  <style scoped>
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  </style>
  