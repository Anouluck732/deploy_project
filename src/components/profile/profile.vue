<template>
    <div class="max-w-md mx-auto p-4">
      <div class="mb-4 flex justify-center">
        <div class="relative">
          <img
            src="@/assets/images/null-data.png"
            alt="Profile Picture"
            class="w-24 h-24 rounded-full object-cover"
          />
          <div class="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </div>
      <form @submit.prevent="saveChanges" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label for="dob" class="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            id="dob"
            v-model="form.dob"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label for="country" class="block text-sm font-medium text-gray-700">Country/Region</label>
          <select
            id="country"
            v-model="form.country"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select a country</option>
            <option v-for="country in countries" :key="country.code" :value="country.code">
              {{ country.name }}
            </option>
          </select>
        </div>
        <div v-if="isLoading" class="text-center text-gray-500">
          Loading countries...
        </div>
        <div v-if="error" class="text-center text-red-500">
          {{ error }}
        </div>
        <div>
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const form = ref({
    name: 'Melissa Peters',
    email: 'mpeters@gmail.com',
    password: '••••••••••••',
    dob: '1995-05-23',
    country: ''
  })
  
  const countries = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  
  const fetchCountries = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2')
      if (!response.ok) {
        throw new Error('Failed to fetch countries')
      }
      const data = await response.json()
      countries.value = data.map(country => ({
        code: country.cca2,
        name: country.name.common
      })).sort((a, b) => a.name.localeCompare(b.name))
    } catch (e) {
      console.error('Error fetching countries:', e)
      error.value = 'Failed to load countries. Please try again later.'
    } finally {
      isLoading.value = false
    }
  }
  
  onMounted(() => {
    fetchCountries()
  })
  
  const saveChanges = () => {
    // Implement save logic here
    console.log('Form submitted:', form.value)
  }
  </script>