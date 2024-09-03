<template>
    <div class="bg-gray-100 min-h-screen p-4">
        <div class="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <!-- Cart Items -->
            <div v-if="loading" class="p-4 text-center">
                Loading...
            </div>
            <div v-else-if="cartItems.length === 0" class="p-4 text-center">
                Your cart is empty.
            </div>
            <div v-else class="divide-y">
                <div v-for="item in cartItems" :key="item.id" class="flex items-center p-4">
                    <img :src="item.image" alt="Product Image" class="w-16 h-16 object-cover rounded-md mr-4">
                    <div class="flex-grow">
                        <h2 class="font-semibold">{{ item.name }}</h2>
                        <p class="text-sm text-gray-600">Stock: {{ item.qty_product }}</p>
                        <p class="font-bold mt-1">${{ item.price }}</p>
                    </div>
                    <div>
                        <div class="flex items-center">
                            <button @click="decreaseQuantity(item)" class="text-gray-500 px-2" :disabled="item.qty <= 1">-</button>
                            <span class="mx-2">{{ item.qty }}</span>
                            <button @click="increaseQuantity(item)" class="text-gray-500 px-2">+</button>
                        </div>
                        <div class="items-center">
                            <LucideTrash @click="removeItem(item)" class="w-5 h-6 text-red-500 cursor-pointer ml-6 mt-2"/>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Total and Order Button -->
            <div class="p-4">
                <div class="flex justify-between items-center mb-4">
                    <span class="font-semibold">Total</span>
                    <span class="font-bold text-xl">${{ totalAmount }}</span>
                </div>
                <button @click="placeOrder" class="w-full bg-red-500 text-white py-3 rounded-md font-semibold">
                    Order Now
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apiCard from '@/services/card.service'
import { LucideTrash } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart.store' // Import Pinia store

const router = useRouter()
const cartStore = useCartStore() // Use Pinia store for cart

const cartItems = ref([])
const loading = ref(true)
const userId = ref('2') // Replace with actual user ID or authentication logic

const fetchCart = async () => {
    try {
        loading.value = true
        const response = await apiCard.getCart(userId.value)
        cartItems.value = response.data
        cartStore.cartItems = response.data // Sync with Pinia store
    } catch (error) {
        console.error('Error fetching cart:', error)
    } finally {
        loading.value = false
    }
}

// Compute total amount
const totalAmount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.price * item.qty, 0).toFixed(2)
})

const placeOrder = () => {
    cartStore.cartItems = cartItems.value // Sync with Pinia store
    router.push('/order')
}

// New methods for increasing and decreasing quantity
const increaseQuantity = (item) => {
    if (item.qty < item.qty_product) {
        item.qty++
    } else {
        alert('Cannot exceed stock quantity.')
    }
}

const decreaseQuantity = (item) => {
    if (item.qty > 1) {
        item.qty--
    }
}

const removeItem = async (item) => {
    try {
        await apiCard.deleteCart(item.cart_id) // Assuming `item.id` is the `cid`
        const index = cartItems.value.indexOf(item)
        if (index !== -1) {
            cartItems.value.splice(index, 1)
        }
    } catch (error) {
        console.error('Error removing item:', error)
    }
}

onMounted(fetchCart)
</script>

