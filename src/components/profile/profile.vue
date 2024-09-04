<template>
  <div class="max-w-md mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">My profile</h1>
    
    <div class="flex items-center mb-6">
      <img
        src="@/assets/images/null-data.png"
        alt="Profile"
        class="w-16 h-16 rounded-full mr-4"
      />
      <div>
        <h2 class="text-xl font-semibold">{{ profile.name }}</h2>
        <p class="text-gray-500">{{ profile.email }}</p>
      </div>
    </div>

    <div 
      v-for="(item, index) in profileItems" 
      :key="index"
      class="flex items-center justify-between py-4 border-b border-gray-200 cursor-pointer"
      @click="handleItemClick(item.title)"
    >
      <div>
        <h3 class="text-base font-semibold">{{ item.title }}</h3>
        <p class="text-sm text-gray-500">{{ item.subtitle }}</p>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const profile = ref({
  name: 'Matilda Brown',
  email: 'matildabrown@mail.com',
})

const profileItems = ref([
  { title: 'My orders', subtitle: 'Already have 12 orders' },
  { title: 'Shipping addresses', subtitle: '3 addresses' },
  { title: 'Payment methods', subtitle: 'Visa **34' },
  { title: 'Promocodes', subtitle: 'You have special promocodes' },
  { title: 'My reviews', subtitle: 'Reviews for 4 items' },
  { title: 'Settings', subtitle: 'Notifications, password' },
])

const handleItemClick = (item) => {
  console.log(`Clicked on ${item}`)
  // Implement navigation or modal opening logic here
}
</script>