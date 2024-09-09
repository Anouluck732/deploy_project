<template>
  <div class="container mx-auto p-4 font-noto-sans-lao mb-12">
    <!-- Loading State -->
    <div v-if="loading" class="p-6 text-center">
      <svg class="animate-spin h-8 w-8 text-blue-500 mx-auto" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0z" />
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
      </svg>
      <p class="text-gray-600 font-noto-sans-lao mt-4">ກຳລັງໂຫຼດ...</p>
    </div>

    <!-- No Products State -->
    <div v-else-if="!products.length" class="p-6 text-center">
      <p class="font-noto-sans-lao text-gray-600">ຍັງບໍມີລາຍການທີ່ມັກ</p>
    </div>

    <!-- Product Grid -->
    <div v-else class="grid grid-cols-2 gap-4 mt-4 md:grid-cols-3 lg:grid-cols-4">
      <div v-for="product in filteredProducts" :key="product.pid"
        class="bg-white rounded-lg overflow-hidden shadow-md relative transition-all duration-300 hover:shadow-xl">
        <img :src="product.image || '/api/placeholder/300/200'" :alt="product.name" class="w-full h-48 object-cover"
          @click="navigateToProductDetail(product.pid)">
        <button @click.stop="toggleFavorite(product)" class="absolute top-2 right-2 transition-colors duration-200"
          :class="product.isFavorite ? 'text-red-500' : 'text-gray-400'" aria-label="Toggle favorite">
          <Heart class="h-6 w-6" :class="{ 'fill-current': product.isFavorite, 'stroke-current': !product.isFavorite }" />
        </button>

        <div class="p-4" @click="navigateToProductDetail(product.pid)">
          <div class="flex items-center mb-2">
            <div class="flex text-yellow-400">
              <Star v-for="i in 5" :key="i" class="h-4 w-4"
                :class="i <= Math.floor(parseFloat(product.rating || 0)) ? 'fill-current' : 'stroke-current'" />
            </div>
            <span class="ml-1 text-sm text-gray-600">{{ product.rating || 'N/A' }}</span>
          </div>
          <p class="text-gray-600 text-sm mb-1 line-clamp-2">{{ product.description }}</p>
          <h3 class="font-semibold text-lg mb-2">{{ product.name }}</h3>
          <div class="flex justify-between items-baseline">
            <span class="text-lg font-bold">${{ product.price }}</span>
          </div>
          <button @click.stop="addToCart(product)"
            class="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg mt-2 w-full" :disabled="product.inCart"
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
const products = ref([]);
const loading = ref(true);

const filteredProducts = computed(() => products.value);

const navigateToProductDetail = (pid) => {
  if (pid) {
    console.log('Navigating to product detail:', pid);
    router.push(`/product/${pid}`);
  } else {
    console.error('Product ID is undefined or null');
  }
};

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
    product.inCart = true;
    // Optionally show a success message
  } catch (error) {
    console.error('Error adding product to cart:', error);
    // Optionally show an error message
  }
};

const toggleFavorite = async (product) => {
  try {
    const user_id = JSON.parse(localStorage.getItem('user')).id;
    const newFavoriteStatus = !product.isFavorite;

    if (newFavoriteStatus) {
      const body = {
        pid: product.pid,
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

onMounted(async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const user_id = user ? user.id : null;

    if (!user_id) {
      console.error('User ID is not available in local storage');
      loading.value = false;
      return;
    }

    const [favoritesResponse, cartResponse] = await Promise.all([
      favouriteService.getFavourite({ type: 'favorites' }, user_id),
      card.getCart(user_id)
    ]);

    const cartItems = new Set(cartResponse.data.map(item => item.pid));

    products.value = favoritesResponse.data.map(item => ({
      ...item.products,
      fid: item.fid,
      isFavorite: item.isFavorite,
      inCart: cartItems.has(item.pid),
      pid: item.pid
    }));

    console.log('Products fetched:', products.value);
  } catch (error) {
    console.error('Error fetching favorites and cart items:', error);
  } finally {
    loading.value = false;
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