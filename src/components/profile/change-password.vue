<template>
    <div class="max-w-md mx-auto p-4">
        <h1 class="text-2xl font-bold mb-6 font-noto-sans-lao">ປ່ຽນລະຫັດຜ່ານ</h1>

        <form @submit.prevent="handleChangePassword">
            <!-- Old Password -->
            <div class="mb-4 relative">
                <label for="oldPassword" class="block text-sm font-medium text-gray-700 font-noto-sans-lao">
                    ລະຫັດຜ່ານເກົ່າ
                </label>
                <input :type="showOldPassword ? 'text' : 'password'" id="oldPassword" v-model="oldPassword"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required />
                <EyeOff v-if="showOldPassword" @click="toggleShowOldPassword"
                    class="absolute right-2 top-10 cursor-pointer" />
                <Eye v-else @click="toggleShowOldPassword" class="absolute right-2 top-10 cursor-pointer" />
            </div>

            <!-- New Password -->
            <div class="mb-4 relative">
                <label for="newPassword" class="block text-sm font-medium text-gray-700 font-noto-sans-lao">
                    ລະຫັດຜ່ານໃໝ່
                </label>
                <input :type="showNewPassword ? 'text' : 'password'" id="newPassword" v-model="newPassword"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required />
                <EyeOff v-if="showNewPassword" @click="toggleShowNewPassword"
                    class="absolute right-2 top-10 cursor-pointer" />
                <Eye v-else @click="toggleShowNewPassword" class="absolute right-2 top-10 cursor-pointer" />
            </div>

            <!-- Confirm New Password -->
            <div class="mb-6 relative">
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700 font-noto-sans-lao">
                    ຢືນຢັນລະຫັດຜ່ານໃໝ່
                </label>
                <input :type="showConfirmPassword ? 'text' : 'password'" id="confirmPassword" v-model="confirmPassword"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required />
                <EyeOff v-if="showConfirmPassword" @click="toggleShowConfirmPassword"
                    class="absolute right-2 top-10 cursor-pointer" />
                <Eye v-else @click="toggleShowConfirmPassword" class="absolute right-2 top-10 cursor-pointer" />
            </div>

            <div v-if="errorMessage" class="text-red-500 text-sm mb-4">{{ errorMessage }}</div>

            <button type="submit"
                class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 font-noto-sans-lao">
                ປ່ຽນລະຫັດຜ່ານ
            </button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/login.service' // Ensure this is the correct path
import { Eye, EyeOff } from 'lucide-vue-next'

// Router instance
const router = useRouter()

// Reactive state for form fields and password visibility
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Toggle functions for showing/hiding passwords
const toggleShowOldPassword = () => showOldPassword.value = !showOldPassword.value
const toggleShowNewPassword = () => showNewPassword.value = !showNewPassword.value
const toggleShowConfirmPassword = () => showConfirmPassword.value = !showConfirmPassword.value

// Handle password change form submission
const handleChangePassword = async () => {
    errorMessage.value = ''

    if (newPassword.value !== confirmPassword.value) {
        errorMessage.value = 'ລະຫັດຜ່ານບໍ່ກົງກັນ.'
        return
    }

    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user'))
    const userId = userData?.id // Access user ID from the stored data

    try {
        const response = await apiService.changePassword(userId, {
            oldPassword: oldPassword.value,
            newPassword: newPassword.value
        })

        if (response.data.success) {
            router.push('/profile') // Redirect to home or any other page after success
        } else {
            errorMessage.value = response.data.message || 'ມີບັນຫາການປ່ຽນລະຫັດຜ່ານ.'
        }
    } catch (error) {
        errorMessage.value = 'ມີບັນຫາການປ່ຽນລະຫັດຜ່ານ.'
    }
}
</script>