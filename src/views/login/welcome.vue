<template>
    <div class="min-h-screen bg-gradient-to-br from-red-500 to-white flex flex-col justify-center items-center p-4">
      <div class="bg-white rounded-xl w-full max-w-md p-8 space-y-8">
        <img src="https://img.freepik.com/premium-vector/online-shop-logo-designs-template-easy-shop-logo_729049-79.jpg" class="h-[300px] mx-auto" alt="">
        <h1 class="text-3xl font-bold text-center font-noto-sans-lao text-red-600">ຍິນດີຕ້ອນຮັບສູ່ລະບົບຂາຍເຄື່ອງຊາຍອອນລາຍ</h1>
        <form @submit.prevent="handleLogin" class="space-y-6">
          <button type="submit" class="w-full py-2 px-4 border font-noto-sans-lao border-red-600 rounded-full text-red-600 hover:bg-red-50 transition duration-200">
            ເຂົ້າສູ່ລະບົບ
          </button>
          
          <button type="button" @click="handleSignUp" class="w-full py-2 px-4 font-noto-sans-lao bg-red-600 rounded-full text-white hover:bg-red-700 transition duration-200">
           ລົງທະບຽນ
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
import router from '@/router';

  const handleLogin = () => {
    // Implement login logic here
    router.push('/login')
  }
  
  const handleSignUp = () => {
    // Implement sign up logic here
    router.push('/register')

  }
  </script>