<template>
  <div class="flex flex-col min-h-screen">
    <header v-if="showHeader"
      class="top-0 left-0 w-full bg-red-600 z-10 flex items-center justify-between p-4 shadow-md pt-5">
      <button class="text-2xl text-white" aria-label="Go back" @click="goBack">
        <ArrowLeft />
      </button>
      <h1 class="text-xl font-bold text-white">Fashion Men Store</h1>
      <div class="relative">
        <ShoppingCartIcon @click="() => router.push('/cart')" class="text-white h-6 w-6 cursor-pointer"
          aria-label="Cart" />
        <span v-if="cartTotal > 0"
          class="absolute -top-2 -right-2 bg-yellow-400 text-xs text-black font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {{ cartTotal }}
        </span>
      </div>
    </header>

    <main class="flex-grow overflow-y-auto">
  <slot></slot>
</main>


    <nav v-if="showNav" class="fixed bottom-0 w-full left-0 right-0 bg-white border-t border-gray-200">
      <div class="flex justify-around items-center h-16">
        <router-link v-for="(item, index) in navItems" :key="index" :to="item.route" custom
          v-slot="{ navigate, isActive }">
          <a @click="navigate" @keypress.enter="navigate" role="link"
            class="flex flex-col font-noto-sans-lao items-center w-full flex-shrink-0 mx-2"
            :class="[isActive ? 'text-red-500' : 'text-gray-600 hover:text-red-500']" tabindex="0">
            <component :is="item.icon" class="w-6 h-6" />
            <span class="text-xs mt-1 whitespace-nowrap">{{ item.label }}</span>
          </a>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Home, ShoppingCart, Heart, Settings, ArrowLeft, ShoppingCartIcon, Flame } from 'lucide-vue-next';
import cartService from '@/services/card.service'; // Corrected to 'cartService'

const router = useRouter();
const route = useRoute();

const navItems = ref([
  { icon: Home, label: 'ໜ້າຫຼັກ', route: '/product' },
  { icon: Flame, label: 'ສິນຄ້າທີ່ນິຍົມ', route: '/popular' },
  { icon: Heart, label: 'ສິນຄ້າທີ່ມັກ', route: '/favourite' },
  { icon: ShoppingCart, label: 'ປະຫວັດການຊື້', route: '/history' },
  { icon: Settings, label: 'ຕັ້ງຄ່າ', route: '/profile' }
]);

const showHeader = computed(() => !['Login','welcome','register'].includes(route.name));
const showNav = computed(() => !['Login','welcome','register'].includes(route.name));

const goBack = () => {
  router.back();
};

const cartTotal = ref(0);

const updateCartTotal = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.id) {
      const response = await cartService.getTotal(user.id);

      // Extract the count value from the response data
      const count = response.data.count || 0;
      cartTotal.value = count;

      console.log('Cart total:', cartTotal.value);
    }
  } catch (error) {
    console.error('Error fetching cart total:', error);
  }
};
onMounted(updateCartTotal);

watch(() => route.path, updateCartTotal);

defineExpose({ updateCartTotal });
</script>

<style scoped>
nav {
  -webkit-overflow-scrolling: touch;
  /* for smooth scrolling on iOS */
}
</style>
