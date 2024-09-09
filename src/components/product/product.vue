<template>
  <div class="container mt-[0px] mx-auto mb-12  p-4">

    <!-- Search Input -->
    <div class="mb-4">
      <input v-model="searchQuery" @input="handleSearch" type="text" placeholder="Search by name"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>

    <nav class="mb-4 relative">
      <div class="overflow-x-auto scrollbar-hide">
        <div class="flex space-x-2 pb-2">
          <button v-for="category in categories" :key="category.name" @click="selectCategory(category)"
            class="flex flex-col font-noto-sans-lao items-center justify-center rounded-lg p-3 min-w-[80px] transition-all duration-200 transform hover:scale-105"
            :class="selectedCategory === category.name ? 'bg-red-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'">
            <component :is="category.icon" class="h-6 w-6 mb-1" />
            <span class="text-xs font-medium text-center">{{ category.name }}</span>
          </button>
        </div>
      </div>
    </nav>
    <div v-if="loading" class="p-6 text-center">
      <svg class="animate-spin h-8 w-8 text-blue-500 mx-auto" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0z" />
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
      </svg>
      <p class="text-gray-600 font-noto-sans-lao mt-4">ກຳລັງໂຫລດ...</p>
    </div>
    <div v-else-if="!products.length" class="p-6 text-center">
      <p class="font-noto-sans-lao text-gray-600">ບໍມີລາຍການສິນຄ້າ</p>
    </div>
    <!-- Product Grid -->
    <div class="grid grid-cols-2 gap-4 mt-4 md:grid-cols-3 lg:grid-cols-4">
      <div v-for="product in products" :key="product.pid"
        class="bg-white rounded-lg overflow-hidden shadow-md relative transition-all duration-300 hover:shadow-xl">
        <img :src="product.image || '/api/placeholder/300/200'" :alt="product.name" class="w-full h-48 object-cover"
          @click="navigateToProductDetail(product.pid)">
        <button @click.stop="toggleFavorite(product)" class="absolute top-2 right-2 transition-colors duration-200"
          :class="product.isFavorite ? 'text-red-500' : 'text-gray-400'" aria-label="Toggle favorite">
          <Heart class="h-6 w-6"
            :class="{ 'fill-current': product.isFavorite, 'stroke-current': !product.isFavorite }" />
        </button>

        <div class="p-4" @click="navigateToProductDetail(product.pid)">
          <div class="flex items-center mb-2">
            <div class="flex text-yellow-400">
              <Star v-for="i in 5" :key="i" class="h-4 w-4"
                :class="i <= Math.floor(parseFloat(product.rating)) ? 'fill-current' : 'stroke-current'" />
            </div>
            <span class="ml-1 text-sm text-gray-600">{{ product.rating }}</span>
          </div>
          <p class="text-gray-600 font-noto-sans-lao  text-sm mb-1 line-clamp-2">{{ product.description }}</p>
          <h3 class="font-semibold font-noto-sans-lao text-lg mb-2">{{ product.name }}</h3>
          <div class="flex justify-between items-baseline">
            <span class="text-lg font-noto-sans-lao font-bold">${{ product.price }}</span>
          </div>
          <button @click.stop="addToCart(product)"
            class="bg-red-500 text-white font-semibold py-2 px-4 font-noto-sans-lao rounded-lg mt-2 w-full"
            :disabled="product.inCart" :class="{ 'opacity-50 cursor-not-allowed': product.inCart }">
            {{ product.inCart ? 'ຢູ່ໃນກະຕ່າແລ້ວ' : 'ເພີ່ມເຂົ້າກະຕ່າ' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Star, Heart, Shirt, ShoppingBag, WatchIcon, Binoculars, Package2Icon } from 'lucide-vue-next'
import productService from '@/services/product.service'
import favouriteService from '@/services/favourite.service'
import card from '../../services/card.service'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const selectedCategory = ref('ສິນຄໍາທັງໝົດ')
const products = ref([])
const loading = ref(true)

const categories = [
  { name: 'ສິນຄໍາທັງໝົດ', icon: Star, ptid: null },
  { name: 'ເສື້ອ', icon: Shirt, ptid: 1 },
  { name: 'ເກີບ', icon: Binoculars, ptid: 2 },
  { name: 'ໂສ້ງ', icon: Package2Icon, ptid: 3 },
  { name: 'ໂມງ', icon: WatchIcon, ptid: 4 },
  { name: 'ເຄື່ອງປະດັບ', icon: ShoppingBag, ptid: 5 }
]

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
      // You might want to redirect to login page or show a message
      return;
    }

    const body = {
      user_id: user.id,
      pid: product.pid,
      qty: 1
    };

    const response = await card.createCart(body);
    console.log('Product added to cart:', response.data);
    product.inCart = true; // Update the local state
  } catch (error) {
    console.error('Error adding product to cart:', error);
  }
};

const toggleFavorite = async (product) => {
  try {
    const user_id = JSON.parse(localStorage.getItem('user')).id;
    const newFavoriteStatus = !product.isFavorite;

    if (newFavoriteStatus) {
      const body = {
        fid: product.pid,
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

const fetchProducts = async () => {
  loading.value = true; // Set loading to true at the start

  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const user_id = user ? user.id : null;

    if (!user_id) {
      console.error('User ID is not available in local storage');
      return;
    }

    const selectedCategoryObj = categories.find(cat => cat.name === selectedCategory.value);
    const ptid = selectedCategoryObj ? selectedCategoryObj.ptid : null;

    const [productsResponse, favoritesResponse, cartResponse] = await Promise.all([
      productService.getProduct(user_id, ptid, searchQuery.value),
      favouriteService.getFavourite({}, user_id),
      card.getCart(user_id)
    ]);

    const favorites = new Map(favoritesResponse.data.map(fav => [fav.pid, fav.fid]));
    const cartItems = new Set(cartResponse.data.map(item => item.pid));

    products.value = productsResponse.data.map(product => ({
      ...product,
      isFavorite: favorites.has(product.pid),
      fid: favorites.get(product.pid) || null,
      inCart: cartItems.has(product.pid)
    }));

    console.log('Products fetched:', products.value);
  } catch (error) {
    console.error('Error fetching products, favorites, and cart items:', error);
  } finally {
    loading.value = false; // Set loading to false when done (success or error)
  }
};

const handleSearch = () => {
  fetchProducts();
};

const selectCategory = (category) => {
  selectedCategory.value = category.name;
  fetchProducts();
};

onMounted(fetchProducts);

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